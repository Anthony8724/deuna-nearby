"use client";

import { useEffect, useMemo, useState } from "react";
import { demoTimings } from "@/constants/demo";
import type {
  SmartPushNotification,
  SmartRecommendation,
} from "@/types/smart-recommendation";
import { recommendationService } from "@/lib/recommendation-service";
import { notificationGenerator } from "@/lib/notification-generator";
import { useUserLocation } from "./use-user-location";

type UseSmartNotificationsOptions = {
  excludeMerchantNames?: string[];
  enableBackgroundPush?: boolean;
  onQueueUpdated?: () => void;
};

type UseSmartNotificationsResult = {
  recommendations: SmartRecommendation[];
  pushQueue: SmartPushNotification[];
  isLoading: boolean;
  locationReady: boolean;
  refresh: () => void;
};

export function useSmartNotifications(
  options: UseSmartNotificationsOptions = {},
): UseSmartNotificationsResult {
  const { excludeMerchantNames = [], enableBackgroundPush = true, onQueueUpdated } =
    options;
  const { location, isLoading: locationLoading, refresh: refreshLocation } =
    useUserLocation();
  const [pushQueue, setPushQueue] = useState<SmartPushNotification[]>([]);
  const [generationTick, setGenerationTick] = useState(0);

  const history = useMemo(
    () => recommendationService.getDefaultHistory(),
    [],
  );

  const recommendations = useMemo(() => {
    if (!location) return [];
    return recommendationService.getRecommendations(
      location,
      history,
      excludeMerchantNames,
    );
  }, [location, history, excludeMerchantNames, generationTick]);

  useEffect(() => {
    if (!enableBackgroundPush || recommendations.length === 0) return;

    const timer = setTimeout(() => {
      const generated = notificationGenerator.generate(recommendations);
      const queued = notificationGenerator.enqueue(generated);
      setPushQueue(queued);
      onQueueUpdated?.();
    }, demoTimings.smartPushDelayMs);

    return () => clearTimeout(timer);
  }, [recommendations, enableBackgroundPush, onQueueUpdated]);

  useEffect(() => {
    setPushQueue(notificationGenerator.getQueue());
  }, []);

  return {
    recommendations,
    pushQueue,
    isLoading: locationLoading,
    locationReady: Boolean(location),
    refresh: () => {
      refreshLocation();
      setGenerationTick((t) => t + 1);
    },
  };
}
