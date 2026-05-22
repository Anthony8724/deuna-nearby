"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Clock, MapPin, Sparkles, Zap } from "lucide-react";

import {
  formatBeneficioFromRecomendacion,
  formatTiempoRestantePromo,
} from "../lib/beneficios";
import { formatDistancia, formatScorePct } from "../lib/format";
import {
  cashbackExtraLine,
  contextualReasonShort,
} from "../lib/nearbyCopy";
import type { Recomendacion, UserLocation } from "../types";
import { deuna } from "../styles/deuna-ui";
import { ComoLlegarButton } from "./ComoLlegarButton";
import { categoryEmoji } from "./integrated/categoryEmoji";

export type PromoHeroCardProps = {
  recomendacion: Recomendacion;
  userId?: string;
  userOrigin?: UserLocation | null;
  onPagarConDeuna?: () => void;
  className?: string;
};

const CARD_SPRING = { type: "spring" as const, stiffness: 380, damping: 34 };
const EXPAND_EASE = [0.22, 1, 0.36, 1] as const;

function PromoBadge({
  children,
  variant,
}: {
  children: ReactNode;
  variant: "ai" | "nearby" | "promo";
}) {
  const styles = {
    ai: deuna.badgeBrand,
    nearby: deuna.badgeNearby,
    promo: `${deuna.badgeBase} ${deuna.badgeBrandSoft}`,
  };
  return <span className={styles[variant]}>{children}</span>;
}

export function PromoHeroCard({
  recomendacion,
  userId = "guest",
  userOrigin = null,
  onPagarConDeuna,
  className = "",
}: PromoHeroCardProps) {
  const [expanded, setExpanded] = useState(false);

  const beneficio = formatBeneficioFromRecomendacion(recomendacion);
  const emoji = categoryEmoji(recomendacion.categoria);
  const reason = contextualReasonShort(recomendacion, userId);
  const cashback = cashbackExtraLine(recomendacion);
  const tiempo = formatTiempoRestantePromo(recomendacion.promocion);
  const scorePct = Math.round(recomendacion.score * 100);
  const affinity = formatScorePct(recomendacion.score);
  const isNearby = recomendacion.distanciaMetros <= 400;

  useEffect(() => {
    setExpanded(false);
  }, [recomendacion.id]);

  return (
    <motion.article
      key={recomendacion.id}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EXPAND_EASE }}
      className={`relative mx-4 ${deuna.cardHero} ${className}`}
    >
      <motion.button
        type="button"
        layout
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
        whileTap={{ scale: 0.995 }}
        className="relative w-full touch-manipulation text-left"
      >
        {/* Banner tipo card “Cerca de ti” */}
        <div className={`relative h-[120px] ${deuna.merchantBanner}`}>
          <span
            className={`absolute right-3 top-3 text-[12px] font-medium ${deuna.nearbyText}`}
          >
            {formatDistancia(recomendacion.distanciaMetros)}
          </span>
          <div className="flex h-full items-center justify-center text-4xl">
            {emoji}
          </div>
          <span
            className={`absolute bottom-3 left-3 ${deuna.badgeBase} ${deuna.badgeBrand}`}
          >
            {affinity} afinidad
          </span>
        </div>

        <div className="p-4">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {recomendacion.tienePromocionActiva ? (
              <span className={deuna.badgeNuevo}>Nuevo ✨</span>
            ) : null}
            {isNearby ? (
              <PromoBadge variant="nearby">
                <MapPin className="h-3 w-3" />
                Cerca
              </PromoBadge>
            ) : null}
          </div>

          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <h2 className={`text-[16px] font-bold leading-tight ${deuna.textPrimary}`}>
                {recomendacion.nombreComercial}
              </h2>
              <p className={`mt-1 text-[14px] leading-snug ${deuna.benefitText}`}>
                {beneficio.texto}
              </p>
            </div>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={CARD_SPRING}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#EBEBEF] bg-[#F5F5F7]"
            >
              <ChevronDown
                className={`h-4 w-4 ${deuna.textMuted}`}
                strokeWidth={2.25}
              />
            </motion.div>
          </div>

          {!expanded ? (
            <p className={`mt-3 text-center text-[12px] ${deuna.textMuted}`}>
              Toca para ver acciones y beneficios
            </p>
          ) : null}
        </div>
      </motion.button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            key="expanded-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={CARD_SPRING}
            className="overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ y: -6 }}
              animate={{ y: 0 }}
              exit={{ y: -4 }}
              transition={{ duration: 0.35, ease: EXPAND_EASE }}
              className="border-t border-[#EBEBEF] bg-[#FAFAFC] px-4 pb-4 pt-3"
            >
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, ...CARD_SPRING }}
                className="mb-3 grid grid-cols-2 gap-2"
              >
                <div className={`rounded-2xl p-3 ${deuna.surfaceMuted}`}>
                  <p className={deuna.textLabel}>Cashback</p>
                  <p className={`mt-1 text-[13px] font-semibold ${deuna.textPrimary}`}>
                    {cashback}
                  </p>
                </div>
                <div className={`rounded-2xl p-3 ${deuna.promoSurface}`}>
                  <p className={deuna.textLabel}>Tiempo restante</p>
                  <p
                    className={`mt-1 flex items-start gap-1 text-[13px] font-medium ${deuna.promoText}`}
                  >
                    <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {tiempo}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, ...CARD_SPRING }}
                className={`mb-3 rounded-2xl p-3 ${deuna.brandSurface}`}
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles className={`h-4 w-4 ${deuna.brandText}`} />
                  <p className={`text-[12px] font-bold ${deuna.brandText}`}>
                    Score IA · {scorePct}%
                  </p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E8E0F5]">
                  <motion.div
                    className="h-full rounded-full bg-[#5D2A8E]"
                    initial={{ width: 0 }}
                    animate={{ width: `${scorePct}%` }}
                    transition={{ delay: 0.1, duration: 0.55, ease: "easeOut" }}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, ...CARD_SPRING }}
                className={`mb-4 rounded-2xl p-3 ${deuna.surface}`}
              >
                <p className={`mb-1 ${deuna.textLabel}`}>Por qué ahora</p>
                <p className={`text-[13px] leading-relaxed ${deuna.textSecondary}`}>
                  {reason}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, ...CARD_SPRING }}
                className="space-y-2.5"
              >
                <ComoLlegarButton
                  latitude={recomendacion.latitude}
                  longitude={recomendacion.longitude}
                  comercio={recomendacion.nombreComercial}
                  userOrigin={userOrigin}
                  size="lg"
                  pulse
                />

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPagarConDeuna?.();
                  }}
                  className={`flex w-full touch-manipulation items-center justify-center gap-2 py-4 text-[16px] ${deuna.btnPrimary}`}
                >
                  <Zap className="h-5 w-5" strokeWidth={2.25} />
                  Pagar con DeUna
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}
