"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { dashboard } from "@/app/_components/ui/premium";

type MetricCardProps = {
  label: string;
  value: string;
  delta?: number;
  sub?: string;
  icon: LucideIcon;
  delay?: number;
};

export function MetricCard({
  label,
  value,
  delta,
  sub,
  icon: Icon,
  delay = 0,
}: MetricCardProps) {
  const positive = delta !== undefined && delta >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={`${dashboard.card} p-5 transition-shadow hover:shadow-stripe-lg`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </div>
        {delta !== undefined ? (
          <span
            className={`inline-flex items-center gap-0.5 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
              positive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {positive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {positive ? "+" : ""}
            {delta}%
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-zinc-900">
        {value}
      </p>
      <p className="mt-1 text-sm text-zinc-500">{label}</p>
      {sub ? <p className="mt-0.5 text-xs text-zinc-400">{sub}</p> : null}
    </motion.div>
  );
}
