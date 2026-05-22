export type UserCoordinates = {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
};

export type SmartRecommendationSource = "location" | "history" | "promo";

export type SmartRecommendation = {
  id: string;
  merchantName: string;
  benefit: string;
  distance: string;
  distanceMeters: number;
  affinityScore: number;
  imageUrl: string;
  emoji: string;
  source: SmartRecommendationSource;
  merchantId?: string;
  aiInsight: string;
  paymentAmount?: number;
  benefitPercent?: number;
};

export type SmartPushNotification = {
  id: string;
  title: string;
  body: string;
  recommendationId: string;
  createdAt: number;
  read: boolean;
};

export type UserPurchaseHistory = {
  frequentCategories: string[];
  recentMerchantIds: string[];
  morningCoffeePreference: boolean;
};
