import type {
  FavoriteCategory,
  SmartPromotion,
  SmartRecommendation,
} from "@/types/nearby-intelligence";

export const smartRecommendations: SmartRecommendation[] = [
  {
    id: "rec-cafe-central",
    emoji: "☕",
    title: "Café Central",
    subtitle: "Tu café favorito está cerca",
    benefit: "10% cashback",
    distance: "120m",
    reason: "frequency",
    merchantId: "cafe-aurora",
  },
  {
    id: "rec-burger",
    emoji: "🍔",
    title: "Burger Factory",
    subtitle: "Ideal para tu hora de almuerzo",
    benefit: "15% beneficio DeUna",
    distance: "250m",
    reason: "habits",
    merchantId: "cafe-aurora",
  },
  {
    id: "rec-market",
    emoji: "🛒",
    title: "Mini Market Express",
    subtitle: "Abre hasta las 22:00",
    benefit: "2x puntos hoy",
    distance: "400m",
    reason: "location",
  },
];

export const favoriteCategories: FavoriteCategory[] = [
  { id: "cafe", emoji: "☕", label: "Café", count: 12, active: true },
  { id: "food", emoji: "🍔", label: "Comida", count: 8 },
  { id: "market", emoji: "🛒", label: "Market", count: 5 },
  { id: "health", emoji: "💊", label: "Salud", count: 3 },
  { id: "tech", emoji: "📱", label: "Tech", count: 2 },
];

export const smartPromotions: SmartPromotion[] = [
  {
    id: "promo-cafe",
    title: "Doble cashback en cafés",
    description: "Válido en comercios aliados hasta el domingo",
    badge: "Solo hoy",
    reason: "frequency",
    expiresIn: "6 h",
    accent: "violet",
  },
  {
    id: "promo-lunch",
    title: "Almuerzo con 20% off",
    description: "Restaurantes a menos de 500m de ti",
    badge: "Cerca de ti",
    reason: "location",
    accent: "emerald",
  },
  {
    id: "promo-points",
    title: "3x puntos DeUna",
    description: "En tus categorías favoritas este fin de semana",
    badge: "Personalizado",
    reason: "habits",
    accent: "amber",
  },
];
