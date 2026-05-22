"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Home,
  LayoutDashboard,
  Radar,
  Sparkles,
  Store,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { dashboard } from "@/app/_components/ui/premium";
import { LANDING_ROUTE, LOCK_SCREEN_ROUTE, WALLET_ROUTE } from "@/lib/demo-routes";

const DEMO_NAV = [
  {
    id: "lock",
    label: "Radar DeUna",
    href: LOCK_SCREEN_ROUTE,
    icon: Radar,
    preview: "Push en pantalla bloqueada + GPS y proximidad en tiempo real.",
  },
  {
    id: "landing",
    label: "Landing",
    href: LANDING_ROUTE,
    icon: LayoutDashboard,
    preview: "Vista general del producto para inversores y jurado.",
  },
  {
    id: "wallet",
    label: "Billetera",
    href: WALLET_ROUTE,
    icon: Wallet,
    preview: "Notificación Nearby, bottom sheet y pago con DeUna.",
  },
  {
    id: "merchant",
    label: "Comercio",
    href: "/comercio/dashboard",
    icon: Store,
    preview: "Panel móvil con ventas en vivo y estado del QR.",
  },
  {
    id: "analytics",
    label: "Analytics",
    href: "/comercio/analytics",
    icon: BarChart3,
    preview: "KPIs, conversiones, zonas calientes y promociones activas.",
  },
  {
    id: "impact",
    label: "Impacto",
    href: "/dashboard",
    icon: Sparkles,
    preview: "Métricas Supabase, historial de compras y pitch final.",
  },
] as const;

type LandingAutoSidebarProps = {
  liveLabel?: string;
};

export function LandingAutoSidebar({ liveLabel }: LandingAutoSidebarProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = DEMO_NAV[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % DEMO_NAV.length);
    }, 3800);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex min-h-[320px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a2540]/60">
      <aside className={`flex w-[210px] shrink-0 flex-col ${dashboard.sidebar}`}>
        <div className="flex h-14 items-center gap-2 border-b border-white/10 px-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white">
            <Home className="h-3.5 w-3.5 text-[#0a2540]" strokeWidth={2.25} />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Demo unificada</p>
            <p className="text-[9px] uppercase tracking-wider text-white/40">
              {liveLabel ?? "DeUna Nearby"}
            </p>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 p-2">
          {DEMO_NAV.map((item, index) => {
            const Icon = item.icon;
            const isActive = index === activeIndex;
            return (
              <Link
                key={item.id}
                href={item.href}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                className={`relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12px] font-medium transition ${
                  isActive
                    ? dashboard.sidebarLinkActive + " " + dashboard.sidebarLink
                    : dashboard.sidebarLink
                }`}
              >
                {isActive ? (
                  <motion.span
                    layoutId="landing-sidebar-active"
                    className="absolute inset-0 rounded-lg bg-white/10"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <Icon className="relative h-3.5 w-3.5 shrink-0 opacity-80" strokeWidth={1.75} />
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col justify-between p-5 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#a5a0ff]">
              {active.label}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              {active.preview}
            </p>
          </motion.div>
        </AnimatePresence>
        <Link
          href={active.href}
          className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.1]"
        >
          Abrir {active.label}
        </Link>
      </div>
    </div>
  );
}
