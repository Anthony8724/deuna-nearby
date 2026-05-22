import type {
  SmartRecommendation,
  UserCoordinates,
  UserPurchaseHistory,
} from "@/types/smart-recommendation";

type PromoCatalogItem = {
  id: string;
  merchantName: string;
  benefit: string;
  emoji: string;
  imageUrl: string;
  merchantId?: string;
  category: string;
  lat: number;
  lng: number;
  affinityBase: number;
  paymentAmount: number;
  benefitPercent: number;
  aiInsight: string;
};

const QUITO_CENTER = { lat: -0.1807, lng: -78.4678 };

const promoCatalog: PromoCatalogItem[] = [
  {
    id: "smart-mini-market",
    merchantName: "Mini Market Express",
    benefit: "2x puntos hoy",
    emoji: "🛒",
    imageUrl:
      "https://images.unsplash.com/photo-1604719312566-8912a922af86?w=800&auto=format&fit=crop&q=80",
    category: "retail",
    lat: -0.1825,
    lng: -78.4695,
    affinityBase: 84,
    paymentAmount: 12,
    benefitPercent: 0,
    aiInsight: "Sueles comprar snacks cerca del metro",
  },
  {
    id: "smart-farmacia",
    merchantName: "Farmacia Vida",
    benefit: "5% cashback",
    emoji: "💊",
    imageUrl:
      "https://images.unsplash.com/photo-1576602976047-174ec4a8d3b3?w=800&auto=format&fit=crop&q=80",
    merchantId: "farmacia-vida",
    category: "health",
    lat: -0.1792,
    lng: -78.471,
    affinityBase: 79,
    paymentAmount: 8.5,
    benefitPercent: 5,
    aiInsight: "Promoción en productos de cuidado personal",
  },
  {
    id: "smart-panaderia",
    merchantName: "Panadería del Valle",
    benefit: "10% cashback",
    emoji: "🥐",
    imageUrl:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
    merchantId: "cafe-aurora",
    category: "food",
    lat: -0.1812,
    lng: -78.4665,
    affinityBase: 88,
    paymentAmount: 3.5,
    benefitPercent: 10,
    aiInsight: "Basado en tus compras matutinas",
  },
];

function haversineMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function scoreAffinity(
  item: PromoCatalogItem,
  history: UserPurchaseHistory,
  distanceMeters: number,
): number {
  let score = item.affinityBase;

  if (history.frequentCategories.includes(item.category)) score += 6;
  if (history.recentMerchantIds.includes(item.merchantId ?? "")) score += 4;
  if (history.morningCoffeePreference && item.category === "food") score += 3;
  if (distanceMeters < 200) score += 5;
  else if (distanceMeters < 400) score += 2;

  return Math.min(98, Math.max(70, Math.round(score)));
}

function inferSource(
  item: PromoCatalogItem,
  history: UserPurchaseHistory,
): SmartRecommendation["source"] {
  if (history.recentMerchantIds.includes(item.merchantId ?? "")) return "history";
  if (item.affinityBase >= 85) return "promo";
  return "location";
}

export const recommendationService = {
  getRecommendations(
    location: UserCoordinates,
    history: UserPurchaseHistory,
    excludeMerchantNames: string[] = [],
  ): SmartRecommendation[] {
    const excluded = new Set(excludeMerchantNames.map((n) => n.toLowerCase()));

    return promoCatalog
      .filter((item) => !excluded.has(item.merchantName.toLowerCase()))
      .map((item) => {
        const distanceMeters = haversineMeters(
          location.latitude,
          location.longitude,
          item.lat,
          item.lng,
        );

        return {
          id: item.id,
          merchantName: item.merchantName,
          benefit: item.benefit,
          distance: formatDistance(distanceMeters),
          distanceMeters,
          affinityScore: scoreAffinity(item, history, distanceMeters),
          imageUrl: item.imageUrl,
          emoji: item.emoji,
          source: inferSource(item, history),
          merchantId: item.merchantId,
          aiInsight: item.aiInsight,
          paymentAmount: item.paymentAmount,
          benefitPercent: item.benefitPercent,
        };
      })
      .sort((a, b) => b.affinityScore - a.affinityScore || a.distanceMeters - b.distanceMeters)
      .slice(0, 3);
  },

  /** Mock historial de compras DeUna */
  getDefaultHistory(): UserPurchaseHistory {
    return {
      frequentCategories: ["food", "retail"],
      recentMerchantIds: ["cafe-aurora"],
      morningCoffeePreference: true,
    };
  },

  getFallbackLocation(): UserCoordinates {
    return {
      latitude: QUITO_CENTER.lat,
      longitude: QUITO_CENTER.lng,
      accuracyMeters: 25,
    };
  },
};
