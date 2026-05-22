import { calculateRecommendationScore } from "./recommendation-engine";
import { supabase } from "./supabase";

export type SupabaseRecommendationRow = {
  id: string | number;
  name: string;
  category: string;
  description?: string;
  distanceMeters: number;
  discount: number;
  score: number;
  promotionTitle: string;
};

export async function fetchNearbyRecommendationsData(): Promise<{
  favoriteCategory: string;
  recommendations: SupabaseRecommendationRow[];
}> {
  const { data: transactions } = await supabase.from("transactions").select("*");

  const categoryCount: Record<string, number> = {};
  transactions?.forEach((t) => {
    const category = String(t.category ?? "");
    if (!category) return;
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });

  const favoriteCategory =
    Object.keys(categoryCount).length > 0
      ? Object.keys(categoryCount).reduce((a, b) =>
          categoryCount[a] > categoryCount[b] ? a : b,
        )
      : "Hamburguesas";

  const { data: businesses } = await supabase.from("businesses").select("*");
  const { data: promotions } = await supabase
    .from("promotions")
    .select("*")
    .eq("active", true);

  const recommendations =
    businesses
      ?.map((business) => {
        const promotion = promotions?.find((p) => p.business_id === business.id);
        const distanceMeters = business.name === "Burger Factory" ? 250 : 700;
        const discount = promotion?.discount || 5;

        const score = calculateRecommendationScore(
          business.category,
          favoriteCategory,
          distanceMeters,
          discount,
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
        } satisfies SupabaseRecommendationRow;
      })
      .sort((a, b) => b.score - a.score) ?? [];

  return { favoriteCategory, recommendations };
}
