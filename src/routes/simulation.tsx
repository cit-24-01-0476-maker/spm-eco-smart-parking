import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../components/site/Header";
import { SimulationApp } from "../components/sim/SimulationApp";

export const Route = createFileRoute("/simulation")({
  head: () => ({
    meta: [
      { title: "Simulation — SPM ECO 3D Smart Parking" },
      {
        name: "description",
        content:
          "Run the full 3D simulation: ANPR gate, smart slot assignment, dynamic pricing, QR payment, retail overstay detection and operator dashboard.",
      },
      { property: "og:title", content: "Run the SPM ECO 3D Simulation" },
      {
        property: "og:description",
        content: "Interactive 3D demo of an end-to-end smart parking management system.",
      },
    ],
  }),
  component: SimulationPage,
});

function SimulationPage() {
  return (
    <div className="min-h-screen bg-navy-deep text-white">
      <Header />
      <SimulationApp />
    </div>
  );
}
