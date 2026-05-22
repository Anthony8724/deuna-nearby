import type { Recomendacion } from "../types";
import { fetchNearbyMerchantCandidates } from "./merchantRepository";
import { calculateDistance, rankCandidates } from "./scoring";

export type GetSmartRecommendationsOptions = {
  radiusMeters?: number;
  limit?: number;
};

export { calculateDistance };

/**
 * Motor de recomendaciones Radar DeUna.
 * Orquesta repositorio de comercios + scoring ponderado.
 */
export async function getSmartRecommendations(
  userId: string,
  latitude: number,
  longitude: number,
  options: GetSmartRecommendationsOptions = {},
): Promise<Recomendacion[]> {
  const radiusMeters = options.radiusMeters ?? 2_000;
  const limit = options.limit ?? 8;

  /*
   * --- Supabase RPC (producción) ---
   * const { data, error } = await supabase.rpc("get_nearby_merchants_with_user_stats", {
   *   p_user_id: userId,
   *   p_latitude: latitude,
   *   p_longitude: longitude,
   *   p_radius_meters: radiusMeters,
   * });
   * const candidatos = mapRowsToComercioCandidato(data);
   */

  const candidatos = await fetchNearbyMerchantCandidates(
    userId,
    latitude,
    longitude,
    radiusMeters,
  );

  return rankCandidates(candidatos, latitude, longitude, radiusMeters).slice(
    0,
    limit,
  );
}

export const recommendationService = {
  getSmartRecommendations,
  calculateDistance,
};
