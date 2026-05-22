import { aiContextLabels } from "@/constants/context-intelligence";
import type { NearbyMoment } from "@/types/nearby-moment";
import type { SmartRecommendation } from "@/types/smart-recommendation";

const accentBySource: Record<
  SmartRecommendation["source"],
  NearbyMoment["accent"]
> = {
  location: "emerald",
  history: "violet",
  promo: "amber",
};

const contextBySource: Record<
  SmartRecommendation["source"],
  { type: NearbyMoment["contextType"]; label: string }
> = {
  history: { type: "habits", label: aiContextLabels.habits },
  location: { type: "location", label: aiContextLabels.location },
  promo: { type: "promo", label: aiContextLabels.promo },
};

export function smartRecommendationToMoment(
  rec: SmartRecommendation,
): NearbyMoment {
  return {
    id: rec.id,
    emoji: rec.emoji,
    insight: rec.aiInsight,
    message: rec.benefit,
    benefit: rec.benefit,
    merchantName: rec.merchantName,
    distance: rec.distance,
    merchantId: rec.merchantId ?? "cafe-aurora",
    accent: accentBySource[rec.source],
    isNew: true,
    isOpen: true,
    contextType: contextBySource[rec.source].type,
    contextLabel: contextBySource[rec.source].label,
    aiInsight: rec.aiInsight,
    affinityScore: rec.affinityScore,
    imageUrl: rec.imageUrl,
    description: rec.aiInsight,
    paymentAmount: rec.paymentAmount,
    benefitPercent: rec.benefitPercent,
  };
}
