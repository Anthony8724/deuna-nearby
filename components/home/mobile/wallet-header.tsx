"use client";

import { motion } from "framer-motion";
import { Bell, Headphones } from "lucide-react";
import { useNearbyActions, useNearbyState } from "@/context/nearby-context";
import { homeUser } from "@/constants/home";
import { nativeHover, nativeSpring, nativeTap } from "@/lib/home-motion";

export function WalletHeader() {
  const { unreadCount, carouselMoments } = useNearbyState();
  const { openTopNotification } = useNearbyActions();
  const hasNotifications = unreadCount > 0 || carouselMoments.length > 0;

  return (
    <header className="flex items-center justify-between px-5 pb-2 pt-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={nativeSpring}
        className="flex items-center gap-3"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EDE6FA] text-sm font-bold text-[#5D21D0]">
          {homeUser.firstName.charAt(0)}
        </span>
        <h1 className="text-[1.25rem] font-bold tracking-tight text-[#1E1E1E]">
          Hola {homeUser.firstName} 👋
        </h1>
      </motion.div>

      <div className="flex items-center gap-0.5">
        <motion.button
          type="button"
          whileHover={nativeHover}
          whileTap={nativeTap}
          onClick={openTopNotification}
          disabled={!hasNotifications}
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#6B7280] disabled:opacity-35"
          aria-label={
            unreadCount > 0
              ? `${unreadCount} notificaciones Nearby`
              : "Notificaciones Nearby"
          }
        >
          <Bell className="h-5 w-5" strokeWidth={1.75} />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#EF4444] px-1 text-[9px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </motion.button>

        <motion.button
          type="button"
          whileHover={nativeHover}
          whileTap={nativeTap}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#6B7280]"
          aria-label="Soporte"
        >
          <Headphones className="h-5 w-5" strokeWidth={1.75} />
        </motion.button>
      </div>
    </header>
  );
}
