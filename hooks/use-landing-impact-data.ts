"use client";

import { useEffect, useState } from "react";

import type { NearbySummary, PromotionItem, UserHistoryItem } from "@/types/dashboard";

type LandingImpactData = {
  summary: NearbySummary;
  history: UserHistoryItem[];
  promotions: PromotionItem[];
  live: boolean;
};

const FALLBACK: LandingImpactData = {
  summary: {
    feature: "DeUna Nearby",
    usersActivated: 1,
    businessesRecommended: 4,
    mainCategory: "Hamburguesas",
    impact:
      "Incrementa la frecuencia de uso de DeUna y da visibilidad a comercios cercanos.",
  },
  history: [
    { id: 1, category: "Hamburguesas", amount: 12, date: "2026-05-20" },
    { id: 2, category: "Café", amount: 5, date: "2026-05-19" },
  ],
  promotions: [],
  live: false,
};

export function useLandingImpactData(): LandingImpactData {
  const [data, setData] = useState<LandingImpactData>(FALLBACK);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [summaryRes, historyRes, promosRes] = await Promise.all([
          fetch("/api/nearby-summary", { cache: "no-store" }),
          fetch("/api/user-history", { cache: "no-store" }),
          fetch("/api/promotions", { cache: "no-store" }),
        ]);

        const summary = summaryRes.ok
          ? ((await summaryRes.json()) as NearbySummary)
          : FALLBACK.summary;
        const history = historyRes.ok
          ? ((await historyRes.json()) as UserHistoryItem[])
          : FALLBACK.history;
        const promotions = promosRes.ok
          ? ((await promosRes.json()) as PromotionItem[])
          : [];

        if (!cancelled) {
          setData({
            summary,
            history: Array.isArray(history) ? history : FALLBACK.history,
            promotions: Array.isArray(promotions) ? promotions : [],
            live: summaryRes.ok || historyRes.ok,
          });
        }
      } catch {
        if (!cancelled) setData(FALLBACK);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}
