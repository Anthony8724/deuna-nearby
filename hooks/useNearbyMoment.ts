"use client";

import { useCallback, useState } from "react";

import {
  getNearbyMoment,
  type GetNearbyMomentOptions,
  type NearbyMomentError,
  type NearbyMomentResponse,
} from "@/services/nearbyMomentService";

export type UseNearbyMomentState = {
  data: NearbyMomentResponse | null;
  loading: boolean;
  error: NearbyMomentError | null;
};

export type UseNearbyMomentReturn = UseNearbyMomentState & {
  fetchNearbyMoment: (
    latitude: number,
    longitude: number,
    options?: GetNearbyMomentOptions,
  ) => Promise<NearbyMomentResponse | null>;
  reset: () => void;
};

/**
 * Hook con loading y error para `getNearbyMoment` (React / React Native).
 */
export function useNearbyMoment(
  defaultOptions?: GetNearbyMomentOptions,
): UseNearbyMomentReturn {
  const [data, setData] = useState<NearbyMomentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<NearbyMomentError | null>(null);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  const fetchNearbyMoment = useCallback(
    async (
      latitude: number,
      longitude: number,
      options?: GetNearbyMomentOptions,
    ): Promise<NearbyMomentResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await getNearbyMoment(latitude, longitude, {
          ...defaultOptions,
          ...options,
        });
        setData(result);
        return result;
      } catch (err) {
        const normalized: NearbyMomentError =
          err && typeof err === "object" && "code" in err
            ? (err as NearbyMomentError)
            : {
                code: "NETWORK",
                message:
                  err instanceof Error ? err.message : "Error desconocido.",
              };
        setError(normalized);
        setData(null);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [defaultOptions],
  );

  return { data, loading, error, fetchNearbyMoment, reset };
}
