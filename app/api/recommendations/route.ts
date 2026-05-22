import { NextResponse } from "next/server";

import { fetchNearbyRecommendationsData } from "../../../src/lib/nearby-recommendations-data";

export async function GET() {
  const { favoriteCategory, recommendations } =
    await fetchNearbyRecommendationsData();

  return NextResponse.json({
    user: "user_demo",
    favoriteCategory,
    recommendations,
  });
}
