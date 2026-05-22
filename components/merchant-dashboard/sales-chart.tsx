"use client";

import { motion } from "framer-motion";
import type { SalesDataPoint } from "@/types/merchant-dashboard";
import { nativeSpring } from "@/lib/home-motion";

export function SalesChart({ data }: { data: SalesDataPoint[] }) {
  const max = Math.max(...data.map((d) => d.amount));
  const total = data.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="rounded-xl border border-black/[0.05] bg-white p-4 shadow-md">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#1E1E1E]">Ventas de la semana</h2>
          <p className="mt-0.5 text-xs text-[#6B7280]">Ingresos por día</p>
        </div>
        <p className="text-balance text-base font-bold text-[#5D21D0]">
          ${total.toLocaleString()}
        </p>
      </div>

      <div className="flex h-36 items-end justify-between gap-1.5">
        {data.map((point, i) => {
          const height = `${(point.amount / max) * 100}%`;
          const isToday = i === data.length - 1;

          return (
            <div
              key={point.day}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <motion.div
                initial={{ height: 0, opacity: 0.5 }}
                animate={{ height, opacity: 1 }}
                transition={{
                  delay: 0.1 + i * 0.05,
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`w-full max-w-9 rounded-t-lg ${
                  isToday ? "bg-[#5D21D0]" : "bg-[#E5E7EB]"
                }`}
              />
              <span
                className={`text-[9px] font-semibold ${
                  isToday ? "text-[#5D21D0]" : "text-[#9CA3AF]"
                }`}
              >
                {point.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
