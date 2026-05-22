"use client";

import { motion } from "framer-motion";
import { useNearbyActions, useNearbyState } from "@/context/nearby-context";
import { getHomeInsight } from "@/constants/context-intelligence";
import { springSmooth, tapScaleSoft } from "@/lib/motion-presets";

export function IntelligentCard() {
  const insight = getHomeInsight();
  const { visibleMoments } = useNearbyState();
  const { openSheet } = useNearbyActions();
  const topMoment = visibleMoments[0];

  return (
    <section className="home-section mt-10">
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springSmooth}
        className="relative overflow-hidden rounded-[1.5rem] bg-linear-to-br from-[#f3eeff] via-[#faf8ff] to-white p-6 ring-1 ring-brand-primary/10 shadow-[0_4px_24px_rgba(109,40,255,0.08)] sm:p-7"
      >
        <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-brand-primary/10 blur-2xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-8 -left-4 h-28 w-28 rounded-full bg-brand-primary-soft/10 blur-2xl" aria-hidden />

        <div className="relative flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-xl shadow-[0_4px_16px_rgba(109,40,255,0.12)] ring-1 ring-brand-primary/10">
            ✨
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-section-title text-[1.0625rem] text-foreground">
              DeUna Inteligente
            </h2>
            <p className="text-body mt-2 text-text-secondary">
              {insight.message === "Frecuentas cafeterías por las mañanas"
                ? "Hemos notado que disfrutas café por las mañanas."
                : insight.message}
            </p>
            {topMoment?.benefit && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand-primary shadow-sm ring-1 ring-brand-primary/10">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                Recomendado: {topMoment.benefit} en {topMoment.merchantName}
              </p>
            )}
            <motion.button
              type="button"
              whileTap={tapScaleSoft}
              onClick={() => topMoment && openSheet(topMoment)}
              disabled={!topMoment}
              className="btn-primary mt-5 px-5 py-3 text-sm disabled:opacity-50"
            >
              Ver beneficio
            </motion.button>
          </div>
        </div>

        <svg
          className="pointer-events-none absolute bottom-4 right-4 h-16 w-16 text-brand-primary/10"
          viewBox="0 0 64 64"
          fill="currentColor"
          aria-hidden
        >
          <circle cx="32" cy="32" r="28" opacity="0.5" />
          <path d="M32 12l4 12h12l-10 8 4 12-10-7-10 7 4-12-10-8h12z" opacity="0.8" />
        </svg>
      </motion.article>
    </section>
  );
}
