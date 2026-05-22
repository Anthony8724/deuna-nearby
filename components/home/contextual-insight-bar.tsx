"use client";

import { motion } from "framer-motion";
import { AiContextStrip } from "@/components/ui/ai-indicator";
import { getHomeInsight } from "@/constants/context-intelligence";
import { springSmooth } from "@/lib/motion-presets";

export function ContextualInsightBar() {
  const insight = getHomeInsight();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, ...springSmooth }}
      className="home-section"
    >
      <AiContextStrip
        message={insight.message}
        badge={insight.shortLabel}
      />
    </motion.div>
  );
}
