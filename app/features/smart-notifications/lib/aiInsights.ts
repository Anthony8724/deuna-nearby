import { buildUserAffinityProfile } from "./userAffinity";
import { formatCategoria } from "./format";
import { WHY_BULLET_LABELS, horaActividadAmigable } from "./nearbyCopy";
import type { ComercioCategoria, Recomendacion } from "../types";

export type AIInsightBadge = "high_intent" | "nearby" | "frequent_user";

export type WhyBullet = {
  id: string;
  text: string;
  active: boolean;
};

export type NearbyMerchantSummary = {
  nombre: string;
  distanciaMetros: number;
  score: number;
};

export type AIInsightSnapshot = {
  intentScore: number;
  categoriaFavorita: string;
  horaActividad: string;
  comerciosCercanos: NearbyMerchantSummary[];
  coincidenciaIA: number;
  prediccionCompra: number;
  badges: AIInsightBadge[];
  whyBullets: WhyBullet[];
};

function getEcuadorHour(): number {
  return Number(
    new Date().toLocaleString("es-EC", {
      timeZone: "America/Guayaquil",
      hour: "numeric",
      hour12: false,
    }),
  );
}

export function getHoraActividadLabel(hour = getEcuadorHour()): string {
  return horaActividadAmigable(hour);
}

function isPeakHourForCategory(
  categoria: ComercioCategoria,
  hour = getEcuadorHour(),
): boolean {
  switch (categoria) {
    case "cafe_brunch":
    case "panaderia":
      return hour >= 7 && hour < 11;
    case "restaurante":
      return (hour >= 12 && hour < 15) || (hour >= 19 && hour < 22);
    case "supermercado":
    case "farmacia":
      return hour >= 17 && hour < 21;
    case "combustible":
      return hour >= 7 && hour < 10;
    default:
      return hour >= 12 && hour < 20;
  }
}

/**
 * Construye el snapshot de explicabilidad IA a partir de recomendaciones rankeadas.
 */
export function buildAIInsightSnapshot(
  recomendaciones: Recomendacion[],
  destacada: Recomendacion | null,
  userId = "guest",
): AIInsightSnapshot {
  const affinity = buildUserAffinityProfile(userId);
  const top = destacada ?? recomendaciones[0] ?? null;

  if (!top) {
    return {
      intentScore: 0,
      categoriaFavorita: formatCategoria(affinity.categoriasPreferidas[0]),
      horaActividad: getHoraActividadLabel(),
      comerciosCercanos: [],
      coincidenciaIA: 0,
      prediccionCompra: 0,
      badges: [],
      whyBullets: [
        { id: "cerca", text: WHY_BULLET_LABELS.cerca, active: false },
        { id: "frecuencia", text: WHY_BULLET_LABELS.frecuencia, active: false },
        { id: "promo", text: WHY_BULLET_LABELS.promo, active: false },
        { id: "hora", text: WHY_BULLET_LABELS.hora, active: false },
      ],
    };
  }

  const intentScore = Math.min(
    1,
    top.score * 0.55 +
      top.desgloseScore.proximidad * 0.2 +
      top.desgloseScore.frecuencia * 0.15 +
      top.desgloseScore.promocion * 0.1,
  );

  const prediccionCompra = Math.min(
    0.98,
    intentScore * 0.7 +
      (top.transaccionesUltimos30Dias >= 4 ? 0.18 : 0.08) +
      (top.tienePromocionActiva ? 0.1 : 0),
  );

  const badges: AIInsightBadge[] = [];
  if (intentScore >= 0.65) badges.push("high_intent");
  if (top.distanciaMetros <= 500) badges.push("nearby");
  if (
    top.transaccionesUltimos30Dias >= 5 ||
    top.desgloseScore.frecuencia >= 0.6
  ) {
    badges.push("frequent_user");
  }

  const categoriaFavorita = affinity.categoriasPreferidas.includes(
    top.categoria,
  )
    ? formatCategoria(top.categoria)
    : formatCategoria(affinity.categoriasPreferidas[0]);

  const whyBullets: WhyBullet[] = [
    {
      id: "cerca",
      text: WHY_BULLET_LABELS.cerca,
      active: top.desgloseScore.proximidad >= 0.45,
    },
    {
      id: "frecuencia",
      text: WHY_BULLET_LABELS.frecuencia,
      active:
        top.desgloseScore.frecuencia >= 0.4 ||
        top.transaccionesUltimos30Dias >= 4,
    },
    {
      id: "promo",
      text: WHY_BULLET_LABELS.promo,
      active: top.tienePromocionActiva,
    },
    {
      id: "hora",
      text: WHY_BULLET_LABELS.hora,
      active: isPeakHourForCategory(top.categoria),
    },
  ];

  const comerciosCercanos = [...recomendaciones]
    .sort((a, b) => a.distanciaMetros - b.distanciaMetros)
    .slice(0, 4)
    .map((r) => ({
      nombre: r.nombreComercial,
      distanciaMetros: r.distanciaMetros,
      score: r.score,
    }));

  return {
    intentScore,
    categoriaFavorita,
    horaActividad: getHoraActividadLabel(),
    comerciosCercanos,
    coincidenciaIA: top.score,
    prediccionCompra,
    badges,
    whyBullets,
  };
}
