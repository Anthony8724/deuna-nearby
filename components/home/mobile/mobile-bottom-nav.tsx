"use client";

import Link from "next/link";
import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { Home, Tag, Wallet, User } from "lucide-react";
import { useClientReady } from "@/hooks/use-client-ready";
import { useNearbyActions } from "@/context/nearby-context";
import { nativeTap } from "@/lib/home-motion";
import { LOCK_SCREEN_ROUTE, WALLET_ROUTE } from "@/lib/demo-routes";

const items = [
  { id: "home", label: "Inicio", href: LOCK_SCREEN_ROUTE, icon: Home },
  { id: "wallet", label: "Billetera", href: WALLET_ROUTE, icon: Wallet },
  { id: "profile", label: "Tú", href: "/comercio/dashboard", icon: User },
] as const;

function MobileBottomNavInner({ active = "home" }: { active?: string }) {
  const routerReady = useClientReady();
  const { openTopNotification } = useNearbyActions();

  const handlePromos = useCallback(() => {
    document.getElementById("wallet-promos")?.scrollIntoView({ behavior: "smooth" });
    openTopNotification();
  }, [openTopNotification]);

  return (
    <nav
      className="absolute inset-x-0 bottom-0 z-30 border-t border-black/[0.06] bg-white pb-[env(safe-area-inset-bottom)]"
      aria-label="Navegación principal"
    >
      <div className="flex h-16 items-stretch justify-around px-1">
        {items.map((item) => {
          const isActive = item.id === active;
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              prefetch={routerReady}
              className={`relative flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? "text-[#5D21D0]" : "text-[#9CA3AF]"
              }`}
            >
              <motion.span whileTap={nativeTap} className="flex flex-col items-center gap-0.5">
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.25 : 1.75} />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </motion.span>
            </Link>
          );
        })}

        <motion.button
          type="button"
          whileTap={nativeTap}
          onClick={handlePromos}
          className="relative flex flex-1 flex-col items-center justify-center gap-1 text-[#9CA3AF] transition-colors hover:text-[#5D21D0]"
        >
          <Tag className="h-5 w-5" strokeWidth={1.75} />
          <span className="text-[10px] font-semibold">Promos</span>
        </motion.button>
      </div>
    </nav>
  );
}

export const MobileBottomNav = memo(MobileBottomNavInner);
