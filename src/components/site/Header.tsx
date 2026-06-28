import { Link } from "@tanstack/react-router";
import { Cpu } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-navy-deep/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-glow/20 text-cyan-glow">
            <Cpu className="h-4 w-4" />
          </span>
          <span className="font-display text-base font-semibold tracking-tight">
            SPM <span className="text-cyan-glow">ECO</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-white/70 md:flex">
          <Link
            to="/"
            className="hover:text-white"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-white" }}
          >
            Home
          </Link>
          <Link
            to="/simulation"
            className="hover:text-white"
            activeProps={{ className: "text-white" }}
          >
            Simulation
          </Link>
          <Link
            to="/features"
            className="hover:text-white"
            activeProps={{ className: "text-white" }}
          >
            Features
          </Link>
          <Link
            to="/technology"
            className="hover:text-white"
            activeProps={{ className: "text-white" }}
          >
            Technology
          </Link>
          <Link
            to="/contact"
            className="hover:text-white"
            activeProps={{ className: "text-white" }}
          >
            Contact
          </Link>
        </nav>
        <Link
          to="/simulation"
          className="rounded-full bg-cyan-glow px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-navy-deep hover:brightness-110"
        >
          Launch
        </Link>
      </div>
    </header>
  );
}
