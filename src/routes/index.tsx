import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "../components/site/Header";
import { ArrowRight, Cpu, QrCode, ScanLine, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SPM ECO — 3D Smart Parking Management" },
      { name: "description", content: "Pure Black 3D Smart Parking Architecture Simulation." },
    ],
  }),
  component: Home,
});

function Home() {
  const [particles, setParticles] = useState<{ id: number; left: string; size: string; duration: string; delay: string }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2.5 + 1}px`,
      duration: `${Math.random() * 12 + 10}s`,
      delay: `-${Math.random() * 10}s`,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col text-white selection:bg-white selection:text-black">
      
      {/* Silver Dust 3D Background */}
      <div className="particle-container">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle-black"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: p.duration,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <Header />
        <Hero />
        <Highlights />
        <Sections />
        <Footer />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden flex-1 flex items-center pt-8 pb-20">
      <div className="absolute inset-0 grid-black" />
      <div className="absolute inset-x-0 top-0 h-[400px] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.07),_transparent_70%)]" />
      
      <div className="relative mx-auto w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between px-6 gap-12 z-10">
        
        {/* Left Side: 3D Typography Hero */}
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[10px] font-mono uppercase tracking-[0.3em] text-gray-300 backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-emerald-400" /> NEXT-GEN PARKING ARCHITECTURE
          </div>
          
          <h1 className="text-3d text-6xl font-black tracking-tighter lg:text-8xl uppercase">
            SPM ECO
          </h1>
          
          <h2 className="text-xl lg:text-3xl font-light tracking-[0.2em] text-gray-400 font-mono">
            3D AUTOMATION PROTOCOL
          </h2>
          
          <div className="space-y-2 pt-4 border-l border-white/20 pl-5">
            <p className="max-w-xl text-sm leading-relaxed text-gray-400 font-light">
              An enterprise-grade demonstration of ANPR-based parking automation, real-time booking,
              dynamic AI pricing, and touch-free QR checkouts.
            </p>
            <p className="text-emerald-400 text-[11px] tracking-widest font-mono font-bold uppercase mt-2">
              ● SYSTEM LIVE — WESTERN PROVINCE GRID
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 pt-4">
            <Link
              to="/simulation"
              className="group relative inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black hover:bg-gray-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              LAUNCH 3D DEMO
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-xs font-mono tracking-widest uppercase text-gray-300 hover:bg-white/10 hover:text-white transition-all"
            >
              SPECS & ARCHITECTURE
            </Link>
          </div>
        </div>

        {/* Right Side: Matte Black 3D Card */}
        <div className="flex-1 flex justify-end w-full">
          <div className="group relative w-full max-w-lg rounded-3xl bg-[#080808] border border-white/15 p-2 shadow-[0_25px_60px_-15px_rgba(0,0,0,1)] transition-all duration-500 hover:border-white/30">
            
            <div className="relative z-10 w-full rounded-2xl overflow-hidden bg-[#0c0c0c] border border-white/10 p-6">
              
              <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-gray-400 border-b border-white/10 pb-4">
                <span>CONSOLE // LIVE MONITOR</span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" /> ACTIVE
                </span>
              </div>
              
              {/* Stats */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { l: "FREE SLOTS", v: "14", c: "#10b981" },
                  { l: "RESERVED", v: "06", c: "#3b82f6" },
                  { l: "OCCUPIED", v: "04", c: "#ef4444" },
                ].map((t) => (
                  <div key={t.l} className="rounded-xl border border-white/5 bg-[#141414] p-3.5">
                    <div className="text-[9px] font-mono tracking-wider text-gray-400">{t.l}</div>
                    <div className="mt-1 font-display text-2xl font-bold" style={{ color: t.c }}>
                      {t.v}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* LED Grid Map */}
              <div className="mt-4 rounded-xl border border-white/5 bg-[#121212] p-4">
                <div className="mb-3 text-[9px] font-mono tracking-widest text-gray-400 flex justify-between">
                  <span>LIVE MATRIX</span>
                  <span className="text-gray-600">SECTOR-01</span>
                </div>
                <div className="grid grid-cols-8 gap-2">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const c = i % 7 === 0 ? "#ef4444" : i % 5 === 0 ? "#3b82f6" : "#10b981";
                    return (
                      <div
                        key={i}
                        className="aspect-square rounded-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                        style={{ background: c, boxShadow: `0 0 10px ${c}40` }}
                      />
                    );
                  })}
                </div>
              </div>
              
              {/* ANPR Reader */}
              <div className="mt-4 flex items-center gap-4 rounded-xl border border-white/10 bg-black p-4">
                <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                  <ScanLine className="h-5 w-5 text-white animate-pulse" />
                </div>
                <div className="text-xs font-mono">
                  <div className="font-bold text-white tracking-wider">PLATE: WP-CAR-2841</div>
                  <div className="text-emerald-400 text-[10px] mt-0.5">STATUS: ACCESS GRANTED</div>
                </div>
              </div>

            </div>
            
            <div className="px-6 py-3.5 flex justify-between items-center text-[10px] font-mono text-gray-500">
               <span>LATENCY: 12ms</span>
               <span>ENCRYPTION: 256-BIT</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

function Highlights() {
  const items = [
    { icon: ScanLine, title: "ANPR Optical Gate", text: "Sub-second neural plate recognition." },
    { icon: Cpu, title: "AI Slot Allocation", text: "Assigns optimal trajectory to nearest bay." },
    { icon: Wallet, title: "Dynamic Overtime", text: "Algorithmic billing based on demand load." },
    { icon: QrCode, title: "Zero-Touch Exit", text: "Instant cryptographic token checkout." },
    { icon: ShieldCheck, title: "Perimeter Shield", text: "Automated alerts for rogue overstays." },
  ];
  return (
    <section className="relative z-10 border-y border-white/10 bg-[#050505]">
      <div className="mx-auto grid max-w-7xl gap-4 px-6 py-12 sm:grid-cols-2 lg:grid-cols-5">
        {items.map((i) => (
          <div key={i.title} className="group rounded-2xl border border-white/5 bg-[#0a0a0a] p-6 hover:border-white/25 transition-all">
            <i.icon className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            <div className="mt-5 font-display text-sm font-bold text-white tracking-wide">{i.title}</div>
            <div className="mt-2 text-xs text-gray-400 leading-relaxed">{i.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Sections() {
  return (
    <section id="story" className="relative z-10 mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500">
            LIFECYCLE TIMELINE
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white">
            End-to-End Autonomous Sequence.
          </h2>
          <p className="mt-4 text-gray-400 text-sm leading-relaxed font-light">
            Walk through the exact 11-step protocol triggered when a vehicle crosses the geofence threshold.
          </p>
          <Link
            to="/simulation"
            className="mt-8 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white hover:underline decoration-white/50 underline-offset-8"
          >
            VIEW SEQUENCE <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="lg:col-span-2">
          <ol className="grid gap-3 sm:grid-cols-2 font-mono">
            {[
              ["01", "GEOFENCE ENTRY DETECTED"],
              ["02", "MOBILE TOKEN HANDSHAKE"],
              ["03", "OPTICAL PLATE SCAN (ANPR)"],
              ["04", "VEHICLE CLASS INDEXING"],
              ["05", "BAY ROUTING ASSIGNMENT"],
              ["06", "CONSOLE TELEMETRY SYNC"],
              ["07", "LOAD-BASED PRICING TIER"],
              ["08", "QR CRYPTO CHECKOUT"],
              ["09", "RETAIL VALIDATION LOG"],
              ["10", "BARRIER RELEASE TRIGGER"],
              ["11", "SESSION ARCHIVE STORE"],
            ].map(([n, t]) => (
              <li
                key={n}
                className="flex items-center gap-4 rounded-xl border border-white/5 bg-[#0a0a0a] p-4 hover:border-white/20 transition-colors"
              >
                <span className="text-xs text-gray-500">{n}</span>
                <span className="text-xs font-medium text-gray-300 tracking-wider">{t}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-[11px] font-mono text-gray-400 sm:flex-row tracking-wider">
        <span>SPM ECO // PROTOCOL BUILD 2026.4</span>
        <span>SYSTEM_ENGINE: THREE.JS + REACT</span>
      </div>
    </footer>
  );
}