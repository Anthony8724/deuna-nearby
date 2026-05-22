import {
  mapApiRecommendationsPayload,
  type ApiRecommendationsPayload,
} from "@/lib/api-recommendation-mapper";
import type { SmartRecommendation } from "@/types/smart-recommendation";

export async function fetchLiveRecommendations(): Promise<{
  recommendations: SmartRecommendation[];
  live: boolean;
}> {
  try {
    const res = await fetch("/api/recommendations", { cache: "no-store" });
    if (!res.ok) return { recommendations: [], live: false };
    const payload = (await res.json()) as ApiRecommendationsPayload;
    const recommendations = mapApiRecommendationsPayload(payload);
    return { recommendations, live: recommendations.length > 0 };
  } catch {
    return { recommendations: [], live: false };
  }
}
