import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../components/site/Header";
import { Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — SPM ECO Project Team" },
      { name: "description", content: "Get in touch with the SPM ECO smart parking project team." },
      { property: "og:title", content: "Contact the SPM ECO Team" },
      {
        property: "og:description",
        content: "Reach out about the SPM ECO smart parking management prototype.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-navy-deep text-white">
      <Header />
      <section className="mx-auto max-w-3xl px-6 py-20">
        <div className="text-[11px] uppercase tracking-[0.3em] text-cyan-glow">Contact</div>
        <h1 className="mt-3 font-display text-4xl font-semibold">Talk to the project team.</h1>
        <p className="mt-3 text-white/70">
          For demonstrations, academic enquiries or collaboration opportunities.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Card icon={<Mail className="h-5 w-5" />} title="Email" value="team@spm-eco.lk" />
          <Card icon={<Phone className="h-5 w-5" />} title="Phone" value="+94 11 234 5678" />
          <Card icon={<MapPin className="h-5 w-5" />} title="Location" value="Colombo, Sri Lanka" />
        </div>
      </section>
    </div>
  );
}

function Card({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-navy/40 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-glow/15 text-cyan-glow">
        {icon}
      </div>
      <div className="mt-3 font-display text-sm font-semibold">{title}</div>
      <div className="mt-1 text-sm text-white/70">{value}</div>
    </div>
  );
}
