import { useSim, type CameraView } from "../../lib/simulation-store";
import {
  Camera,
  CarFront,
  Pause,
  Play,
  PlayCircle,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  TimerReset,
} from "lucide-react";

const VIEWS: { id: CameraView; label: string }[] = [
  { id: "cinematic", label: "Cinematic" },
  { id: "top", label: "Top" },
  { id: "entrance", label: "Entrance" },
  { id: "slot", label: "Slot" },
  { id: "dashboard", label: "Dashboard" },
  { id: "exit", label: "Exit" },
];

export function ControlPanel() {
  const playing = useSim((s) => s.playing);
  const setPlaying = useSim((s) => s.setPlaying);
  const reset = useSim((s) => s.reset);
  const addVehicle = useSim((s) => s.addVehicle);
  const triggerUnauthorized = useSim((s) => s.triggerUnauthorized);
  const triggerOverstay = useSim((s) => s.triggerOverstay);
  const startStory = useSim((s) => s.startStory);
  const startPresentation = useSim((s) => s.startPresentation);
  const cameraView = useSim((s) => s.cameraView);
  const setCameraView = useSim((s) => s.setCameraView);

  return (
    <div className="space-y-3 p-3">
      <div className="grid grid-cols-2 gap-2">
        <Btn
          icon={playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          onClick={() => setPlaying(!playing)}
          primary
        >
          {playing ? "Pause" : "Start"}
        </Btn>
        <Btn icon={<RotateCcw className="h-3.5 w-3.5" />} onClick={reset}>
          Reset
        </Btn>
        <Btn icon={<CarFront className="h-3.5 w-3.5" />} onClick={() => addVehicle("prebooked")}>
          Add Vehicle
        </Btn>
        <Btn icon={<ShieldAlert className="h-3.5 w-3.5" />} onClick={triggerUnauthorized}>
          Unauthorized
        </Btn>
        <Btn icon={<TimerReset className="h-3.5 w-3.5" />} onClick={triggerOverstay}>
          Overstay
        </Btn>
        <Btn icon={<Sparkles className="h-3.5 w-3.5" />} onClick={startStory}>
          Story Mode
        </Btn>
      </div>
      <button
        onClick={startPresentation}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-glow/40 bg-gradient-to-r from-cyan-glow/30 to-reserved/30 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:brightness-110"
      >
        <PlayCircle className="h-4 w-4" /> Presentation Mode
      </button>
      <div>
        <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-widest text-cyan-glow/70">
          <Camera className="h-3 w-3" /> Camera View
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              onClick={() => setCameraView(v.id)}
              className={`rounded-md border px-2 py-1.5 text-[11px] transition ${
                cameraView === v.id
                  ? "border-cyan-glow bg-cyan-glow/20 text-cyan-glow"
                  : "border-white/10 text-white/70 hover:bg-white/5"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Btn({
  children,
  onClick,
  icon,
  primary,
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon?: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 rounded-md border px-2 py-2 text-[11px] font-medium uppercase tracking-wider transition ${
        primary
          ? "border-cyan-glow bg-cyan-glow/20 text-cyan-glow hover:bg-cyan-glow/30"
          : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
