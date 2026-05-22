import type { UserLocation } from "../types";

const EARTH_RADIUS_METERS = 6_371_000;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Distancia Haversine entre dos puntos WGS84 (metros). */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
}

/** Desplazamiento plano en metros (válido para distancias urbanas cortas). */
export function offsetCoordinate(
  latitude: number,
  longitude: number,
  northMeters: number,
  eastMeters: number,
): UserLocation {
  const latRadians = toRadians(latitude);
  const metersPerDegreeLat = 111_320;
  const metersPerDegreeLon = 111_320 * Math.cos(latRadians);

  return {
    latitude: latitude + northMeters / metersPerDegreeLat,
    longitude: longitude + eastMeters / Math.max(metersPerDegreeLon, 1),
  };
}
