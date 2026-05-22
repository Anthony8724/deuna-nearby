"use client";

import { motion } from "framer-motion";
import type { UserHistoryItem } from "@/types/dashboard";
import {
  aggregateHistoryByCategory,
  formatCurrency,
  formatHistoryDate,
} from "@/lib/dashboard-api";

type HistoryChartProps = {
  history: UserHistoryItem[];
};

export function HistoryChart({ history }: HistoryChartProps) {
  const categories = aggregateHistoryByCategory(history);
  const maxTotal = Math.max(...categories.map((c) => c.total), 1);

  return (
    <section
      className="rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] sm:p-6"
      aria-labelledby="history-title"
    >
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="history-title"
            className="text-lg font-bold text-[#1E1E1E] sm:text-xl"
          >
            Historial de compras
          </h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            Base de datos que alimenta las recomendaciones Nearby
          </p>
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
          {history.length} transacciones
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="mb-6 space-y-4">
          {categories.map((item, index) => (
            <div key={item.category}>
              <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                <span className="font-semibold text-[#1E1E1E]">
                  {item.category}
                </span>
                <span className="font-bold text-brand-primary">
                  {formatCurrency(item.total)}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[#F3F4F6]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.total / maxTotal) * 100}%` }}
                  transition={{ duration: 0.7, delay: index * 0.08, ease: "easeOut" }}
                  className="h-full rounded-full bg-brand-primary"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-6 rounded-xl bg-[#F9FAFB] px-4 py-6 text-center text-sm text-[#6B7280]">
          Sin historial todavía. Las compras del usuario aparecerán aquí.
        </p>
      )}

      <ul className="divide-y divide-black/[0.06]">
        {history.slice(0, 8).map((item, index) => (
          <motion.li
            key={item.id ?? `${item.category}-${index}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="font-semibold text-[#1E1E1E]">{item.category}</p>
              <p className="text-xs text-[#9CA3AF]">
                {formatHistoryDate(item)}
              </p>
            </div>
            <p className="shrink-0 text-sm font-bold text-brand-primary">
              {item.amount != null ? formatCurrency(item.amount) : "—"}
            </p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
