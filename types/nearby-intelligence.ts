export type ContextReason =
  | "habits"
  | "frequency"
  | "location"
  | "trending";

export const contextReasonLabels: Record<ContextReason, string> = {
  habits: "Basado en tus hábitos",
  frequency: "Porque compras café frecuentemente",
  location: "Cerca de tu ubicación",
  trending: "Popular en tu zona",
};

export type SmartRecommendation = {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  benefit: string;
  distance: string;
  reason: ContextReason;
  merchantId?: string;
};

export type FavoriteCategory = {
  id: string;
  emoji: string;
  label: string;
  count: number;
  active?: boolean;
};

export type SmartPromotion = {
  id: string;
  title: string;
  description: string;
  badge: string;
  reason: ContextReason;
  expiresIn?: string;
  accent: "violet" | "emerald" | "amber";
};
