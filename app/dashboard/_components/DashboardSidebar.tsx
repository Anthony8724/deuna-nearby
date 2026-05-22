"use client";

import {
  BarChart3,
  Bell,
  LayoutDashboard,
  MapPin,
  Radar,
  Settings,
  Store,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { dashboard } from "@/app/_components/ui/premium";

import type { MerchantProfile } from "../data/merchantAnalytics";
import { DashboardBadgePill } from "./DashboardBadge";

const NAV = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/smart-notifications", label: "Radar DeUna", icon: Radar },
  { href: "/dashboard", label: "Promociones", icon: Tag },
  { href: "/dashboard", label: "Zonas", icon: MapPin },
  { href: "/dashboard", label: "Analítica", icon: BarChart3 },
] as const;

type DashboardSidebarProps = {
  merchant: MerchantProfile;
  mobileOpen?: boolean;
  onClose?: () => void;
};

export function DashboardSidebar({
  merchant,
  mobileOpen = true,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 z-40 bg-[#0a2540]/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col ${dashboard.sidebar} transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
            <Store className="h-4 w-4 text-[#0a2540]" strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-white">
              DeUna Nearby
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/40">
              Merchant
            </p>
          </div>
        </div>

        <div className="border-b border-white/10 px-4 py-4">
          <p className="truncate text-xs font-semibold text-white">
            {merchant.nombreComercial}
          </p>
          <p className="text-[11px] text-white/45">{merchant.categoria}</p>
          <div className="mt-2.5 flex flex-wrap gap-1">
            {merchant.badges.map((b) => (
              <DashboardBadgePill key={b} badge={b} />
            ))}
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 p-3">
          {NAV.map((item) => {
            const active = pathname === item.href && item.label === "Resumen";
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={
                  active
                    ? dashboard.sidebarLinkActive + " " + dashboard.sidebarLink
                    : dashboard.sidebarLink
                }
              >
                <Icon className="h-4 w-4 shrink-0 opacity-80" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            className={dashboard.sidebarLink + " w-full"}
          >
            <Bell className="h-4 w-4" strokeWidth={1.75} />
            Alertas
          </button>
          <button
            type="button"
            className={dashboard.sidebarLink + " w-full"}
          >
            <Settings className="h-4 w-4" strokeWidth={1.75} />
            Configuración
          </button>
        </div>
      </aside>
    </>
  );
}
