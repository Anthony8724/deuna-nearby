"use client";

import { memo } from "react";
import { WALLET_ROUTE } from "@/lib/demo-routes";
import { motion } from "framer-motion";
import { BarChart3, Home, LayoutGrid, QrCode } from "lucide-react";
import Link from "next/link";
import { useClientReady } from "@/hooks/use-client-ready";
import { useMerchantDashboard } from "@/context/merchant-dashboard-context";
import { nativeTap } from "@/lib/home-motion";

const tabs = [
  { id: "panel" as const, label: "Panel", icon: LayoutGrid, section: "panel" },
  { id: "ventas" as const, label: "Ventas", icon: BarChart3, section: "ventas" },
  { id: "qr" as const, label: "QR", icon: QrCode, section: "qr" },
];

function MerchantMobileNavInner() {
  const routerReady = useClientReady();
  const { activeNav, scrollToSection } = useMerchantDashboard();

  return (
    <nav
      className="border-t border-black/[0.06] bg-white pb-[env(safe-area-inset-bottom)]"
      aria-label="Navegación comercio"
    >
      <div className="flex h-16 items-stretch justify-around px-1">
        {tabs.map((tab) => {
          const isActive = activeNav === tab.id;
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              type="button"
              whileTap={nativeTap}
              onClick={() => scrollToSection(tab.section)}
              className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive ? "text-[#5D21D0]" : "text-[#9CA3AF]"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.25 : 1.75} />
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </motion.button>
          );
        })}

        <Link
          href={WALLET_ROUTE}
          prefetch={routerReady}
          className="relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[#9CA3AF]"
        >
          <motion.span whileTap={nativeTap} className="flex flex-col items-center gap-0.5">
            <Home className="h-5 w-5" strokeWidth={1.75} />
            <span className="text-[10px] font-semibold">Inicio</span>
          </motion.span>
        </Link>
      </div>
    </nav>
  );
}

export const MerchantMobileNav = memo(MerchantMobileNavInner);
