import type { NearbyMoment } from "@/types/nearby-moment";
import type { Recomendacion } from "@/app/features/smart-notifications/types";
import { categoryEmoji } from "@/app/features/smart-notifications/components/integrated/categoryEmoji";

/** Convierte recomendación geo/API al momento Nearby usado en el bottom sheet de pago. */
export function recomendacionToNearbyMoment(rec: Recomendacion): NearbyMoment {
  const distancia =
    rec.distanciaMetros >= 1000
      ? `${(rec.distanciaMetros / 1000).toFixed(1)} km`
      : `${rec.distanciaMetros} m`;

  const benefit =
    rec.promocion?.titulo ??
    rec.razonDestacada ??
    "Beneficio DeUna Nearby";

  return {
    id: rec.id,
    emoji: categoryEmoji(rec.categoria),
    insight: rec.razonDestacada ?? `Estás cerca de ${rec.nombreComercial}`,
    message: benefit,
    benefit,
    merchantName: rec.nombreComercial ?? rec.nombre,
    distance: distancia,
    merchantId: rec.slug ?? rec.id,
    accent: "violet",
    isNew: true,
    isOpen: true,
    contextType: "location",
    contextLabel: "Cerca de ti",
    aiInsight: rec.razonDestacada,
    affinityScore: Math.round(rec.score * 100),
    description: rec.direccionCorta,
    paymentAmount: rec.ticketPromedioUsd > 0 ? rec.ticketPromedioUsd : 12,
    benefitPercent: rec.promocion?.valor ?? 10,
  };
}
