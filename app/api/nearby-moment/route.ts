import { NextResponse } from "next/server";

import { fetchNearbyRecommendationsData } from "../../../src/lib/nearby-recommendations-data";
import {
  buildNearbyMomentMessage,
  mapSupabaseRowToRecomendacion,
} from "../../../src/lib/map-supabase-recomendacion";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat") ?? "-0.1807");
  const lng = Number(searchParams.get("lng") ?? "-78.4678");

  const { favoriteCategory, recommendations } =
    await fetchNearbyRecommendationsData();

  const recomendaciones = recommendations.map(mapSupabaseRowToRecomendacion);
  const moment = recomendaciones[0] ?? null;
  const message = moment
    ? buildNearbyMomentMessage(moment, favoriteCategory)
    : "Descubre beneficios DeUna cerca de ti.";

  return NextResponse.json({
    title: "DeUna Nearby",
    message,
    moment,
    recomendaciones,
    source: "supabase",
    meta: { latitude: lat, longitude: lng },
  });
}
