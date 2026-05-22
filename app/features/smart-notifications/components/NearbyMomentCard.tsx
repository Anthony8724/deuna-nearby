"use client";

import { ChevronRight } from "lucide-react";

import { formatDistancia } from "../lib/format";
import type { CercaDeTiCardModel } from "../lib/cercaDeTiCard";
import { deuna } from "../styles/deuna-ui";

export type NearbyMomentCardProps = {
  card: CercaDeTiCardModel;
  onPress?: () => void;
  className?: string;
};

/**
 * Card compacta del carrusel (Cerca de ti / Nearby Moments) — clickable.
 */
export function NearbyMomentCard({ card, onPress, className = "" }: NearbyMomentCardProps) {
  return (
    <article
      className={`relative flex w-[148px] shrink-0 flex-col overflow-hidden rounded-[16px] border border-[#EBEBEF] bg-white text-left shadow-[0_2px_10px_-2px_rgba(0,0,0,0.08)] ${className}`}
    >
      <button
        type="button"
        onClick={onPress}
        className="flex w-full flex-1 flex-col text-left touch-manipulation transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5D2A8E]/40"
        aria-label={`Ver detalle de ${card.nombre}`}
      >
        <div
          className={`relative flex h-[88px] w-full items-center justify-center bg-gradient-to-br ${card.imageGradient}`}
        >
          <span className="text-3xl drop-shadow-sm" aria-hidden>
            {card.imageEmoji}
          </span>
          <span
            className={`absolute bottom-2 left-2 rounded-lg px-2 py-0.5 text-[9px] font-bold leading-none text-white ${deuna.brand}`}
          >
            {card.afinidadLabel}
          </span>
        </div>

        <div className="relative flex flex-1 flex-col p-3 pr-10">
          <span className={`absolute right-3 top-3 text-[11px] font-medium ${deuna.nearbyText}`}>
            {formatDistancia(card.distanciaMetros)}
          </span>
          <p className={`line-clamp-2 text-[13px] font-bold leading-tight ${deuna.textPrimary}`}>
            {card.nombre}
          </p>
          <p className={`mt-1 line-clamp-2 text-[12px] leading-snug ${deuna.benefitText}`}>
            {card.beneficio}
          </p>
        </div>
      </button>

      <button
        type="button"
        onClick={onPress}
        className={`absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-[#EBEBEF] bg-white shadow-sm transition active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5D2A8E]/40 ${deuna.brandText}`}
        aria-label={`Ver más sobre ${card.nombre}`}
      >
        <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </article>
  );
}
