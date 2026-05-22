import type { ComercioCategoria, Recomendacion } from "@/app/features/smart-notifications/types";

import type { SupabaseRecommendationRow } from "./nearby-recommendations-data";

function normalizeCategory(category: string): ComercioCategoria {
  const value = category.toLowerCase();
  if (value.includes("caf")) return "cafe_brunch";
  if (value.includes("farm")) return "farmacia";
  if (value.includes("super") || value.includes("market")) return "supermercado";
  if (value.includes("hamburg") || value.includes("rest")) return "restaurante";
  if (value.includes("fit")) return "fitness";
  if (value.includes("belle")) return "belleza";
  if (value.includes("pan")) return "panaderia";
  if (value.includes("retail")) return "retail";
  return "restaurante";
}

export function mapSupabaseRowToRecomendacion(
  row: SupabaseRecommendationRow,
): Recomendacion {
  const proximidad = Math.max(0, Math.min(1, 1 - row.distanceMeters / 2000));
  const score = Math.min(1, row.score / 100);

  return {
    id: String(row.id),
    slug: String(row.id),
    nombre: row.name,
    nombreComercial: row.name,
    categoria: normalizeCategory(row.category),
    direccionCorta: row.description ?? row.category,
    latitude: -0.1807,
    longitude: -78.4678,
    distanciaMetros: row.distanceMeters,
    tienePromocionActiva: row.discount > 0,
    promocion: row.discount
      ? {
          id: `promo-${row.id}`,
          titulo: row.promotionTitle,
          tipo: "descuento",
          valor: row.discount,
          vigenteHasta: "2026-12-31",
          canal: "push",
        }
      : undefined,
    transaccionesUsuario: 3,
    transaccionesUltimos30Dias: 2,
    ticketPromedioUsd: 12,
    rating: 4.8,
    partnerDeuna: true,
    score,
    desgloseScore: {
      proximidad,
      frecuencia: 0.7,
      promocion: Math.min(1, row.discount / 20),
    },
    razonDestacada: `${row.promotionTitle} · ${row.distanceMeters} m`,
  };
}

export function buildNearbyMomentMessage(
  featured: Recomendacion,
  favoriteCategory: string,
): string {
  const discount = featured.promocion?.valor ?? 10;
  return `Vimos que te interesan las ${favoriteCategory.toLowerCase()}. ${featured.nombreComercial} está a ${featured.distanciaMetros}m con ${discount}% beneficio DeUna.`;
}
