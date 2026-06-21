"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LineChart, Newspaper, Globe2, Briefcase, FlaskConical, Layers, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Overview", icon: Activity },
  { href: "/dashboard", label: "Dashboard", icon: LineChart },
  { href: "/track", label: "Track", icon: Target },
  { href: "/features", label: "Features", icon: Layers },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/macro", label: "Macro", icon: Globe2 },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/research", label: "Research", icon: FlaskConical },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-up text-black">
            <Activity className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">Nissan AI</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
              Market Intelligence
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors",
                  active ? "bg-white/[0.08] text-white" : "text-white/50 hover:text-white"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden h-2 w-2 animate-pulse-glow rounded-full bg-up sm:block" />
          <span className="hidden text-xs text-white/50 sm:block">Live</span>
        </div>
      </div>

      {/* モバイル用ナビ */}
      <nav className="flex items-center gap-1 overflow-x-auto px-3 pb-2 md:hidden">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs",
                active ? "bg-white/[0.08] text-white" : "text-white/50"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
