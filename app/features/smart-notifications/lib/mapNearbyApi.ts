import type { NearbyBusiness } from "@/services/nearbyBusinessesService";
import type { NearbyMomentResponse } from "@/services/nearbyMomentService";

import type { ComercioCategoria, Recomendacion } from "../types";

function normalizeCategory(category: string): ComercioCategoria {
  const value = category.toLowerCase();

  if (value.includes("caf") || value.includes("brunch")) return "cafe_brunch";
  if (value.includes("farm")) return "farmacia";
  if (value.includes("super") || value.includes("market")) return "supermercado";
  if (
    value.includes("rest") ||
    value.includes("hamburg") ||
    value.includes("comida")
  ) {
    return "restaurante";
  }
  if (value.includes("fit") || value.includes("gym")) return "fitness";
  if (value.includes("belle") || value.includes("spa")) return "belleza";
  if (value.includes("combust") || value.includes("gas")) return "combustible";
  if (value.includes("pan") || value.includes("bakery")) return "panaderia";
  if (value.includes("retail") || value.includes("tienda")) return "retail";

  return "restaurante";
}

function scoreFromDistanceKm(distanceKm: number): number {
  const meters = distanceKm * 1000;
  const proximity = Math.max(0, Math.min(1, 1 - meters / 2000));
  return Number((0.45 * proximity + 0.35 * 0.7 + 0.2 * 0.8).toFixed(3));
}

export function mapNearbyBusinessToRecomendacion(
  business: NearbyBusiness,
  index = 0,
): Recomendacion {
  const distanciaMetros = Math.max(1, Math.round(business.distanceKm * 1000));
  const proximidad = Math.max(0, Math.min(1, 1 - distanciaMetros / 2000));
  const score = scoreFromDistanceKm(business.distanceKm);

  return {
    id: business.id || `biz-${index}`,
    slug: business.id || `biz-${index}`,
    nombre: business.name,
    nombreComercial: business.name,
    categoria: normalizeCategory(business.category),
    direccionCorta: business.description,
    latitude: business.latitude,
    longitude: business.longitude,
    distanciaMetros,
    tienePromocionActiva: false,
    transaccionesUsuario: 0,
    transaccionesUltimos30Dias: 0,
    ticketPromedioUsd: 0,
    rating: 4.5,
    partnerDeuna: true,
    score,
    desgloseScore: {
      proximidad,
      frecuencia: 0.65,
      promocion: 0.5,
    },
    razonDestacada: `${business.category} · ${business.distanceKm.toFixed(2)} km`,
  };
}

export function mapNearbyBusinessesToRecomendaciones(
  businesses: NearbyBusiness[],
): Recomendacion[] {
  return businesses.map(mapNearbyBusinessToRecomendacion);
}

export function mergeNearbyApiResults(input: {
  momentResponse: NearbyMomentResponse;
  businesses: NearbyBusiness[];
}): Recomendacion[] {
  const fromBusinesses = mapNearbyBusinessesToRecomendaciones(input.businesses);
  const fromMoment = input.momentResponse.recomendaciones ?? [];

  if (fromBusinesses.length === 0) return fromMoment;
  if (fromMoment.length === 0) return fromBusinesses;

  const seen = new Set(fromBusinesses.map((item) => item.id));
  const merged = [...fromBusinesses];

  for (const rec of fromMoment) {
    if (seen.has(rec.id)) continue;
    merged.push(rec);
    seen.add(rec.id);
  }

  return merged.sort((a, b) => a.distanciaMetros - b.distanciaMetros);
}
