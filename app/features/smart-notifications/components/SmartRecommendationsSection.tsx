"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

import {
  CERCA_DE_TI_BASELINE_MERCHANTS,
  type CercaDeTiBaselineMerchant,
} from "../data/cercaDeTiBaselineMerchants";
import {
  recomendacionToCercaDeTiCard,
  type CercaDeTiCardModel,
} from "../lib/cercaDeTiCard";
import type { Recomendacion } from "../types";
import { deuna } from "../styles/deuna-ui";
import { NearbyMomentCard } from "./NearbyMomentCard";

export type SmartRecommendationsSectionProps = {
  /** Recomendaciones del motor (geo + historial + promos) */
  smartRecommendations: Recomendacion[];
  loading?: boolean;
  /** Comercios fijos del diseño actual (Burger Factory, Café Central, …) */
  baselineMerchants?: CercaDeTiBaselineMerchant[];
  maxSmartCards?: number;
  onVerMas?: () => void;
  onCardPress?: (card: CercaDeTiCardModel) => void;
  className?: string;
};

function baselineToCard(m: CercaDeTiBaselineMerchant): CercaDeTiCardModel {
  return {
    id: m.id,
    nombre: m.nombre,
    distanciaMetros: m.distanciaMetros,
    afinidadLabel: `${m.afinidadPct}% afinidad`,
    beneficio: m.beneficio,
    imageGradient: m.imageGradient,
    imageEmoji: m.imageEmoji,
  };
}

/**
 * Sección "Cerca de ti" — conserva cards base y añade recomendaciones inteligentes
 * con el mismo estilo visual (Persona 3).
 */
export function SmartRecommendationsSection({
  smartRecommendations,
  loading = false,
  baselineMerchants = CERCA_DE_TI_BASELINE_MERCHANTS,
  maxSmartCards = 4,
  onVerMas,
  onCardPress,
  className = "",
}: SmartRecommendationsSectionProps) {
  const baselineIds = useMemo(
    () => new Set(baselineMerchants.map((m) => m.id)),
    [baselineMerchants],
  );

  const baselineNames = useMemo(
    () =>
      new Set(
        baselineMerchants.map((m) => m.nombre.toLowerCase().trim()),
      ),
    [baselineMerchants],
  );

  const cards = useMemo(() => {
    const base = baselineMerchants.map(baselineToCard);

    const smart = smartRecommendations
      .filter(
        (rec) =>
          !baselineIds.has(rec.id) &&
          !baselineNames.has(rec.nombreComercial.toLowerCase().trim()),
      )
      .slice(0, maxSmartCards)
      .map(recomendacionToCercaDeTiCard);

    return [...base, ...smart];
  }, [
    baselineMerchants,
    smartRecommendations,
    maxSmartCards,
    baselineIds,
    baselineNames,
  ]);

  return (
    <section
      className={`mt-5 overflow-hidden rounded-[20px] border border-[#EBEBEF] bg-white p-4 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)] ${className}`}
    >
      <div className="mb-3 flex items-center gap-2">
        <h2 className={deuna.sectionTitle}>Cerca de ti</h2>
        <span className={deuna.badgeNuevo}>Nuevo ✨</span>
        {onVerMas ? (
          <button
            type="button"
            onClick={onVerMas}
            className={`ml-auto text-[13px] font-semibold ${deuna.brandText}`}
          >
            Ver más &gt;
          </button>
        ) : null}
      </div>

      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.35 }}
          >
            <NearbyMomentCard
              card={card}
              onPress={() => onCardPress?.(card)}
            />
          </motion.div>
        ))}

        {loading
          ? Array.from({ length: 2 }).map((_, i) => (
              <div
                key={`sk-${i}`}
                className="h-[168px] w-[148px] shrink-0 animate-pulse rounded-[16px] bg-[#F5F5F7]"
              />
            ))
          : null}
      </div>
    </section>
  );
}
