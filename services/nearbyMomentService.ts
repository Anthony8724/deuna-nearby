import type { Recomendacion } from "@/app/features/smart-notifications/types";

export type NearbyMomentErrorCode =
  | "CONFIG"
  | "NETWORK"
  | "HTTP"
  | "PARSE"
  | "EMPTY"
  | "VALIDATION";

export type NearbyMomentError = {
  code: NearbyMomentErrorCode;
  message: string;
  status?: number;
};

export type NearbyMomentResponse = {
  /** Formato backend final */
  title?: string;
  message?: string;
  moment: Recomendacion | null;
  recomendaciones: Recomendacion[];
  source?: "supabase" | "engine";
  meta?: {
    latitude: number;
    longitude: number;
    userId?: string;
  };
};

export type GetNearbyMomentOptions = {
  userId?: string;
  /** Base URL de la app (ej. https://tu-dominio.com). En RN: EXPO_PUBLIC_API_URL */
  baseUrl?: string;
  signal?: AbortSignal;
};

function resolveApiBaseUrl(override?: string): string {
  if (override?.trim()) return override.replace(/\/$/, "");

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  const fromEnv =
    process.env.EXPO_PUBLIC_API_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.API_URL;

  if (fromEnv?.trim()) return fromEnv.replace(/\/$/, "");

  return "";
}

function buildNearbyMomentUrl(
  latitude: number,
  longitude: number,
  options: GetNearbyMomentOptions = {},
): string {
  const base = resolveApiBaseUrl(options.baseUrl);
  const path = "/api/nearby-moment";
  const params = new URLSearchParams({
    lat: String(latitude),
    lng: String(longitude),
  });
  if (options.userId) params.set("userId", options.userId);
  return `${base}${path}?${params.toString()}`;
}

/**
 * Obtiene el momento cercano destacado y recomendaciones desde `/api/nearby-moment`.
 */
export async function getNearbyMoment(
  latitude: number,
  longitude: number,
  options: GetNearbyMomentOptions = {},
): Promise<NearbyMomentResponse> {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw {
      code: "VALIDATION",
      message: "Latitud y longitud deben ser números válidos.",
    } satisfies NearbyMomentError;
  }

  const url = buildNearbyMomentUrl(latitude, longitude, options);
  if (!url.startsWith("http")) {
    throw {
      code: "CONFIG",
      message:
        "Configura baseUrl o EXPO_PUBLIC_API_URL / NEXT_PUBLIC_APP_URL para llamar a la API.",
    } satisfies NearbyMomentError;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: options.signal,
    });
  } catch (err) {
    const aborted =
      typeof DOMException !== "undefined" &&
      err instanceof DOMException &&
      err.name === "AbortError";
    throw {
      code: "NETWORK",
      message: aborted
        ? "Solicitud cancelada."
        : "No se pudo conectar con el servidor. Revisa tu red.",
    } satisfies NearbyMomentError;
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw {
      code: "PARSE",
      message: "La respuesta del servidor no es JSON válido.",
      status: response.status,
    } satisfies NearbyMomentError;
  }

  if (!response.ok) {
    const errBody = payload as { error?: string };
    throw {
      code: "HTTP",
      message: errBody.error ?? `Error HTTP ${response.status}`,
      status: response.status,
    } satisfies NearbyMomentError;
  }

  const data = payload as NearbyMomentResponse & {
    title?: string;
    message?: string;
    recomendaciones?: Recomendacion[];
    moment?: Recomendacion | null;
  };

  const title = data.title?.trim();
  const message = data.message?.trim();
  const recomendaciones = Array.isArray(data.recomendaciones) ? data.recomendaciones : [];

  if (title && message && recomendaciones.length === 0 && !data.moment) {
    return {
      title,
      message,
      moment: null,
      recomendaciones: [],
      source: data.source,
      meta: data.meta,
    };
  }

  if (!data || !Array.isArray(data.recomendaciones)) {
    throw {
      code: "PARSE",
      message: "Formato de respuesta inesperado.",
      status: response.status,
    } satisfies NearbyMomentError;
  }

  if (!data.moment && data.recomendaciones.length === 0 && !(title && message)) {
    throw {
      code: "EMPTY",
      message: "No hay recomendaciones cerca de esta ubicación.",
    } satisfies NearbyMomentError;
  }

  return {
    title: data.title,
    message: data.message,
    moment: data.moment ?? data.recomendaciones[0] ?? null,
    recomendaciones: data.recomendaciones,
    source: data.source,
    meta: data.meta,
  };
}

export const nearbyMomentService = {
  getNearbyMoment,
};
