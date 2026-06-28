import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../components/site/Header";
import {
  BellRing,
  CarFront,
  Cpu,
  LayoutDashboard,
  QrCode,
  ScanLine,
  ShieldAlert,
  Timer,
  Wallet,
} from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — SPM ECO Smart Parking" },
      {
        name: "description",
        content:
          "Real-time availability, ANPR automation, slot assignment, dynamic pricing, QR payment, overstay detection and operator dashboard.",
      },
      { property: "og:title", content: "SPM ECO Features" },
      {
        property: "og:description",
        content: "Every feature that powers the SPM ECO smart parking platform.",
      },
    ],
  }),
  component: FeaturesPage,
});

const FEATURES = [
  {
    icon: CarFront,
    t: "Real-time parking availability",
    d: "Live slot status across every lot with sub-second updates.",
  },
  {
    icon: ScanLine,
    t: "ANPR gate automation",
    d: "OpenCV-based plate recognition opens barriers automatically.",
  },
  {
    icon: Cpu,
    t: "Smart slot assignment",
    d: "Reserves the closest matching slot for every booking.",
  },
  {
    icon: Wallet,
    t: "Dynamic pricing",
    d: "Peak hours, duration tiers and overtime billing on the fly.",
  },
  { icon: QrCode, t: "QR payment", d: "Frictionless checkout with instant exit token." },
  {
    icon: Timer,
    t: "Retail overstay detection",
    d: "Flags vehicles that exceed the free parking window.",
  },
  {
    icon: LayoutDashboard,
    t: "Operator dashboard",
    d: "Live counters, revenue, alerts and a parking heatmap.",
  },
  {
    icon: ShieldAlert,
    t: "Security alerts",
    d: "Unauthorized vehicles trigger instant operator notifications.",
  },
];

function FeaturesPage() {
  return (
    <div className="min-h-screen bg-navy-deep text-white">
      <Header />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-[11px] uppercase tracking-[0.3em] text-cyan-glow">Features</div>
        <h1 className="mt-3 font-display text-4xl font-semibold">
          Everything you need to operate a smart parking facility.
        </h1>
        <p className="mt-3 max-w-2xl text-white/70">
          A modular platform that combines mobile booking, ANPR-based gate automation, dynamic
          pricing and an operator-grade dashboard.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.t}
              className="rounded-2xl border border-white/8 bg-navy/40 p-5 transition hover:border-cyan-glow/40 hover:bg-navy"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-glow/15 text-cyan-glow">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 font-display font-semibold">{f.t}</div>
              <div className="mt-1 text-sm text-white/65">{f.d}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
