"use client";

import { motion } from "framer-motion";
import { springSmooth } from "@/lib/motion-presets";

export function AppLoader({ label = "Cargando DeUna" }: { label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={springSmooth}
      className="flex min-h-[50vh] flex-col items-center justify-center gap-5 px-6"
    >
      <div className="relative flex h-14 w-14 items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-2xl bg-brand-primary/15 blur-xl"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary shadow-brand">
          <span className="text-lg font-bold text-white">D</span>
        </div>
      </div>
      <p className="text-sm font-semibold text-foreground">{label}</p>
    </motion.div>
  );
}
