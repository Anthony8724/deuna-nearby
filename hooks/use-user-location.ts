"use client";

import { useEffect, useState } from "react";
import type { UserCoordinates } from "@/types/smart-recommendation";
import { demoTimings, isDemoMode } from "@/constants/demo";
import { recommendationService } from "@/lib/recommendation-service";

type UseUserLocationResult = {
  location: UserCoordinates | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
};

export function useUserLocation(): UseUserLocationResult {
  const [location, setLocation] = useState<UserCoordinates | null>(
    isDemoMode() ? recommendationService.getFallbackLocation() : null,
  );
  const [isLoading, setIsLoading] = useState(!isDemoMode());
  const [error, setError] = useState<string | null>(
    isDemoMode() ? null : null,
  );
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (isDemoMode()) {
      setLocation(recommendationService.getFallbackLocation());
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function resolveLocation() {
      setIsLoading(true);
      setError(null);

      if (typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (cancelled) return;
            setLocation({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracyMeters: pos.coords.accuracy,
            });
            setIsLoading(false);
          },
          () => {
            if (cancelled) return;
            setLocation(recommendationService.getFallbackLocation());
            setError("Ubicación aproximada");
            setIsLoading(false);
          },
          {
            enableHighAccuracy: false,
            timeout: demoTimings.geolocationTimeoutMs,
            maximumAge: 60000,
          },
        );
      } else {
        setLocation(recommendationService.getFallbackLocation());
        setIsLoading(false);
      }
    }

    void resolveLocation();
    return () => {
      cancelled = true;
    };
  }, [tick]);

  return {
    location,
    isLoading,
    error,
    refresh: () => setTick((t) => t + 1),
  };
}
