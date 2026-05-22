import { DEFAULT_SIMULATED_LOCATION } from "../data/quitoLocationPresets";
import type { CercaDeTiCardModel } from "./cercaDeTiCard";
import type {
  ComercioCategoria,
  PromocionActiva,
  Recomendacion,
  UserLocation,
} from "../types";

function offsetFromOrigin(
  origin: UserLocation,
  distanciaMetros: number,
): { latitude: number; longitude: number } {
  const north = distanciaMetros * 0.7;
  const east = distanciaMetros * 0.3;
  const latRad = (origin.latitude * Math.PI) / 180;
  const latitude =
    origin.latitude + (north / 6371000) * (180 / Math.PI);
  const longitude =
    origin.longitude +
    (east / 6371000) * (180 / Math.PI) / Math.cos(latRad);
  return { latitude, longitude };
}

function inferCategoria(card: CercaDeTiCardModel): ComercioCategoria {
  if (card.imageEmoji === "🍔" || card.nombre.toLowerCase().includes("burger")) {
    return "restaurante";
  }
  if (card.imageEmoji === "☕" || card.nombre.toLowerCase().includes("café")) {
    return "cafe_brunch";
  }
  return card.recomendacion?.categoria ?? "retail";
}

function inferPromocion(card: CercaDeTiCardModel): PromocionActiva | undefined {
  const matchPct = card.beneficio.match(/(\d+)%/);
  if (card.beneficio.includes("2x")) {
    return {
      id: `promo-${card.id}`,
      titulo: card.beneficio,
      tipo: "2x1",
      valor: 100,
      vigenteHasta: "2026-06-30T23:59:59.000Z",
      canal: "in_app",
    };
  }
  if (matchPct) {
    return {
      id: `promo-${card.id}`,
      titulo: card.beneficio,
      tipo: "descuento",
      valor: Number(matchPct[1]),
      vigenteHasta: "2026-06-30T23:59:59.000Z",
      canal: "in_app",
    };
  }
  return card.recomendacion?.promocion;
}

function parseAfinidadScore(afinidadLabel: string): number {
  const match = afinidadLabel.match(/(\d+)%/);
  if (match) return Number(match[1]) / 100;
  return 0.85;
}

/** Recomendación sintética para cards baseline del home (Burger Factory, etc.) */
export function syntheticRecomendacionFromCard(
  card: CercaDeTiCardModel,
  origin: UserLocation = DEFAULT_SIMULATED_LOCATION,
): Recomendacion {
  const score = parseAfinidadScore(card.afinidadLabel);
  const categoria = inferCategoria(card);
  const coords = offsetFromOrigin(origin, card.distanciaMetros);
  const promocion = inferPromocion(card);

  return {
    id: card.id,
    slug: card.id,
    nombre: card.nombre,
    nombreComercial: card.nombre,
    categoria,
    direccionCorta: "Cerca de tu ubicación",
    latitude: coords.latitude,
    longitude: coords.longitude,
    tienePromocionActiva: Boolean(promocion),
    promocion,
    transaccionesUsuario: 4,
    transaccionesUltimos30Dias: 2,
    ticketPromedioUsd: 12,
    rating: 4.6,
    partnerDeuna: true,
    distanciaMetros: card.distanciaMetros,
    score,
    desgloseScore: {
      proximidad: Math.min(1, 400 / Math.max(card.distanciaMetros, 80)),
      frecuencia: score * 0.7,
      promocion: promocion ? 0.9 : 0.4,
    },
    razonDestacada: "Recomendado según tus intereses recientes",
  };
}

/**
 * Obtiene la Recomendacion completa para abrir detalle desde una card del carrusel.
 */
export function resolveCardRecomendacion(
  card: CercaDeTiCardModel,
  pool: Recomendacion[],
  origin?: UserLocation | null,
): Recomendacion {
  if (card.recomendacion) return card.recomendacion;

  const byName = pool.find(
    (r) =>
      r.nombreComercial.toLowerCase().trim() ===
      card.nombre.toLowerCase().trim(),
  );
  if (byName) return byName;

  const byId = pool.find((r) => r.id === card.id);
  if (byId) return byId;

  return syntheticRecomendacionFromCard(
    card,
    origin ?? DEFAULT_SIMULATED_LOCATION,
  );
}
