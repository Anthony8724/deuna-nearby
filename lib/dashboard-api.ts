import type {
  DashboardData,
  NearbySummary,
  PromotionItem,
  UserHistoryItem,
} from "@/types/dashboard";

const FALLBACK_SUMMARY: NearbySummary = {
  feature: "DeUna Nearby",
  usersActivated: 1,
  businessesRecommended: 4,
  mainCategory: "Hamburguesas",
  impact:
    "Incrementa la frecuencia de uso de DeUna y da visibilidad a comercios cercanos.",
};

const FALLBACK_HISTORY: UserHistoryItem[] = [
  { id: 1, category: "Hamburguesas", amount: 12, date: "2026-05-20" },
  { id: 2, category: "Café", amount: 5, date: "2026-05-19" },
  { id: 3, category: "Café", amount: 4.5, date: "2026-05-18" },
];

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${getBaseUrl()}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchNearbySummary(): Promise<{
  data: NearbySummary;
  live: boolean;
}> {
  const data = await fetchJson<NearbySummary>("/api/nearby-summary");
  if (data && typeof data.usersActivated === "number") {
    return { data, live: true };
  }
  return { data: FALLBACK_SUMMARY, live: false };
}

export async function fetchUserHistory(): Promise<{
  data: UserHistoryItem[];
  live: boolean;
}> {
  const data = await fetchJson<UserHistoryItem[] | { error: string }>(
    "/api/user-history",
  );
  if (Array.isArray(data) && data.length > 0) {
    return { data, live: true };
  }
  if (Array.isArray(data) && data.length === 0) {
    return { data: [], live: true };
  }
  return { data: FALLBACK_HISTORY, live: false };
}

export async function fetchPromotions(): Promise<{
  data: PromotionItem[];
  live: boolean;
}> {
  const data = await fetchJson<PromotionItem[]>("/api/promotions");
  if (Array.isArray(data)) {
    return { data, live: true };
  }
  return { data: [], live: false };
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const [summaryResult, historyResult, promotionsResult] = await Promise.all([
    fetchNearbySummary(),
    fetchUserHistory(),
    fetchPromotions(),
  ]);

  const live =
    summaryResult.live || historyResult.live || promotionsResult.live;

  return {
    summary: summaryResult.data,
    history: historyResult.data,
    promotions: promotionsResult.data,
    source: live ? "live" : "fallback",
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatHistoryDate(item: UserHistoryItem): string {
  const raw = item.created_at ?? item.date;
  if (!raw) return "Reciente";
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return parsed.toLocaleDateString("es-EC", {
    day: "numeric",
    month: "short",
  });
}

export function aggregateHistoryByCategory(
  history: UserHistoryItem[],
): { category: string; total: number; count: number }[] {
  const map = new Map<string, { total: number; count: number }>();

  history.forEach((item) => {
    const key = item.category || "Otros";
    const amount = item.amount ?? 0;
    const current = map.get(key) ?? { total: 0, count: 0 };
    map.set(key, {
      total: current.total + amount,
      count: current.count + 1,
    });
  });

  return Array.from(map.entries())
    .map(([category, stats]) => ({ category, ...stats }))
    .sort((a, b) => b.total - a.total);
}
