export type NearbyBusiness = {
  id: string;
  name: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
};

export type NearbyBusinessesResponse = {
  source: "supabase" | "engine";
  userLocation: {
    lat: number;
    lng: number;
  };
  totalBusinesses: number;
  businesses: NearbyBusiness[];
};

export type NearbyBusinessesErrorCode =
  | "CONFIG"
  | "NETWORK"
  | "HTTP"
  | "PARSE"
  | "VALIDATION";

export type NearbyBusinessesError = {
  code: NearbyBusinessesErrorCode;
  message: string;
  status?: number;
};

export type GetNearbyBusinessesOptions = {
  latitude?: number;
  longitude?: number;
  userId?: string;
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

function buildNearbyBusinessesUrl(
  options: GetNearbyBusinessesOptions = {},
): string {
  const base = resolveApiBaseUrl(options.baseUrl);
  const params = new URLSearchParams();

  if (typeof options.latitude === "number" && Number.isFinite(options.latitude)) {
    params.set("lat", String(options.latitude));
  }
  if (
    typeof options.longitude === "number" &&
    Number.isFinite(options.longitude)
  ) {
    params.set("lng", String(options.longitude));
  }
  if (options.userId?.trim()) params.set("userId", options.userId);

  const query = params.toString();
  return `${base}/api/nearby-businesses${query ? `?${query}` : ""}`;
}

/**
 * Obtiene negocios cercanos desde `/api/nearby-businesses`.
 */
export async function getNearbyBusinesses(
  options: GetNearbyBusinessesOptions = {},
): Promise<NearbyBusinessesResponse> {
  const url = buildNearbyBusinessesUrl(options);
  if (!url.startsWith("http")) {
    throw {
      code: "CONFIG",
      message:
        "Configura baseUrl o EXPO_PUBLIC_API_URL / NEXT_PUBLIC_APP_URL para llamar a la API.",
    } satisfies NearbyBusinessesError;
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
    } satisfies NearbyBusinessesError;
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw {
      code: "PARSE",
      message: "La respuesta del servidor no es JSON válido.",
      status: response.status,
    } satisfies NearbyBusinessesError;
  }

  if (!response.ok) {
    const errBody = payload as { error?: string };
    throw {
      code: "HTTP",
      message: errBody.error ?? `Error HTTP ${response.status}`,
      status: response.status,
    } satisfies NearbyBusinessesError;
  }

  const data = payload as NearbyBusinessesResponse;
  if (!data || !Array.isArray(data.businesses)) {
    throw {
      code: "PARSE",
      message: "Formato de respuesta inesperado en nearby-businesses.",
      status: response.status,
    } satisfies NearbyBusinessesError;
  }

  return data;
}

export const nearbyBusinessesService = {
  getNearbyBusinesses,
};
