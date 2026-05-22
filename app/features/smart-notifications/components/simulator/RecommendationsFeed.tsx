"use client";

import {
  NearbyMomentCardFull,
  nearbyMomentCardPropsFromRecomendacion,
} from "../NearbyMomentCardFull";
import type { Recomendacion } from "../../types";

type RecommendationsFeedProps = {
  recomendaciones: Recomendacion[];
  loadingId: string | null;
  disabled?: boolean;
  onActivarBeneficio: (rec: Recomendacion) => void;
};

export function RecommendationsFeed({
  recomendaciones,
  loadingId,
  disabled = false,
  onActivarBeneficio,
}: RecommendationsFeedProps) {
  if (recomendaciones.length === 0) {
    return (
      <p className="text-sm text-white/45">
        Sin resultados en este radio. Prueba otra zona de Quito o amplía el
        perímetro de búsqueda.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {recomendaciones.map((rec) => (
        <li key={rec.id}>
          <NearbyMomentCardFull
            {...nearbyMomentCardPropsFromRecomendacion(rec)}
            disabled={disabled || loadingId === rec.id}
            onActivarBeneficio={() => onActivarBeneficio(rec)}
          />
        </li>
      ))}
    </ul>
  );
}
