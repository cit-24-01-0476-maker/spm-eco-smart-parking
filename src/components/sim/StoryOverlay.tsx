import { AnimatePresence, motion } from "framer-motion";
import { STORY_CAPTIONS, useSim } from "../../lib/simulation-store";

export function StoryOverlay() {
  const step = useSim((s) => s.step);
  const storyMode = useSim((s) => s.storyMode);
  const cap = STORY_CAPTIONS[step];
  if (!storyMode || step === "idle") return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center pb-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl rounded-2xl border border-cyan-glow/30 bg-navy-deep/85 px-6 py-4 text-center text-white backdrop-blur-md"
          style={{ boxShadow: "0 8px 40px -10px #5cc8ff66" }}
        >
          <div className="text-[10px] uppercase tracking-[0.4em] text-cyan-glow">Step</div>
          <div className="mt-1 font-display text-xl font-semibold">{cap.title}</div>
          <div className="mt-1 text-sm text-white/80">{cap.body}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function PricingPanel() {
  const visible = useSim((s) => s.pricingVisible);
  if (!visible) return null;
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute right-6 top-24 z-10 w-72 rounded-2xl border border-cyan-glow/30 bg-navy-deep/90 p-4 text-white backdrop-blur-md"
    >
      <div className="text-[10px] uppercase tracking-widest text-cyan-glow">Dynamic Pricing</div>
      <div className="mt-2 space-y-1 text-sm">
        <Row k="Entry" v="14:32" />
        <Row k="Exit" v="17:08" />
        <Row k="Duration" v="2h 36m" />
        <Row k="Base rate" v="LKR 80/h" />
        <Row k="Peak factor" v="×1.3" />
        <Row k="Overtime" v="LKR 0" />
        <div className="my-2 h-px bg-white/10" />
        <Row k="Total" v="LKR 320" accent />
      </div>
    </motion.div>
  );
}

export function QRPaymentPanel() {
  const visible = useSim((s) => s.paymentVisible);
  if (!visible) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute left-1/2 top-1/2 z-10 w-72 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-cyan-glow/40 bg-navy-deep/95 p-5 text-center text-white backdrop-blur-md"
    >
      <div className="text-[10px] uppercase tracking-widest text-cyan-glow">QR Payment</div>
      <div className="mt-3 grid grid-cols-12 grid-rows-12 gap-px overflow-hidden rounded-lg bg-white p-2">
        {Array.from({ length: 144 }).map((_, i) => {
          const on = (i * 1103515245 + 12345) % 7 < 4;
          return (
            <div
              key={i}
              className={on ? "bg-navy-deep" : "bg-white"}
              style={{ width: 12, height: 12 }}
            />
          );
        })}
      </div>
      <div className="mt-3 text-sm font-medium text-[#3ad17e]">QR Payment Completed</div>
      <div className="text-xs text-white/60">LKR 320 · Ref #SPM-30481</div>
    </motion.div>
  );
}

function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/60">{k}</span>
      <span className={accent ? "text-cyan-glow font-semibold" : ""}>{v}</span>
    </div>
  );
}
