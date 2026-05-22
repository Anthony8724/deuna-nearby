import { NextResponse } from "next/server";
import { supabase } from "../../../src/lib/supabase";
import { calculateRecommendationScore } from "../../../src/lib/recommendation-engine";

export async function GET() {
  const { data: transactions, error: transactionsError } = await supabase
    .from("transactions")
    .select("*");

  if (transactionsError) {
    return NextResponse.json({ error: transactionsError.message }, { status: 500 });
  }

  const counts: Record<string, number> = {};

  transactions?.forEach((t) => {
    counts[t.category] = (counts[t.category] || 0) + 1;
  });

  const favoriteCategory =
    Object.keys(counts).length > 0
      ? Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b))
      : "Hamburguesas";

  const { data: businesses, error: businessesError } = await supabase
    .from("businesses")
    .select("*");

  if (businessesError) {
    return NextResponse.json({ error: businessesError.message }, { status: 500 });
  }

  const { data: promotions, error: promotionsError } = await supabase
    .from("promotions")
    .select("*")
    .eq("active", true);

  if (promotionsError) {
    return NextResponse.json({ error: promotionsError.message }, { status: 500 });
  }

  const recommendations = businesses
    ?.map((business) => {
      const promotion = promotions?.find((p) => p.business_id === business.id);

      const distanceMeters = business.name === "Burger Factory" ? 250 : 700;
      const discount = promotion?.discount || 5;

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
        promotionTitle: promotion?.title || "Beneficio DeUna",
      };
    })
    .sort((a, b) => b.score - a.score);

  return NextResponse.json({
    user: "user_demo",
    favoriteCategory,
    recommendations,
  });
}