"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

import {
  recomendacionToCercaDeTiCard,
  type CercaDeTiCardModel,
} from "../lib/cercaDeTiCard";
import type { Recomendacion } from "../types";
import { deuna } from "../styles/deuna-ui";
import { NearbyMomentCard } from "./NearbyMomentCard";

export type NearbyMomentsSectionProps = {
  recommendations: Recomendacion[];
  loading?: boolean;
  maxItems?: number;
  onCardPress?: (card: CercaDeTiCardModel) => void;
  onVerTodos?: () => void;
  className?: string;
};

/**
 * Sección "Nearby Moments" — cards inteligentes con el mismo estilo que "Cerca de ti".
 */
export function NearbyMomentsSection({
  recommendations,
  loading = false,
  maxItems = 6,
  onCardPress,
  onVerTodos,
  className = "",
}: NearbyMomentsSectionProps) {
  const cards = useMemo(
    () =>
      recommendations.slice(0, maxItems).map(recomendacionToCercaDeTiCard),
    [recommendations, maxItems],
  );

  if (!loading && cards.length === 0) {
    return null;
  }

  return (
    <section className={`mt-4 ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className={deuna.sectionTitle}>Nearby Moments</h2>
        {onVerTodos ? (
          <button
            type="button"
            onClick={onVerTodos}
            className={`text-[13px] font-semibold ${deuna.brandText}`}
          >
            Ver todos &gt;
          </button>
        ) : null}
      </div>

      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04, duration: 0.32 }}
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
                key={`nm-sk-${i}`}
                className="h-[168px] w-[148px] shrink-0 animate-pulse rounded-[16px] bg-[#F5F5F7] border border-[#EBEBEF]"
              />
            ))
          : null}
      </div>
    </section>
  );
}
