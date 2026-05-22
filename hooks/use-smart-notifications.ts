"use client";

import { useEffect, useMemo, useState } from "react";
import { demoTimings } from "@/constants/demo";
import type {
  SmartPushNotification,
  SmartRecommendation,
} from "@/types/smart-recommendation";
import { fetchLiveRecommendations } from "@/lib/live-nearby-api";
import { notificationGenerator } from "@/lib/notification-generator";
import { recommendationService } from "@/lib/recommendation-service";
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
  liveData: boolean;
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
  const [liveRecommendations, setLiveRecommendations] = useState<
    SmartRecommendation[]
  >([]);
  const [liveData, setLiveData] = useState(false);

  const history = useMemo(
    () => recommendationService.getDefaultHistory(),
    [],
  );

  useEffect(() => {
    let cancelled = false;

    void fetchLiveRecommendations().then(({ recommendations, live }) => {
      if (cancelled) return;
      setLiveRecommendations(recommendations);
      setLiveData(live);
    });

    return () => {
      cancelled = true;
    };
  }, [generationTick]);

  const mockRecommendations = useMemo(() => {
    if (!location) return [];
    return recommendationService.getRecommendations(
      location,
      history,
      excludeMerchantNames,
    );
  }, [location, history, excludeMerchantNames, generationTick]);

  const recommendations = useMemo(() => {
    const source = liveRecommendations.length > 0 ? liveRecommendations : mockRecommendations;
    if (excludeMerchantNames.length === 0) return source;
    const excluded = new Set(excludeMerchantNames.map((n) => n.toLowerCase()));
    return source.filter(
      (rec) => !excluded.has(rec.merchantName.toLowerCase()),
    );
  }, [liveRecommendations, mockRecommendations, excludeMerchantNames]);

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
    liveData,
    refresh: () => {
      refreshLocation();
      setGenerationTick((t) => t + 1);
    },
  };
}
