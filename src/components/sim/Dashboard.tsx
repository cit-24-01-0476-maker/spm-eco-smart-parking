import { motion, AnimatePresence } from "framer-motion";
import { summary, useSim } from "../../lib/simulation-store";
import { Activity, Car, CircleDollarSign, ShieldAlert, Users } from "lucide-react";

function Tile({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <motion.div
      layout
      className="rounded-xl border border-cyan-glow/20 bg-navy-deep/60 p-3"
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}
    >
      <div className="text-[10px] uppercase tracking-widest text-cyan-glow/70">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold" style={{ color: accent ?? "#ffffff" }}>
        {value}
      </div>
    </motion.div>
  );
}

export function Dashboard() {
  const slots = useSim((s) => s.slots);
  const vehicles = useSim((s) => s.vehicles);
  const dailyCount = useSim((s) => s.dailyCount);
  const revenue = useSim((s) => s.revenue);
  const alert = useSim((s) => s.alert);
  const sum = summary(slots);
  const inside = vehicles.filter(
    (v) => v.state === "parked" || v.state === "drivingToSlot" || v.state === "leavingSlot",
  ).length;

  return (
    <div className="flex h-full flex-col gap-3 overflow-auto p-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-cyan-glow">
            Operator Console
          </div>
          <div className="font-display text-lg font-semibold">Live Parking Status</div>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-glow/20 text-cyan-glow">
          <Activity className="h-4 w-4 animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Tile label="Total Slots" value={sum.total} />
        <Tile label="Available" value={sum.available} accent="#3ad17e" />
        <Tile label="Reserved" value={sum.reserved} accent="#7aa8ff" />
        <Tile label="Occupied" value={sum.occupied} accent="#ff7a7a" />
        <Tile label="Vehicles Inside" value={inside} accent="#9ad8ff" />
        <Tile label="Daily Count" value={dailyCount} accent="#9ad8ff" />
      </div>

      <div className="rounded-xl border border-cyan-glow/20 bg-navy-deep/60 p-3">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-cyan-glow/70">
          <span>Revenue Today</span>
          <CircleDollarSign className="h-3.5 w-3.5" />
        </div>
        <div className="mt-1 font-display text-2xl font-bold text-white">
          LKR{" "}
          <motion.span key={revenue} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
            {revenue.toLocaleString()}
          </motion.span>
        </div>
      </div>

      {/* Mini map */}
      <div className="rounded-xl border border-cyan-glow/20 bg-navy-deep/60 p-3">
        <div className="mb-2 text-[10px] uppercase tracking-widest text-cyan-glow/70">
          Live Parking Map
        </div>
        <div className="grid grid-cols-8 gap-1">
          {slots.map((s) => (
            <div
              key={s.id}
              className="aspect-square rounded"
              style={{
                background:
                  s.status === "available"
                    ? "#3ad17e"
                    : s.status === "reserved"
                      ? "#5b8cff"
                      : "#ff5050",
                boxShadow: `0 0 6px ${s.status === "available" ? "#3ad17e" : s.status === "reserved" ? "#5b8cff" : "#ff5050"}80`,
              }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-white/60">
          <span>
            <i className="inline-block h-2 w-2 rounded-full bg-[#3ad17e]" /> Available
          </span>
          <span>
            <i className="inline-block h-2 w-2 rounded-full bg-[#5b8cff]" /> Reserved
          </span>
          <span>
            <i className="inline-block h-2 w-2 rounded-full bg-[#ff5050]" /> Occupied
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-cyan-glow/20 bg-navy-deep/60 p-3">
        <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-cyan-glow/70">
          <ShieldAlert className="h-3.5 w-3.5" /> Security Alerts
        </div>
        <AnimatePresence mode="wait">
          {alert ? (
            <motion.div
              key={alert}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-lg border border-[#ff7a7a]/40 bg-[#ff5050]/15 px-3 py-2 text-xs text-[#ffb0b0]"
            >
              {alert}
            </motion.div>
          ) : (
            <div className="text-xs text-white/40">No active alerts</div>
          )}
        </AnimatePresence>
      </div>

      <div className="rounded-xl border border-cyan-glow/20 bg-navy-deep/60 p-3">
        <div className="mb-2 text-[10px] uppercase tracking-widest text-cyan-glow/70">
          Active Vehicles
        </div>
        <div className="space-y-1.5">
          {vehicles.slice(0, 5).map((v) => (
            <div key={v.id} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2">
                <Car className="h-3 w-3 text-cyan-glow" />
                <span className="font-mono">{v.plate}</span>
              </span>
              <span className="text-white/60">{v.state}</span>
            </div>
          ))}
          {vehicles.length === 0 && (
            <div className="text-xs text-white/40">No vehicles on premises</div>
          )}
        </div>
      </div>
    </div>
  );
}
