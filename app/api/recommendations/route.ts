import { NextResponse } from "next/server";
import { supabase } from "../../../src/lib/supabase";
import { calculateRecommendationScore } from "../../../src/lib/recommendation-engine";

export async function GET() {
  const favoriteCategory = "Hamburguesas";

  const { data: businesses, error } = await supabase
    .from("businesses")
    .select("*");

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const recommendations = businesses
    ?.map((business) => {
      const distanceMeters =
        business.name === "Burger Factory" ? 250 : 700;

      const discount =
        business.name === "Burger Factory" ? 15 : 10;

      const score = calculateRecommendationScore(
        business.category,
        favoriteCategory,
        distanceMeters,
        discount
      );

      return {
        id: business.id,
        name: business.name,
        category: business.category,
        description: business.description,
        distanceMeters,
        discount,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

  return NextResponse.json({
    user: "user_demo",
    favoriteCategory,
    recommendations,
  });
}