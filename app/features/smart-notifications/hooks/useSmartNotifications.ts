"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { pushConversationalMessage } from "../lib/nearbyCopy";
import { getSmartRecommendations } from "../services/recommendationService";
import { useUserLocation } from "./useUserLocation";
import type {
  NotificationContentSource,
  Recomendacion,
  SmartNotification,
  UserLocation,
  UserLocationError,
} from "../types";

/** Umbral mínimo de score para disparar una notificación */
const DEFAULT_SCORE_THRESHOLD = 0.55;

/** Intervalo mínimo entre consultas de recomendaciones (30 s) */
const MIN_LOCATION_FETCH_MS = 30_000;

/** Intervalo máximo sin refrescar aunque no te muevas (60 s) */
const MAX_LOCATION_FETCH_MS = 60_000;

/** Cooldown entre notificaciones push generadas */
const NOTIFICATION_COOLDOWN_MS = 20 * 60 * 1000;

/** Distancia mínima (m) para considerar que el usuario se movió */
const MIN_MOVEMENT_METERS = 40;

const RATE_LIMIT_STORAGE_KEY = "deuna-smart-notif-last-sent";

export type UltimaNotificacion = SmartNotification & {
  recomendacion: Recomendacion;
  source: NotificationContentSource;
  generadaEn: string;
};

export type SmartNotificationsError = {
  code: "LOCATION" | "RECOMMENDATIONS" | "NOTIFICATION" | "CONFIG";
  message: string;
};

export type UseSmartNotificationsOptions = {
  /** Identificador del usuario para personalizar recomendaciones */
  userId?: string;
  /** Nombre para el copy de la notificación */
  userName?: string;
  /** Score mínimo para generar notificación (por defecto 0.55) */
  scoreThreshold?: number;
  /** Iniciar seguimiento de ubicación al montar */
  watchLocationOnMount?: boolean;
};

export type GenerateNotificationOptions = {
  /** Omite el cooldown de 20 min (útil en simulador / pruebas) */
  bypassCooldown?: boolean;
};

export type UseSmartNotificationsReturn = {
  recomendaciones: Recomendacion[];
  loading: boolean;
  error: SmartNotificationsError | null;
  ultimaNotificacion: UltimaNotificacion | null;
  /** Ubicación GPS del dispositivo */
  location: UserLocation | null;
  /** Ubicación simulada (tiene prioridad sobre GPS) */
  simulatedLocation: UserLocation | null;
  /** Ubicación efectiva usada para búsquedas: simulada o GPS */
  effectiveLocation: UserLocation | null;
  locationError: UserLocationError | null;
  locationLoading: boolean;
  /** Solicita la ubicación actual al navegador */
  requestLocation: () => void;
  /** Define o limpia una ubicación simulada */
  setSimulatedLocation: (location: UserLocation | null) => void;
  /** Busca recomendaciones sin generar notificación automática */
  searchRecommendations: () => Promise<void>;
  /** Genera notificación para la mejor recomendación (prueba) */
  sendTestNotification: () => Promise<void>;
  /** Genera notificación para un comercio específico */
  generateNotificationFor: (
    recomendacion: Recomendacion,
    options?: GenerateNotificationOptions,
  ) => Promise<void>;
  /** Alias de searchRecommendations (compatibilidad) */
  triggerRecommendations: () => Promise<void>;
  /** Mensaje push conversacional para una recomendación */
  pushMessageFor: (recomendacion: Recomendacion) => string;
};

/**
 * Calcula distancia aproximada en metros entre dos puntos (fórmula equirectangular).
 */
function distanceMeters(
  a: UserLocation,
  b: UserLocation,
): number {
  const latRad = ((a.latitude + b.latitude) / 2) * (Math.PI / 180);
  const x =
    (b.longitude - a.longitude) *
    Math.cos(latRad) *
    (Math.PI / 180) *
    6371000;
  const y = (b.latitude - a.latitude) * (Math.PI / 180) * 6371000;
  return Math.sqrt(x * x + y * y);
}

function readLastNotificationSentAt(): number {
  if (typeof window === "undefined") return 0;
  const raw = sessionStorage.getItem(RATE_LIMIT_STORAGE_KEY);
  const parsed = raw ? Number(raw) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

function writeLastNotificationSentAt(timestamp: number): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(RATE_LIMIT_STORAGE_KEY, String(timestamp));
}

function canSendNotification(now = Date.now()): boolean {
  return now - readLastNotificationSentAt() >= NOTIFICATION_COOLDOWN_MS;
}

