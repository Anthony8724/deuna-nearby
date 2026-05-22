import type { NearbyMomentAccent } from "@/types/nearby-moment";
import type { NearbyMoment } from "@/types/nearby-moment";
import type {
  SmartRecommendation,
  SmartRecommendationSource,
} from "@/types/smart-recommendation";

export type ApiRecommendationRow = {
  id: string | number;
  name: string;
  category: string;
  description?: string;
  distanceMeters: number;
  discount: number;
  score: number;
  promotionTitle?: string;
};

export type ApiRecommendationsPayload = {
  favoriteCategory?: string;
  recommendations?: ApiRecommendationRow[];
};

const CATEGORY_EMOJI: Record<string, string> = {
  hamburguesas: "🍔",
  café: "☕",
  cafe: "☕",
  gastronomía: "🍽️",
  retail: "🛒",
  panadería: "🥐",
  panaderia: "🥐",
};

const IMAGE_BY_CATEGORY: Record<string, string> = {
  hamburguesas:
    "https://images.unsplash.com/photo-1568901347635-c023013d7143?w=800&auto=format&fit=crop&q=80",
  café:
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80",
  cafe:
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80",
};

function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function emojiForCategory(category: string): string {
  const key = category.toLowerCase();
  for (const [needle, emoji] of Object.entries(CATEGORY_EMOJI)) {
    if (key.includes(needle)) return emoji;
  }
  return "🏪";
}

function accentForScore(score: number): NearbyMomentAccent {
  if (score >= 85) return "violet";
  if (score >= 70) return "amber";
  return "emerald";
}

function sourceForRow(
  row: ApiRecommendationRow,
  favoriteCategory?: string,
): SmartRecommendationSource {
  if (
    favoriteCategory &&
    row.category.toLowerCase() === favoriteCategory.toLowerCase()
  ) {
    return "history";
  }
  if (row.discount >= 10) return "promo";
  return "location";
}

export function mapApiRecommendationToSmart(
  row: ApiRecommendationRow,
  favoriteCategory?: string,
): SmartRecommendation {
  const source = sourceForRow(row, favoriteCategory);
  const benefit = row.discount
    ? `${row.discount}% ${row.promotionTitle ?? "beneficio DeUna"}`
    : (row.promotionTitle ?? "Beneficio DeUna");

  return {
    id: String(row.id),
    merchantName: row.name,
    benefit,
    distance: formatDistance(row.distanceMeters),
    distanceMeters: row.distanceMeters,
    affinityScore: row.score,
    imageUrl:
      IMAGE_BY_CATEGORY[row.category.toLowerCase()] ??
      "https://images.unsplash.com/photo-1604719312566-8912a922af86?w=800&auto=format&fit=crop&q=80",
    emoji: emojiForCategory(row.category),
    source,
    merchantId: String(row.id),
    aiInsight:
      row.description?.trim() ||
      `Recomendado por proximidad y tu interés en ${row.category.toLowerCase()}.`,
    paymentAmount: Math.max(4.5, Math.round(row.discount * 0.85 * 10) / 10),
    benefitPercent: row.discount,
  };
}

export function mapApiRecommendationsPayload(
  payload: ApiRecommendationsPayload,
): SmartRecommendation[] {
  if (!payload.recommendations?.length) return [];
  return payload.recommendations.map((row) =>
    mapApiRecommendationToSmart(row, payload.favoriteCategory),
  );
}

export function mapSmartToNearbyMoment(rec: SmartRecommendation): NearbyMoment {
  const contextLabels = {
    history: "Basado en tus hábitos",
    location: "Cerca de ti ahora",
    promo: "Promoción relevante cerca de ti",
  } as const;

  return {
    id: rec.id,
    emoji: rec.emoji,
    insight: rec.aiInsight,
    message: rec.benefit,
    benefit: rec.benefit,
    merchantName: rec.merchantName,
    distance: rec.distance,
    merchantId: rec.merchantId,
    accent: accentForScore(rec.affinityScore),
    isNew: true,
    isOpen: true,
    contextType:
      rec.source === "history"
        ? "habits"
        : rec.source === "promo"
          ? "promo"
          : "location",
    contextLabel: contextLabels[rec.source],
    aiInsight: rec.aiInsight,
    affinityScore: rec.affinityScore,
    imageUrl: rec.imageUrl,
    description: rec.aiInsight,
    paymentAmount: rec.paymentAmount,
    benefitPercent: rec.benefitPercent,
  };
}
