"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { pushAlertLine } from "../lib/nearbyCopy";
import { deuna } from "../styles/deuna-ui";
import type { Recomendacion } from "../types";

export type SmartPushNotificationProps = {
  message: string;
  className?: string;
  delay?: number;
  pulseGlow?: boolean;
};

function getCurrentTimeLabel(): string {
  return new Date().toLocaleTimeString("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function DeUnaMark() {
  return (
    <div className={`h-8 w-8 ${deuna.pushBrand} rounded-xl`}>
      <span className="text-sm font-bold leading-none text-white">d!</span>
    </div>
  );
}

/**
 * Push estilo lock screen DeUna — glass oscuro; detalle en PromoHeroCard.
 */
export function SmartPushNotification({
  message,
  className = "",
  delay = 0,
  pulseGlow = true,
}: SmartPushNotificationProps) {
  const [hora, setHora] = useState(getCurrentTimeLabel);

  useEffect(() => {
    setHora(getCurrentTimeLabel());
    const id = setInterval(() => setHora(getCurrentTimeLabel()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full ${className}`.trim()}
    >
      {pulseGlow ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-1 rounded-[20px] bg-[#5D2A8E]/20 blur-lg"
          animate={{ opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}

      <div className={`relative overflow-hidden ${deuna.pushCard}`}>
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3.5 py-2">
          <div className="flex items-center gap-2">
            <DeUnaMark />
            <span className={`text-[13px] font-semibold ${deuna.pushText}`}>
              DeUna
            </span>
          </div>
          <span className={`text-[11px] font-medium ${deuna.pushTextMuted}`}>
            ahora
          </span>
        </div>

        <div className="px-3.5 py-3">
          <p className={`text-[13px] font-medium leading-relaxed ${deuna.pushText}`}>
            {message}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function smartPushPropsFromRecomendacion(
  rec: Recomendacion,
  options?: { message?: string; userId?: string },
): SmartPushNotificationProps {
  return {
    message:
      options?.message ?? pushAlertLine(rec, options?.userId ?? "guest"),
  };
}
