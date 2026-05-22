"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  contextReasonLabels,
  type ContextReason,
  type FavoriteCategory,
  type SmartPromotion,
  type SmartRecommendation,
} from "@/types/nearby-intelligence";

const reasonIcons: Record<ContextReason, string> = {
  habits: "✨",
  frequency: "☕",
  location: "📍",
  trending: "🔥",
};

const promoAccents = {
  violet: "from-brand-violet/10 to-brand-indigo/5 border-brand-violet/15",
  emerald: "from-brand-emerald/10 to-brand-emerald/5 border-brand-emerald/15",
  amber: "from-brand-amber/10 to-brand-amber/5 border-brand-amber/15",
};

const listVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

function ContextBadge({ reason }: { reason: ContextReason }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-indigo/8 px-2.5 py-1 text-[10px] font-semibold text-brand-indigo">
      <span aria-hidden>{reasonIcons[reason]}</span>
      {contextReasonLabels[reason]}
    </span>
  );
}

function RecommendationCard({ item }: { item: SmartRecommendation }) {
  const content = (
    <>
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-brand-violet/10 to-brand-indigo/5 text-xl shadow-soft">
          {item.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold tracking-tight text-foreground">
            {item.title}
          </h3>
          <p className="mt-0.5 text-xs text-muted">{item.subtitle}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-emerald/10 px-2 py-0.5 text-[10px] font-semibold text-brand-emerald">
              {item.benefit}
            </span>
            <span className="text-[10px] font-medium text-muted">
              {item.distance}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <ContextBadge reason={item.reason} />
      </div>
    </>
  );

  const className =
    "block w-full rounded-2xl bg-surface-card p-4 text-left shadow-soft ring-1 ring-border-subtle transition-all hover:-translate-y-0.5 hover:shadow-soft-lg";

  if (item.merchantId) {
    return (
      <motion.li variants={itemVariants}>
        <Link
          href={`/comercio/dashboard?merchant=${item.merchantId}`}
          className={className}
        >
          {content}
        </Link>
      </motion.li>
    );
  }

  return (
    <motion.li variants={itemVariants}>
      <button type="button" className={className}>
        {content}
      </button>
    </motion.li>
  );
}

function CategoryChip({
  category,
  onSelect,
}: {
  category: FavoriteCategory;
  onSelect: (id: string) => void;
}) {
  return (
    <motion.button
      type="button"
      variants={itemVariants}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(category.id)}
      className={`flex shrink-0 flex-col items-center gap-1.5 rounded-2xl px-4 py-3 transition-all ${
        category.active
          ? "bg-linear-to-br from-brand-violet to-brand-indigo text-white shadow-brand"
          : "bg-surface-card text-foreground shadow-soft ring-1 ring-border-subtle hover:shadow-soft-lg"
      }`}
    >
      <span className="text-xl">{category.emoji}</span>
      <span className="text-xs font-semibold">{category.label}</span>
      <span
        className={`text-[10px] font-medium ${category.active ? "text-white/70" : "text-muted"}`}
      >
        {category.count} visitas
      </span>
    </motion.button>
  );
}

function PromotionCard({ promo }: { promo: SmartPromotion }) {
  return (
    <motion.li
      variants={itemVariants}
      whileHover={{ scale: 1.01 }}
      className={`rounded-2xl border bg-linear-to-br p-4 ${promoAccents[promo.accent]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="rounded-full bg-surface-card px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-violet shadow-soft">
            {promo.badge}
          </span>
          <h3 className="mt-2 text-sm font-semibold text-foreground">
            {promo.title}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            {promo.description}
          </p>
        </div>
        {promo.expiresIn && (
          <span className="shrink-0 rounded-lg bg-surface-card px-2 py-1 text-[10px] font-semibold text-muted shadow-soft">
            {promo.expiresIn}
          </span>
        )}
      </div>
      <div className="mt-3">
        <ContextBadge reason={promo.reason} />
      </div>
    </motion.li>
  );
}

export function IntelligentSidebarPanel({
  recommendations,
  categories,
  promotions,
  onClose,
}: {
  recommendations: SmartRecommendation[];
  categories: FavoriteCategory[];
  promotions: SmartPromotion[];
  onClose: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-[#f7f8fc]">
      <div className="relative overflow-hidden border-b border-border-subtle px-5 pb-5 pt-6">
        <div
          className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-brand-violet/10 blur-2xl"
          aria-hidden
        />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-brand-violet/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-violet">
              <span aria-hidden>✨</span> IA contextual
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Nearby inteligente
            </h2>
            <p className="mt-1 text-sm text-muted">
              Recomendaciones hechas para ti
            </p>
          </div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-card text-muted shadow-soft ring-1 ring-border-subtle hover:text-foreground"
            aria-label="Cerrar Nearby"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              className="h-5 w-5"
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
      </div>

      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="show"
        className="flex-1 space-y-8 overflow-y-auto px-5 py-6"
      >
        <section aria-labelledby="rec-heading">
          <motion.h3
            variants={itemVariants}
            id="rec-heading"
            className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-muted"
          >
            Recomendaciones contextuales
          </motion.h3>
          <ul className="space-y-3">
            {recommendations.map((item) => (
              <RecommendationCard key={item.id} item={item} />
            ))}
          </ul>
        </section>

        <section aria-labelledby="cat-heading">
          <motion.h3
            variants={itemVariants}
            id="cat-heading"
            className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-muted"
          >
            Categorías favoritas
          </motion.h3>
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="-mx-1 flex gap-3 overflow-x-auto pb-1 scrollbar-hide"
          >
            {categories.map((cat) => (
              <CategoryChip
                key={cat.id}
                category={cat}
                onSelect={() => {}}
              />
            ))}
          </motion.div>
        </section>

        <section aria-labelledby="promo-heading">
          <motion.h3
            variants={itemVariants}
            id="promo-heading"
            className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-muted"
          >
            Promociones inteligentes
          </motion.h3>
          <ul className="space-y-3">
            {promotions.map((promo) => (
              <PromotionCard key={promo.id} promo={promo} />
            ))}
          </ul>
        </section>

        <motion.div
          variants={itemVariants}
          className="rounded-2xl bg-linear-to-br from-brand-violet/8 to-brand-indigo/5 p-4 ring-1 ring-brand-indigo/10"
        >
          <p className="text-xs leading-relaxed text-muted">
            Nearby aprende de tus pagos, ubicación y horarios para sugerirte
            comercios y beneficios relevantes en tiempo real.
          </p>
          <Link
            href="/comercio/dashboard"
            className="mt-3 inline-flex text-xs font-semibold text-brand-indigo hover:text-brand-violet"
          >
            Ver panel comercio →
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
