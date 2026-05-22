"use client";

import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";

export function FeatureBadges() {
  return (
    <div className="flex flex-wrap gap-1.5">
      <motion.span
        animate={{ boxShadow: ["0 0 0 rgba(99,91,255,0)", "0 0 12px rgba(99,91,255,0.35)", "0 0 0 rgba(99,91,255,0)"] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="inline-flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-violet-200"
      >
        <Sparkles className="h-2.5 w-2.5" />
        AI Powered
      </motion.span>
      <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/25 bg-cyan-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-200/90">
        <MapPin className="h-2.5 w-2.5" />
        Nearby
      </span>
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
        Live
      </span>
    </div>
  );
}
