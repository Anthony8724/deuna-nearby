import { useEffect, useMemo } from "react";
import { isDemoMode } from "@/constants/demo";
import { useNearby } from "@/context/nearby-context";
import { useSmartNotifications } from "@/hooks/use-smart-notifications";
import { smartRecommendationToMoment } from "@/lib/smart-recommendation-mapper";

export function NearbyIntelligenceSync() {
  const { visibleMoments, registerSmartMoments, refreshPushQueue } = useNearby();

  const excludeNames = useMemo(
    () =>
      visibleMoments
        .map((m) => m.merchantName)
        .filter((name): name is string => Boolean(name)),
    [visibleMoments],
  );

  const { recommendations } = useSmartNotifications({
    excludeMerchantNames: excludeNames,
    enableBackgroundPush: !isDemoMode(),
    onQueueUpdated: refreshPushQueue,
  });

  useEffect(() => {
    refreshPushQueue();
  }, [refreshPushQueue]);

  useEffect(() => {
    registerSmartMoments(recommendations.map(smartRecommendationToMoment));
  }, [recommendations, registerSmartMoments]);

  return null;
}
