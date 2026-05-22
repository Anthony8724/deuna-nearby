"use client";

import { motion } from "framer-motion";
import { AiContextStrip } from "@/components/ui/ai-indicator";
import { getHomeInsight } from "@/lib/context-ai";
import { springSmooth, tapScaleSoft } from "@/lib/motion-presets";

export function AiContextBanner() {
  const insight = getHomeInsight();

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springSmooth, delay: 0.08 }}
      className="home-section mt-1"
      aria-label="Insight contextual DeUna"
    >
      <motion.div whileTap={tapScaleSoft} transition={springSmooth}>
        <AiContextStrip
          badge={insight.shortLabel}
          message={insight.message}
          compact
        />
      </motion.div>
    </motion.section>
  );
}
