"use client";

import { motion } from "framer-motion";
import { recentActivity } from "@/constants/recent-activity";
import { springSmooth } from "@/lib/motion-presets";

function formatAmount(amount: number) {
  const prefix = amount >= 0 ? "+" : "";
  return `${prefix}$${Math.abs(amount).toFixed(2)}`;
}

export function RecentActivity() {
  return (
    <section className="home-section mt-10 pb-4" aria-labelledby="recent-activity-title">
      <div className="mb-4 flex items-center justify-between">
        <h2 id="recent-activity-title" className="text-section-title">
          Actividad reciente
        </h2>
        <button type="button" className="text-xs font-semibold text-brand-primary">
          Ver todo
        </button>
      </div>

      <ul className="space-y-2">
        {recentActivity.map((item, i) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i, 5) * 0.04, ...springSmooth }}
          >
            <div className="flex items-center gap-3.5 rounded-[1.125rem] bg-white px-4 py-3.5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] ring-1 ring-black/[0.03] transition-shadow hover:shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-muted text-lg">
                {item.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {item.merchant}
                </p>
                <p className="truncate text-xs text-text-tertiary">{item.description}</p>
              </div>
              <div className="shrink-0 text-right">
                <p
                  className={`text-balance text-sm font-bold ${
                    item.type === "credit" ? "text-brand-emerald" : "text-foreground"
                  }`}
                >
                  {formatAmount(item.amount)}
                </p>
                <p className="text-[10px] font-medium text-text-tertiary">{item.time}</p>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
