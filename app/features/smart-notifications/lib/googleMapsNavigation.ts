import type { UserLocation } from "../types";

const GOOGLE_MAPS_DIR_ORIGIN = "https://www.google.com/maps/dir/";

export type GoogleMapsTravelMode =
  | "driving"
  | "walking"
  | "bicycling"
  | "transit";

export type OpenGoogleMapsNavigationOptions = {
  /** Origen del usuario; si se omite, Google usa la ubicación actual del dispositivo */
  origin?: UserLocation | null;
  travelMode?: GoogleMapsTravelMode;
};

export type OpenGoogleMapsNavigationResult = {
  opened: boolean;
  url: string;
  usedOrigin: boolean;
  /** Ventana bloqueada por el navegador; se intentó fallback */
  popupBlocked?: boolean;
  /** Fallback por enlace programático también falló */
  fallbackFailed?: boolean;
  /** Enlace copiado al portapapeles tras fallo de apertura */
  clipboardCopied?: boolean;
};

function formatCoord(latitude: number, longitude: number): string {
  return `${latitude},${longitude}`;
}

/**
 * URL oficial de Google Maps Directions (navegación).
 * @see https://developers.google.com/maps/documentation/urls/get-started#directions-action
 */
export function buildGoogleMapsDirectionsUrl(
  latitude: number,
  longitude: number,
  _nombre?: string,
  options?: OpenGoogleMapsNavigationOptions,
): string {
  const params = new URLSearchParams();
  params.set("api", "1");
  params.set("destination", formatCoord(latitude, longitude));

  const origin = options?.origin;
  if (
    origin &&
    Number.isFinite(origin.latitude) &&
    Number.isFinite(origin.longitude)
  ) {
    params.set("origin", formatCoord(origin.latitude, origin.longitude));
  }

  const mode = options?.travelMode ?? "walking";
  params.set("travelmode", mode);

  return `${GOOGLE_MAPS_DIR_ORIGIN}?${params.toString()}`;
}

function openInNewTab(url: string): Window | null {
  if (typeof window === "undefined") return null;
  try {
    return window.open(url, "_blank", "noopener,noreferrer");
  } catch {
    return null;
  }
}

/** Clic programático — fallback cuando `window.open` es bloqueado */
function openViaAnchor(url: string): boolean {
  if (typeof document === "undefined") return false;
  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    return true;
  } catch {
    return false;
  }
}

async function copyUrlToClipboard(url: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    return false;
  }
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}

function isPopupBlocked(win: Window | null): boolean {
  return !win || win.closed === true;
}

/**
 * Abre Google Maps con navegación hacia el comercio en una pestaña nueva.
 * Usa `origin` si está disponible; si no, Google toma la ubicación del dispositivo.
 */
export async function openGoogleMapsNavigation(
  latitude: number,
  longitude: number,
  nombre?: string,
  options?: OpenGoogleMapsNavigationOptions,
): Promise<OpenGoogleMapsNavigationResult> {
  const url = buildGoogleMapsDirectionsUrl(latitude, longitude, nombre, options);
  const usedOrigin = Boolean(options?.origin);

  if (typeof window === "undefined") {
    return { opened: false, url, usedOrigin, fallbackFailed: true };
  }

  const win = openInNewTab(url);
  if (!isPopupBlocked(win)) {
    return { opened: true, url, usedOrigin };
  }

  const anchorOk = openViaAnchor(url);
  if (anchorOk) {
    return { opened: true, url, usedOrigin, popupBlocked: true };
  }

  const clipboardCopied = await copyUrlToClipboard(url);

  return {
    opened: false,
    url,
    usedOrigin,
    popupBlocked: true,
    fallbackFailed: true,
    clipboardCopied,
  };
}
