"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type {
  UserLocation,
  UserLocationError,
  UserLocationErrorCode,
} from "../types";

/** Opciones por defecto para getCurrentPosition / watchPosition */
const DEFAULT_GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10_000,
  maximumAge: 0,
};

/** Comprueba si la Geolocation API está disponible (solo en cliente) */
function isGeolocationSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    "geolocation" in navigator
  );
}

/** Convierte una posición del navegador al tipo del dominio */
function toUserLocation(position: GeolocationPosition): UserLocation {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

/** Mapea el código numérico de GeolocationPositionError a nuestro tipo */
function toErrorCode(code: number): UserLocationErrorCode {
  switch (code) {
    case 1:
      return "PERMISSION_DENIED";
    case 2:
      return "POSITION_UNAVAILABLE";
    case 3:
      return "TIMEOUT";
    default:
      return "UNKNOWN";
  }
}

function toUserLocationError(
  geoError: GeolocationPositionError,
): UserLocationError {
  return {
    code: toErrorCode(geoError.code),
    message: geoError.message || "No se pudo obtener la ubicación.",
  };
}

const NOT_SUPPORTED_ERROR: UserLocationError = {
  code: "NOT_SUPPORTED",
  message: "La geolocalización no está disponible en este navegador.",
};

export type UseUserLocationOptions = {
  /** Opciones pasadas a getCurrentPosition / watchPosition */
  geoOptions?: PositionOptions;
  /** Si es true, solicita la ubicación al montar el hook */
  requestOnMount?: boolean;
};

export type UseUserLocationReturn = {
  location: UserLocation | null;
  error: UserLocationError | null;
  loading: boolean;
  /** Obtiene la ubicación actual una sola vez */
  requestLocation: () => void;
  /** Inicia watchPosition para actualizaciones en tiempo real */
  startWatching: () => void;
  /** Detiene watchPosition si estaba activo */
  stopWatching: () => void;
};

/**
 * Hook para obtener y seguir la ubicación del usuario con la Geolocation API.
 *
 * @example
 * const { location, loading, requestLocation, startWatching, stopWatching } =
 *   useUserLocation({ requestOnMount: true });
 */
export function useUserLocation(
  options: UseUserLocationOptions = {},
): UseUserLocationReturn {
  const { geoOptions, requestOnMount = false } = options;

  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<UserLocationError | null>(null);
  const [loading, setLoading] = useState(false);

  const watchIdRef = useRef<number | null>(null);
  const geoOptionsRef = useRef<PositionOptions>({
    ...DEFAULT_GEO_OPTIONS,
    ...geoOptions,
  });

  // Mantener opciones actualizadas sin recrear callbacks en cada render
  useEffect(() => {
    geoOptionsRef.current = {
      ...DEFAULT_GEO_OPTIONS,
      ...geoOptions,
    };
  }, [geoOptions]);

  /** Detiene el seguimiento activo y libera el watch del navegador */
  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null && isGeolocationSupported()) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setLocation(toUserLocation(position));
    setError(null);
    setLoading(false);
  }, []);

  const handleError = useCallback((geoError: GeolocationPositionError) => {
    setError(toUserLocationError(geoError));
    setLoading(false);
  }, []);

  /** Consulta el estado del permiso de geolocalización cuando el navegador lo permite */
  const checkPermission = useCallback(async (): Promise<void> => {
    if (
      typeof navigator === "undefined" ||
      !navigator.permissions?.query
    ) {
      return;
    }

    try {
      const status = await navigator.permissions.query({
        name: "geolocation",
      });

      if (status.state === "denied") {
        setError({
          code: "PERMISSION_DENIED",
          message:
            "Permiso de ubicación denegado. Habilítalo en la configuración del navegador.",
        });
        setLoading(false);
      }

      status.onchange = () => {
        if (status.state === "granted") {
          setError(null);
        } else if (status.state === "denied") {
          setError({
            code: "PERMISSION_DENIED",
            message:
              "Permiso de ubicación denegado. Habilítalo en la configuración del navegador.",
          });
          stopWatching();
        }
      };
    } catch {
      // Algunos navegadores no soportan permissions.query para geolocation
    }
  }, [stopWatching]);

  const requestLocation = useCallback(() => {
    if (!isGeolocationSupported()) {
      setError(NOT_SUPPORTED_ERROR);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    void checkPermission();

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      geoOptionsRef.current,
    );
  }, [handleSuccess, handleError, checkPermission]);

  const startWatching = useCallback(() => {
    if (!isGeolocationSupported()) {
      setError(NOT_SUPPORTED_ERROR);
      setLoading(false);
      return;
    }

    stopWatching();
    setLoading(true);
    setError(null);
    void checkPermission();

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      geoOptionsRef.current,
    );
  }, [handleSuccess, handleError, checkPermission, stopWatching]);

  // Solicitud inicial opcional al montar
  useEffect(() => {
    if (requestOnMount) {
      requestLocation();
    }
  }, [requestOnMount, requestLocation]);

  // Limpiar watch al desmontar para evitar fugas de memoria
  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, [stopWatching]);

  return {
    location,
    error,
    loading,
    requestLocation,
    startWatching,
    stopWatching,
  };
}
