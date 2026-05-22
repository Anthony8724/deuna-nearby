import type { NearbyPlace } from "@/types/nearby-place";

export const nearbyPlaces: NearbyPlace[] = [
  {
    id: "cafe-central",
    emoji: "☕",
    name: "Café Central",
    benefit: "15% cashback",
    benefitType: "cashback",
    distance: "120m",
    merchantId: "cafe-aurora",
    accent: "violet",
  },
  {
    id: "burger-factory",
    emoji: "🍔",
    name: "Burger Factory",
    benefit: "15% DeUna",
    benefitType: "discount",
    distance: "250m",
    merchantId: "cafe-aurora",
    accent: "amber",
  },
  {
    id: "mini-market",
    emoji: "🛒",
    name: "Mini Market Express",
    benefit: "2x puntos",
    benefitType: "points",
    distance: "400m",
    accent: "emerald",
  },
  {
    id: "farmacia-vida",
    emoji: "💊",
    name: "Farmacia Vida",
    benefit: "5% cashback",
    benefitType: "cashback",
    distance: "340m",
    merchantId: "farmacia-vida",
    accent: "rose",
  },
];
