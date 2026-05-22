"use client";

import { motion } from "framer-motion";

import { PLATFORM } from "@/app/data/platformSnapshot";
import { premium } from "@/app/_components/ui/premium";

import { INVESTOR_HIGHLIGHTS } from "./data";

export function InvestorHighlightsStrip() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-white/[0.06] pt-8 lg:mx-0 lg:justify-start"
    >
      {INVESTOR_HIGHLIGHTS.map((h) => (
        <div key={h.label} className="flex items-baseline gap-2">
          <span className="text-base font-semibold tracking-tight text-white">
            {h.metric}
          </span>
          <span className="text-xs font-medium text-white/40">{h.unit}</span>
          <span className="hidden text-xs text-white/30 sm:inline">· {h.label}</span>
        </div>
      ))}
      <span className={`hidden w-full text-[11px] sm:block ${premium.body}`}>
        Piloto {PLATFORM.mercado} · expansión {PLATFORM.expansion}
      </span>
    </motion.div>
  );
}
