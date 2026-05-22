"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getNearbyBusinesses } from "@/services/nearbyBusinessesService";
import type { NearbyBusiness } from "@/services/nearbyBusinessesService";
import { getNearbyMoment } from "@/services/nearbyMomentService";

import { DEMO_USER } from "../config/demo";
import { DEFAULT_SIMULATED_LOCATION } from "../data/quitoLocationPresets";
import {
  mergeNearbyApiResults,
  mapNearbyBusinessesToRecomendaciones,
} from "../lib/mapNearbyApi";
import { pushConversationalMessage } from "../lib/nearbyCopy";
import type {
  NotificationContentSource,
  Recomendacion,
  UserLocation,
} from "../types";
import type { UltimaNotificacion } from "./useSmartNotifications";
import { useUserLocation } from "./useUserLocation";

export type NearbyGeoError = {
  code: "LOCATION" | "API" | "CONFIG";
  message: string;
};

export type UseNearbyGeoExperienceOptions = {
  userId?: string;
  userName?: string;
  watchLocationOnMount?: boolean;
};

export type UseNearbyGeoExperienceReturn = {
  recomendaciones: Recomendacion[];
  businesses: NearbyBusiness[];
  loading: boolean;
  error: NearbyGeoError | null;
  source: "supabase" | "engine" | null;
  momentTitle: string | null;
  momentMessage: string | null;
  ultimaNotificacion: UltimaNotificacion | null;
  location: UserLocation | null;
  simulatedLocation: UserLocation | null;
  effectiveLocation: UserLocation | null;
  locationError: ReturnType<typeof useUserLocation>["error"];
  locationLoading: boolean;
  requestLocation: () => void;
  setSimulatedLocation: (location: UserLocation | null) => void;
  refreshNearbyData: () => Promise<void>;
  pushMessageFor: (recomendacion: Recomendacion) => string;
  generateNotificationFor: (
    recomendacion: Recomendacion,
    options?: { bypassCooldown?: boolean },
  ) => Promise<void>;
};

function buildUltimaNotificacion(
  recomendacion: Recomendacion,
  title: string,
  message: string,
): UltimaNotificacion {
  return {
    id: `geo-notif-${recomendacion.id}-${Date.now()}`,
    title,
    body: message,
    actionText: "Ver promoción",
    recomendacion,
    source: "fallback" satisfies NotificationContentSource,
    generadaEn: new Date().toISOString(),
  };
}

export function useNearbyGeoExperience(
  options: UseNearbyGeoExperienceOptions = {},
): UseNearbyGeoExperienceReturn {
  const userId = options.userId ?? DEMO_USER.id;
  const watchLocationOnMount = options.watchLocationOnMount ?? false;

  const [recomendaciones, setRecomendaciones] = useState<Recomendacion[]>([]);
  const [businesses, setBusinesses] = useState<NearbyBusiness[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<NearbyGeoError | null>(null);
  const [source, setSource] = useState<"supabase" | "engine" | null>(null);
  const [momentTitle, setMomentTitle] = useState<string | null>(null);
  const [momentMessage, setMomentMessage] = useState<string | null>(null);
  const [ultimaNotificacion, setUltimaNotificacion] =
    useState<UltimaNotificacion | null>(null);
  const [simulatedLocation, setSimulatedLocation] = useState<UserLocation | null>(
    null,
  );

  const initDone = useRef(false);
  const requestIdRef = useRef(0);

  const {
    location,
    error: locationError,
    loading: locationLoading,
    requestLocation,
    startWatching,
    stopWatching,
  } = useUserLocation();

  const effectiveLocation = simulatedLocation ?? location;

  const pushMessageFor = useCallback(
    (recomendacion: Recomendacion) =>
      momentMessage?.trim() ||
      pushConversationalMessage(recomendacion, userId),
    [momentMessage, userId],
  );

  const refreshNearbyData = useCallback(async () => {
    if (!effectiveLocation) {
      setError({
        code: "LOCATION",
        message: "Activa tu GPS o elige una ubicación simulada en Quito.",
      });
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const [momentResponse, businessesResponse] = await Promise.all([
        getNearbyMoment(
          effectiveLocation.latitude,
          effectiveLocation.longitude,
          { userId },
        ),
        getNearbyBusinesses({
          latitude: effectiveLocation.latitude,
          longitude: effectiveLocation.longitude,
          userId,
        }).catch(() => null),
      ]);

      if (requestId !== requestIdRef.current) return;

      const resolvedBusinesses = businessesResponse?.businesses ?? [];
      const resolvedSource =
        businessesResponse?.source ?? momentResponse.source ?? null;

      const mergedRecommendations =
        resolvedBusinesses.length > 0
          ? mergeNearbyApiResults({
              momentResponse,
              businesses: resolvedBusinesses,
            })
          : momentResponse.recomendaciones.length > 0
            ? momentResponse.recomendaciones
            : momentResponse.moment
              ? [momentResponse.moment]
              : [];

      const featured =
        mergedRecommendations[0] ??
        momentResponse.moment ??
        mapNearbyBusinessesToRecomendaciones(resolvedBusinesses)[0] ??
        null;

      const title =
        momentResponse.title?.trim() ||
        (featured ? `DeUna Nearby · ${featured.nombreComercial}` : "DeUna Nearby");
      const message =
        momentResponse.message?.trim() ||
        (featured ? pushConversationalMessage(featured, userId) : null);

      setBusinesses(resolvedBusinesses);
      setRecomendaciones(mergedRecommendations);
      setSource(resolvedSource);
      setMomentTitle(title);
      setMomentMessage(message);

      if (featured && message) {
        setUltimaNotificacion(buildUltimaNotificacion(featured, title, message));
      }
    } catch (err) {
      if (requestId !== requestIdRef.current) return;

      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : err instanceof Error
            ? err.message
            : "No se pudieron cargar los datos cercanos.";

      setError({ code: "API", message });
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [effectiveLocation, userId]);

  const generateNotificationFor = useCallback(
    async (recomendacion: Recomendacion) => {
      const title =
        momentTitle?.trim() ||
        `DeUna Nearby · ${recomendacion.nombreComercial}`;
      const message =
        momentMessage?.trim() ||
        pushConversationalMessage(recomendacion, userId);

      setUltimaNotificacion(
        buildUltimaNotificacion(recomendacion, title, message),
      );
    },
    [momentTitle, momentMessage, userId],
  );

  useEffect(() => {
    if (!watchLocationOnMount) return;
    startWatching();
    return () => stopWatching();
  }, [watchLocationOnMount, startWatching, stopWatching]);

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;
    setSimulatedLocation(DEFAULT_SIMULATED_LOCATION);
  }, []);

  useEffect(() => {
    if (!effectiveLocation) return;
    void refreshNearbyData();
  }, [effectiveLocation, refreshNearbyData]);

  const resolvedLoading = useMemo(
    () => loading || locationLoading,
    [loading, locationLoading],
  );

  return {
    recomendaciones,
    businesses,
    loading: resolvedLoading,
    error,
    source,
    momentTitle,
    momentMessage,
    ultimaNotificacion,
    location,
    simulatedLocation,
    effectiveLocation,
    locationError,
    locationLoading,
    requestLocation,
    setSimulatedLocation,
    refreshNearbyData,
    pushMessageFor,
    generateNotificationFor,
  };
}
