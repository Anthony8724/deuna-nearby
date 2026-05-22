export type NearbyPlace = {
  id: string;
  emoji: string;
  name: string;
  benefit: string;
  benefitType: "discount" | "cashback" | "points";
  distance: string;
  merchantId?: string;
  accent: "violet" | "emerald" | "amber" | "rose";
};
