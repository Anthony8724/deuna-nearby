import {
  aiContextLabels,
  getHomeInsight,
  type AiContextType,
} from "@/constants/context-intelligence";
import type { NearbyMoment } from "@/types/nearby-moment";

export function getMomentContextBadge(moment: NearbyMoment): string {
  if (moment.contextLabel) return moment.contextLabel;
  if (moment.contextType) return aiContextLabels[moment.contextType];
  return aiContextLabels.habits;
}

export function getMomentContextReason(moment: NearbyMoment): string {
  return (
    moment.aiInsight ??
    moment.insight ??
    moment.description ??
    moment.message ??
    getMomentContextBadge(moment)
  );
}

export function getMomentContextType(moment: NearbyMoment): AiContextType {
  return moment.contextType ?? "habits";
}

export { getHomeInsight, aiContextLabels };
