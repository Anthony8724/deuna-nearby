import type { DashboardBadge } from "../data/merchantAnalytics";
import { Sparkles, TrendingUp, Zap } from "lucide-react";

const CONFIG: Record<
  DashboardBadge,
  { label: string; className: string; icon: typeof Zap }
> = {
  high_conversion: {
    label: "High Conversion",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: Zap,
  },
  trending: {
    label: "Trending",
    className: "border-amber-200 bg-amber-50 text-amber-800",
    icon: TrendingUp,
  },
  ai_optimized: {
    label: "AI Optimized",
    className: "border-indigo-200 bg-indigo-50 text-[#635bff]",
    icon: Sparkles,
  },
};

export function DashboardBadgePill({ badge }: { badge: DashboardBadge }) {
  const cfg = CONFIG[badge];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cfg.className}`}
    >
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}
