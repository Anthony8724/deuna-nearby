import { NextResponse } from "next/server";
import { supabase } from "../../../src/lib/supabase";

export async function GET() {
  const { data: businesses } = await supabase
    .from("businesses")
    .select("*");

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*");

  const categoryCount: Record<string, number> = {};

  transactions?.forEach((t) => {
    categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
  });

  const mainCategory =
    Object.keys(categoryCount).length > 0
      ? Object.keys(categoryCount).reduce((a, b) =>
          categoryCount[a] > categoryCount[b] ? a : b
        )
      : "Sin historial";

  return NextResponse.json({
    feature: "DeUna Nearby",
    usersActivated: 1,
    businessesRecommended: businesses?.length || 0,
    mainCategory,
    impact:
      "Incrementa la frecuencia de uso de DeUna y da visibilidad a comercios cercanos.",
  });
}