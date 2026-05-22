export type NearbySummary = {
  feature: string;
  usersActivated: number;
  businessesRecommended: number;
  mainCategory: string;
  impact: string;
};

export type UserHistoryItem = {
  id?: string | number;
  category: string;
  amount?: number;
  created_at?: string;
  date?: string;
};

export type PromotionItem = {
  id?: string | number;
  title?: string;
  name?: string;
  discount?: number;
  active?: boolean;
  business_id?: string;
};

export type DashboardData = {
  summary: NearbySummary;
  history: UserHistoryItem[];
  promotions: PromotionItem[];
  source: "live" | "fallback";
};
