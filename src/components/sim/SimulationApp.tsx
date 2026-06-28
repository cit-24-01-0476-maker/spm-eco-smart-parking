import { Suspense, lazy, useEffect } from "react";
import { Dashboard } from "./Dashboard";
import { ControlPanel } from "./ControlPanel";
import { PricingPanel, QRPaymentPanel, StoryOverlay } from "./StoryOverlay";
import { LoadingScreen } from "./LoadingScreen";
import { STORY_SEQUENCE, useSim } from "../../lib/simulation-store";

const ParkingScene = lazy(() => import("../scene/ParkingScene"));

/** Drives the story timeline: cycles through steps with delays and triggers actions. */
function StoryDriver() {
  const storyMode = useSim((s) => s.storyMode);
  const step = useSim((s) => s.step);
  const presentation = useSim((s) => s.presentationMode);

  useEffect(() => {
    if (!storyMode) return;
    const idx = STORY_SEQUENCE.indexOf(step as (typeof STORY_SEQUENCE)[number]);
    if (idx < 0) return;
    const dwell = presentation ? 7000 : 6000;

    // Side effects per step
    const state = useSim.getState();
    if (step === "booking") {
      useSim.setState({ bookingVisible: true });
    } else {
      useSim.setState({ bookingVisible: false });
    }
    if (step === "arrival" || step === "classification") {
      if (state.vehicles.length === 0) state.addVehicle("prebooked");
      if (
        step === "classification" &&
        state.vehicles.filter((v) => v.klass === "unauthorized").length === 0
      ) {
        setTimeout(() => useSim.getState().triggerUnauthorized(), 1200);
      }
    }
    if (step === "assignment") {
      if (state.vehicles.filter((v) => v.klass === "prebooked").length < 2)
        state.addVehicle("prebooked");
    }
    if (step === "pricing") {
      useSim.setState({ pricingVisible: true });
    } else {
      useSim.setState({ pricingVisible: false });
    }
    if (step === "payment") {
      useSim.setState({ paymentVisible: true });
    } else {
      useSim.setState({ paymentVisible: false });
    }
    if (step === "overstay") {
      state.triggerOverstay();
    }

    const t = setTimeout(() => {
      const cur = useSim.getState().step;
      if (cur !== step) return;
      if (idx >= STORY_SEQUENCE.length - 1) {
        if (!presentation) {
          useSim.setState({ storyMode: false });
        } else {
          useSim.getState().setStep(STORY_SEQUENCE[0]);
        }
      } else {
        useSim.getState().nextStep();
      }
    }, dwell);
    return () => clearTimeout(t);
  }, [step, storyMode, presentation]);

  return null;
}

/** Periodically seed traffic when playing (non-story). */
function AmbientTraffic() {
  const playing = useSim((s) => s.playing);
  const storyMode = useSim((s) => s.storyMode);
  useEffect(() => {
    if (!playing || storyMode) return;
    const i = setInterval(() => {
      const state = useSim.getState();
      if (state.vehicles.length < 6) {
        const classes = ["prebooked", "staff", "walkin", "delivery"] as const;
        state.addVehicle(classes[Math.floor(Math.random() * classes.length)]);
      }
    }, 4500);
    return () => clearInterval(i);
  }, [playing, storyMode]);
  return null;
}

export function SimulationApp() {
  return (
    <div className="relative grid h-[calc(100vh-4rem)] w-full grid-cols-1 lg:grid-cols-[1fr_360px]">
      <div className="relative">
        <Suspense fallback={<LoadingScreen />}>
          <ParkingScene />
        </Suspense>
        <StoryOverlay />
        <PricingPanel />
        <QRPaymentPanel />
        <StoryDriver />
        <AmbientTraffic />
        {/* Floating brand badge */}
        <div className="pointer-events-none absolute left-6 top-6 z-10 rounded-full border border-cyan-glow/30 bg-navy-deep/70 px-4 py-1.5 text-xs text-cyan-glow backdrop-blur">
          SPM ECO · 3D Operations View
        </div>
      </div>
      <aside className="border-l border-white/5 bg-navy-deep">
        <div className="border-b border-white/5">
          <ControlPanel />
        </div>
        <Dashboard />
      </aside>
    </div>
  );
}
