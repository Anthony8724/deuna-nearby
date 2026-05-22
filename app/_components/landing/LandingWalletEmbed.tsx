"use client";

import { motion } from "framer-motion";

import { DeunaWalletApp } from "@/components/home/deuna-wallet-app";

import { LandingAutoSidebar } from "./LandingAutoSidebar";

type LandingWalletEmbedProps = {
  className?: string;
  delay?: number;
  liveLabel?: string;
};

/** App móvil interactiva + sidebar demo (misma billetera que `/billetera`). */
export function LandingWalletEmbed({
  className = "",
  delay = 0,
  liveLabel = "Demo unificada",
}: LandingWalletEmbedProps) {
  return (
    <motion.div
      id="billetera-demo"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`relative ${className}`}
    >
      <div className="absolute -inset-6 rounded-[2.75rem] bg-[#5D21D0]/10 blur-2xl" aria-hidden />
      <div className="grid items-start gap-5">
        <DeunaWalletApp variant="embed" demoBar={false} />
        <LandingAutoSidebar liveLabel={liveLabel} />
      </div>
      <p className="mt-4 text-center text-[11px] font-medium text-white/45 lg:text-left">
        App interactiva — GPS, cómo llegar, Transferir y Pagar a QR
      </p>
    </motion.div>
  );
}
