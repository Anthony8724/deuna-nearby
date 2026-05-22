"use client";

import Link from "next/link";
import { memo } from "react";
import { motion } from "framer-motion";
import { Home, Tag, Wallet, User } from "lucide-react";
import { useClientReady } from "@/hooks/use-client-ready";
import { nativeTap } from "@/lib/home-motion";

const items = [
  { id: "home", label: "Inicio", href: "/", icon: Home },
  { id: "promos", label: "Promos", href: "/", icon: Tag },
  { id: "wallet", label: "Billetera", href: "/", icon: Wallet },
  { id: "profile", label: "Tú", href: "/comercio/dashboard", icon: User },
];

function MobileBottomNavInner({ active = "home" }: { active?: string }) {
  const routerReady = useClientReady();

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
      </div>
    </nav>
  );
}

export const MobileBottomNav = memo(MobileBottomNavInner);
