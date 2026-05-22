"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { NearbyPlace } from "@/types/nearby-place";
import { hoverLift, springSmooth, tapScale } from "@/lib/motion-presets";

const accentStyles = {
  violet: {
    bg: "from-brand-violet/10 to-brand-indigo/5",
    badge: "bg-brand-violet/10 text-brand-violet",
    ring: "hover:ring-brand-violet/20",
    glow: "group-hover:shadow-brand/20",
  },
  emerald: {
    bg: "from-brand-emerald/10 to-brand-emerald/5",
    badge: "bg-brand-emerald/10 text-brand-emerald",
    ring: "hover:ring-brand-emerald/20",
    glow: "group-hover:shadow-brand-emerald/20",
  },
  amber: {
    bg: "from-brand-amber/10 to-brand-amber/5",
    badge: "bg-brand-amber/10 text-brand-amber",
    ring: "hover:ring-brand-amber/20",
    glow: "",
  },
  rose: {
    bg: "from-rose-500/10 to-rose-400/5",
    badge: "bg-rose-500/10 text-rose-600",
    ring: "hover:ring-rose-500/20",
    glow: "",
  },
};

function NearbyPlaceCard({ place, index }: { place: NearbyPlace; index: number }) {
  const styles = accentStyles[place.accent];
  const href = place.merchantId
    ? `/comercio/dashboard?merchant=${place.merchantId}`
    : "#";

  const cardClass = `group relative block w-[260px] shrink-0 overflow-hidden rounded-3xl bg-surface-card p-5 shadow-soft ring-1 ring-border-subtle transition-all duration-350 hover:-translate-y-1.5 hover:shadow-soft-lg sm:w-[280px] ${styles.ring}`;

  const CardInner = (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/0 to-brand-indigo/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />
      <motion.div
        whileHover={{ scale: 1.08, rotate: 3 }}
        transition={springSmooth}
        className={`relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br text-2xl shadow-soft ${styles.bg}`}
      >
        {place.emoji}
      </motion.div>
      <h3 className="relative text-base font-semibold tracking-tight text-foreground">
        {place.name}
      </h3>
      <p
        className={`relative mt-2 inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold transition-transform duration-300 group-hover:scale-105 ${styles.badge}`}
      >
        {place.benefit}
      </p>
      <div className="relative mt-4 flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs font-medium text-muted">
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
              d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z"
            />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          {place.distance}
        </span>
        <span className="text-xs font-semibold text-brand-indigo opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
          Ver →
        </span>
      </div>
    </>
  );

  return (
    <motion.li
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 + index * 0.07, ...springSmooth }}
      className="snap-start"
    >
      {place.merchantId ? (
        <Link href={href} className={cardClass}>
          {CardInner}
        </Link>
      ) : (
        <motion.button
          type="button"
          whileHover={hoverLift}
          whileTap={tapScale}
          className={`${cardClass} text-left`}
        >
          {CardInner}
        </motion.button>
      )}
    </motion.li>
  );
}

export function NearbyHorizontalCards({ places }: { places: NearbyPlace[] }) {
  return (
    <section className="pt-10" aria-labelledby="nearby-heading">
      <div className="mb-5 flex items-end justify-between gap-4 px-5 lg:px-8">
        <div>
          <h2
            id="nearby-heading"
            className="text-lg font-semibold tracking-tight text-foreground sm:text-xl"
          >
            🔥 Cerca de ti
          </h2>
          <p className="mt-1 text-sm text-muted">
            Beneficios exclusivos en comercios aliados
          </p>
        </div>
        <Link
          href="/comercio/dashboard"
          className="btn-premium shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-brand-indigo ring-1 ring-brand-indigo/10 hover:bg-brand-indigo/5 hover:text-brand-violet"
        >
          Ver mapa
        </Link>
      </div>

      <div className="-mx-5 overflow-x-auto px-5 pb-2 scrollbar-hide lg:mx-0 lg:px-8">
        <ul className="flex gap-4 snap-x snap-mandatory">
          {places.map((place, i) => (
            <NearbyPlaceCard key={place.id} place={place} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
