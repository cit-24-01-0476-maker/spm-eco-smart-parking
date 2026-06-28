import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../components/site/Header";

export const Route = createFileRoute("/technology")({
  head: () => ({
    meta: [
      { title: "Technology — SPM ECO Stack" },
      {
        name: "description",
        content:
          "The technology stack powering SPM ECO: React, Node.js, PostgreSQL, Redis, OpenCV ANPR, Tesseract OCR, cloud-hosted.",
      },
      { property: "og:title", content: "SPM ECO Technology Stack" },
      {
        property: "og:description",
        content:
          "React Native mobile, React dashboard, Node/Express backend, PostgreSQL, Redis, Python OpenCV ANPR.",
      },
    ],
  }),
  component: TechPage,
});

const STACK = [
  { g: "Client", items: ["React Native Mobile App", "React Web Dashboard"] },
  {
    g: "Backend",
    items: ["Node.js / Express API", "PostgreSQL Database", "Redis Real-time Cache"],
  },
  { g: "Vision", items: ["Python OpenCV ANPR", "Tesseract OCR"] },
  { g: "Infrastructure", items: ["AWS / GCP Cloud", "QR Payment Gateway"] },
];

function TechPage() {
  return (
    <div className="min-h-screen bg-navy-deep text-white">
      <Header />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-[11px] uppercase tracking-[0.3em] text-cyan-glow">Technology</div>
        <h1 className="mt-3 font-display text-4xl font-semibold">
          A modern, production-grade stack.
        </h1>
        <p className="mt-3 max-w-2xl text-white/70">
          Each layer is chosen for reliability, real-time performance and cloud-native deployment.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STACK.map((s) => (
            <div key={s.g} className="rounded-2xl border border-white/8 bg-navy/40 p-5">
              <div className="font-display text-sm font-semibold text-cyan-glow">{s.g}</div>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                {s.items.map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" /> {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
