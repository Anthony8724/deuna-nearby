import type { AiContextType } from "@/constants/context-intelligence";

export type NearbyMomentAccent = "violet" | "emerald" | "amber" | "rose";

export type NearbyMoment = {
  id: string;
  emoji: string;
  insight: string;
  message: string;
  urgency?: string;
  benefit?: string;
  merchantName?: string;
  distance?: string;
  merchantId?: string;
  accent: NearbyMomentAccent;
  isNew?: boolean;
  timeLabel?: string;
  contextLabel?: string;
  contextType?: AiContextType;
  aiInsight?: string;
  expiresLabel?: string;
  imageUrl?: string;
  description?: string;
  hours?: string;
  isOpen?: boolean;
  paymentAmount?: number;
  benefitPercent?: number;
  affinityScore?: number;
};
