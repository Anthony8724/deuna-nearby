"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { AiBadge, AiInsight, AiPulseDot } from "@/components/ui/ai-indicator";
import { useNearby } from "@/context/nearby-context";
import type { NearbyMoment, NearbyMomentAccent } from "@/types/nearby-moment";
import {
  hoverLiftSubtle,
  springSmooth,
  staggerContainer,
  tapScaleSoft,
} from "@/lib/motion-presets";

const accentStyles: Record<
  NearbyMomentAccent,
  { glow: string; accent: string; ring: string; border: string }
> = {
  violet: {
    glow: "from-brand-violet/8 via-brand-violet/3 to-transparent",
    accent: "text-brand-violet bg-brand-violet/10 ring-brand-violet/10",
    ring: "hover:ring-brand-violet/15",
    border: "border-brand-violet/10",
  },
  emerald: {
    glow: "from-brand-emerald/8 via-brand-emerald/3 to-transparent",
    accent: "text-brand-emerald bg-brand-emerald/10 ring-brand-emerald/10",
    ring: "hover:ring-brand-emerald/15",
    border: "border-brand-emerald/10",
  },
  amber: {
    glow: "from-brand-amber/8 via-brand-amber/3 to-transparent",
    accent: "text-brand-amber bg-brand-amber/10 ring-brand-amber/10",
    ring: "hover:ring-brand-amber/15",
    border: "border-brand-amber/10",
  },
  rose: {
    glow: "from-rose-500/8 via-rose-500/3 to-transparent",
    accent: "text-rose-600 bg-rose-500/10 ring-rose-500/10",
    ring: "hover:ring-rose-500/15",
    border: "border-rose-500/10",
  },
};

const momentCardVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    scale: 0.97,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

function MomentCard({ moment }: { moment: NearbyMoment }) {
  const { openSheet, dismissMoment } = useNearby();
  const styles = accentStyles[moment.accent];

  return (
    <motion.article
      layout
      variants={momentCardVariants}
      exit="exit"
      whileHover={hoverLiftSubtle}
      className={`group relative overflow-hidden rounded-[1.125rem] border border-border-faint bg-surface-card shadow-[0_1px_2px_rgba(15,23,42,0.04),0_6px_20px_rgba(15,23,42,0.04)] ring-1 ring-transparent transition-all duration-400 ${styles.ring}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-linear-to-br ${styles.glow}`}
        aria-hidden
      />

      <div className="relative p-4 sm:p-[1.125rem]">
        <div className="mb-3.5 flex items-center justify-between gap-2">
          <AiBadge label={moment.contextLabel ?? "IA contextual"} />
          {moment.timeLabel && (
            <time className="text-[10px] font-semibold tabular-nums text-muted/80">
              {moment.timeLabel}
            </time>
          )}
        </div>

        <button
          type="button"
          onClick={() => openSheet(moment)}
          className="flex w-full items-start gap-3.5 text-left"
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            transition={springSmooth}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f8f9fc] text-lg ring-1 ${styles.border}`}
          >
            {moment.emoji}
          </motion.span>

          <span className="min-w-0 flex-1">
            <span className="block text-[0.9375rem] font-semibold leading-snug tracking-tight text-foreground">
              {moment.insight}
            </span>
            <span className="mt-1 block text-[0.8125rem] leading-relaxed text-muted">
              {moment.message}
            </span>
            {moment.aiInsight && (
              <AiInsight
                message={moment.aiInsight}
                compact
                className="mt-2.5"
              />
            )}
          </span>
        </button>

        <div className="mt-3.5 flex items-center justify-between gap-2 pl-[3.75rem]">
          <div className="flex flex-wrap items-center gap-1.5">
            {moment.benefit && (
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1 ${styles.accent}`}
              >
                {moment.benefit}
              </span>
            )}
            {moment.distance && (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/[0.035] px-2.5 py-0.5 text-[10px] font-medium text-muted">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  className="h-3 w-3 text-brand-indigo/80"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z"
                  />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                {moment.distance}
              </span>
            )}
            {moment.expiresLabel && (
              <span className="rounded-full bg-brand-amber/10 px-2.5 py-0.5 text-[10px] font-semibold text-brand-amber ring-1 ring-brand-amber/10">
                {moment.expiresLabel}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => openSheet(moment)}
            className="shrink-0 text-[11px] font-semibold text-brand-indigo transition-all hover:translate-x-0.5 hover:text-brand-violet"
          >
            Ver →
          </button>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.06 }}
          whileTap={tapScaleSoft}
          onClick={() => dismissMoment(moment.id)}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-muted/50 transition-colors hover:bg-black/[0.04] hover:text-muted"
          aria-label="Descartar sugerencia"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="h-3.5 w-3.5"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </motion.button>
      </div>
    </motion.article>
  );
}

export function NearbyMoments() {
  const { visibleMoments } = useNearby();

  if (visibleMoments.length === 0) return null;

  return (
    <section
      className="home-section pt-8"
      aria-labelledby="nearby-moments-title"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <AiPulseDot />
            <h2
              id="nearby-moments-title"
              className="text-section-title text-foreground"
            >
              Nearby Moments
            </h2>
          </div>
          <AiInsight
            message="Sugerencias personalizadas para ti"
            compact
            className="mt-1.5 pl-[1.125rem]"
          />
        </div>
        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-black/[0.04] px-2 text-[10px] font-semibold tabular-nums text-muted ring-1 ring-black/[0.03]">
          {visibleMoments.length}
        </span>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {visibleMoments.map((moment) => (
            <MomentCard key={moment.id} moment={moment} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