/**
 * Genera la notificación vía API de servidor (protege las API keys de IA).
 */
async function fetchGeneratedNotification(
  recomendacion: Recomendacion,
  userName?: string,
  userId?: string,
): Promise<{ content: SmartNotification; source: NotificationContentSource }> {
  const response = await fetch("/api/smart-notifications/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recomendacion, userName, userId }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
    };
    throw new Error(
      payload.error ?? `Error HTTP ${response.status} al generar notificación.`,
    );
  }

  const data = (await response.json()) as {
    content: {
      title: string;
      body: string;
      actionText: string;
    };
    source: NotificationContentSource;
  };

  return {
    content: {
      id: `notif-${recomendacion.id}-${Date.now()}`,
      title: data.content.title,
      body: data.content.body,
      actionText: data.content.actionText,
    },
    source: data.source,
  };
}

/**
 * Orquesta recomendaciones cercanas y notificaciones inteligentes según ubicación.
 */
export function useSmartNotifications(
  options: UseSmartNotificationsOptions = {},
): UseSmartNotificationsReturn {
  const {
    userId = "guest",
    userName,
    scoreThreshold = DEFAULT_SCORE_THRESHOLD,
    watchLocationOnMount = true,
  } = options;

  const [recomendaciones, setRecomendaciones] = useState<Recomendacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SmartNotificationsError | null>(null);
  const [ultimaNotificacion, setUltimaNotificacion] =
    useState<UltimaNotificacion | null>(null);

  const [simulatedLocation, setSimulatedLocation] =
    useState<UserLocation | null>(null);

  const {
    location,
    error: locationError,
    loading: locationLoading,
    requestLocation,
    startWatching,
    stopWatching,
  } = useUserLocation();

  const effectiveLocation = simulatedLocation ?? location;

  const lastLocationRef = useRef<UserLocation | null>(null);
  const lastFetchAtRef = useRef(0);
  const fetchInFlightRef = useRef(false);
  const requestIdRef = useRef(0);
  const lastNotifiedComercioRef = useRef<string | null>(null);

  const notifyForRecomendacion = useCallback(
    async (
      candidata: Recomendacion,
      requestId: number,
      options: { bypassCooldown?: boolean; auto?: boolean } = {},
    ) => {
      const ahora = Date.now();
      const mismoComercioReciente =
        lastNotifiedComercioRef.current === candidata.id;
      const enCooldown = !canSendNotification(ahora);

      if (
        !options.bypassCooldown &&
        !options.auto &&
        enCooldown
      ) {
        setError({
          code: "NOTIFICATION",
          message:
            "Espera unos minutos antes de generar otra notificación (límite cada 20 min).",
        });
        return;
      }

      if (
        !options.bypassCooldown &&
        options.auto &&
        (enCooldown || mismoComercioReciente)
      ) {
        return;
      }

      const { content, source } = await fetchGeneratedNotification(
        candidata,
        userName,
      );

      if (requestId !== requestIdRef.current) return;

      writeLastNotificationSentAt(ahora);
      lastNotifiedComercioRef.current = candidata.id;

      setUltimaNotificacion({
        ...content,
        recomendacion: candidata,
        source,
        generadaEn: new Date(ahora).toISOString(),
      });
    },
    [userName, userId],
  );

  const pushMessageFor = useCallback(
    (recomendacion: Recomendacion) =>
      pushConversationalMessage(recomendacion, userId),
    [userId],
  );

  /**
   * Busca recomendaciones; opcionalmente dispara notificación automática.
   */
  const runRecommendationsPipeline = useCallback(
    async (
      coords: UserLocation,
      options: {
        autoNotify?: boolean;
        targetRecomendacion?: Recomendacion;
        bypassCooldown?: boolean;
      } = {},
    ) => {
      if (fetchInFlightRef.current && !options.targetRecomendacion) return;

      const requestId = ++requestIdRef.current;
      fetchInFlightRef.current = true;
      setLoading(true);
      setError(null);

      try {
        if (options.targetRecomendacion) {
          await notifyForRecomendacion(options.targetRecomendacion, requestId, {
            bypassCooldown: options.bypassCooldown,
          });
          return;
        }

        const recs = await getSmartRecommendations(
          userId,
          coords.latitude,
          coords.longitude,
        );

        if (requestId !== requestIdRef.current) return;

        setRecomendaciones(recs);

        if (!options.autoNotify) return;

        const candidata = recs.find((r) => r.score > scoreThreshold);
        if (!candidata) return;

        await notifyForRecomendacion(candidata, requestId, { auto: true });
      } catch (err) {
        if (requestId !== requestIdRef.current) return;

        const mensaje =
          err instanceof Error ? err.message : "Error inesperado.";

        setError({
          code: mensaje.includes("notificación")
            ? "NOTIFICATION"
            : "RECOMMENDATIONS",
          message: mensaje,
        });
      } finally {
        if (requestId === requestIdRef.current) {
          fetchInFlightRef.current = false;
          setLoading(false);
        }
      }
    },
    [userId, scoreThreshold, notifyForRecomendacion],
  );

  const requireEffectiveLocation = useCallback((): UserLocation | null => {
    if (!effectiveLocation) {
      setError({
        code: "LOCATION",
        message:
          "No hay ubicación. Obtén tu GPS o simula coordenadas en Quito.",
      });
      return null;
    }
    return effectiveLocation;
  }, [effectiveLocation]);

  const searchRecommendations = useCallback(async () => {
    const coords = requireEffectiveLocation();
    if (!coords) return;
    await runRecommendationsPipeline(coords, { autoNotify: false });
  }, [requireEffectiveLocation, runRecommendationsPipeline]);

  const sendTestNotification = useCallback(async () => {
    const coords = requireEffectiveLocation();
    if (!coords) return;

    const candidata =
      recomendaciones.find((r) => r.score > scoreThreshold) ??
      recomendaciones[0];

    if (!candidata) {
      setError({
        code: "RECOMMENDATIONS",
        message: "Primero busca recomendaciones para enviar una notificación de prueba.",
      });
      return;
    }

    await runRecommendationsPipeline(coords, {
      targetRecomendacion: candidata,
      bypassCooldown: true,
    });
  }, [
    requireEffectiveLocation,
    recomendaciones,
    scoreThreshold,
    runRecommendationsPipeline,
  ]);

  const generateNotificationFor = useCallback(
    async (
      recomendacion: Recomendacion,
      options?: GenerateNotificationOptions,
    ) => {
      const coords = requireEffectiveLocation();
      if (!coords) return;

      await runRecommendationsPipeline(coords, {
        targetRecomendacion: recomendacion,
        bypassCooldown: options?.bypassCooldown ?? true,
      });
    },
    [requireEffectiveLocation, runRecommendationsPipeline],
  );

  const triggerRecommendations = searchRecommendations;

  /**
   * Decide si debe refrescar recomendaciones por tiempo transcurrido o movimiento.
   */
  const shouldRefreshForLocation = useCallback(
    (coords: UserLocation, now: number): boolean => {
      const lastFetch = lastFetchAtRef.current;
      const elapsed = now - lastFetch;

      if (lastFetch === 0) return true;
      if (elapsed >= MAX_LOCATION_FETCH_MS) return true;

      const prev = lastLocationRef.current;
      if (!prev) return elapsed >= MIN_LOCATION_FETCH_MS;

      const moved = distanceMeters(prev, coords) >= MIN_MOVEMENT_METERS;
      return moved && elapsed >= MIN_LOCATION_FETCH_MS;
    },
    [],
  );

  // Iniciar watch de ubicación al montar
  useEffect(() => {
    if (!watchLocationOnMount) return;
    startWatching();
    return () => stopWatching();
  }, [watchLocationOnMount, startWatching, stopWatching]);

  // Sincronizar errores de geolocalización
  useEffect(() => {
    if (!locationError) return;
    setError({
      code: "LOCATION",
      message: locationError.message,
    });
  }, [locationError]);

  // Refrescar recomendaciones cuando cambia la ubicación GPS (no la simulada)
  useEffect(() => {
    if (!location || simulatedLocation) return;

    const now = Date.now();
    if (!shouldRefreshForLocation(location, now)) return;

    lastLocationRef.current = location;
    lastFetchAtRef.current = now;

    void runRecommendationsPipeline(location, { autoNotify: true });
  }, [
    location,
    simulatedLocation,
    shouldRefreshForLocation,
    runRecommendationsPipeline,
  ]);

  return {
    recomendaciones,
    loading: loading || locationLoading,
    error,
    ultimaNotificacion,
    location,
    simulatedLocation,
    effectiveLocation,
    locationError,
    locationLoading,
    requestLocation,
    setSimulatedLocation,
    searchRecommendations,
    sendTestNotification,
    generateNotificationFor,
    triggerRecommendations,
    pushMessageFor,
  };
}
