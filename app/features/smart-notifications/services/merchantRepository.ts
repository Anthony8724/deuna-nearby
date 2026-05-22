import { MERCHANTS_CATALOG } from "../data/merchantsCatalog";
import { calculateDistance, offsetCoordinate } from "../lib/geo";
import {
  buildUserAffinityProfile,
  isPreferredCategory,
} from "../lib/userAffinity";
import type { ComercioCandidato, PromocionActiva } from "../types";

/**
 * Repositorio de comercios — capa de datos desacoplada del scoring.
 * Sustituir implementación por Supabase RPC en producción.
 */
export async function fetchNearbyMerchantCandidates(
  userId: string,
  latitude: number,
  longitude: number,
  radiusMeters: number,
): Promise<ComercioCandidato[]> {
  const affinity = buildUserAffinityProfile(userId);

  const candidatos = MERCHANTS_CATALOG.map((entry, index) => {
    const coords = offsetCoordinate(
      latitude,
      longitude,
      entry.northMeters,
      entry.eastMeters,
    );

    const afinidadBoost = isPreferredCategory(affinity, entry.categoria)
      ? 3 + (affinity.seed % 4)
      : 0;
    const variacionUsuario = (affinity.seed + index * 13) % 4;

    const transaccionesUsuario = Math.round(
      (entry.transaccionesBase + afinidadBoost + variacionUsuario) *
        affinity.multiplicadorFrecuencia,
    );
    const transaccionesUltimos30Dias = Math.max(
      1,
      Math.round(
        entry.transacciones30dBase +
          (afinidadBoost > 0 ? 2 : 0) +
          variacionUsuario * 0.5,
      ),
    );

    let promocion: PromocionActiva | undefined;
    if (entry.promocion) {
      promocion = {
        id: entry.promocion.promoId,
        titulo: entry.promocion.titulo,
        tipo: entry.promocion.tipo,
        valor: entry.promocion.valor,
        vigenteHasta: entry.promocion.vigenteHasta,
        canal: entry.promocion.canal,
      };
    }

    const candidato: ComercioCandidato = {
      id: entry.id,
      slug: entry.slug,
      nombre: entry.nombreComercial,
      nombreComercial: entry.nombreComercial,
      categoria: entry.categoria,
      direccionCorta: entry.direccionCorta,
      latitude: coords.latitude,
      longitude: coords.longitude,
      tienePromocionActiva: Boolean(promocion),
      promocion,
      transaccionesUsuario,
      transaccionesUltimos30Dias,
      ticketPromedioUsd: entry.ticketPromedioUsd,
      rating: entry.rating,
      partnerDeuna: entry.partnerDeuna,
    };

    return candidato;
  }).filter((comercio) => {
    const distancia = calculateDistance(
      latitude,
      longitude,
      comercio.latitude,
      comercio.longitude,
    );
    return distancia <= radiusMeters;
  });

  // Simula latencia de red / PostGIS
  await new Promise((resolve) => setTimeout(resolve, 120 + (affinity.seed % 80)));

  return candidatos;
}
