"use client";

import { motion } from "framer-motion";
import type { MerchantKpi } from "@/types/merchant-dashboard";
import { AnimatedNumber, formatUsd } from "@/components/ui/motion-primitives";
import { nativeCardStagger, nativeHover, nativeTap } from "@/lib/home-motion";

const trendStyles = {
  up: "text-[#5D21D0] bg-[#5D21D0]/10",
  down: "text-red-500 bg-red-50",
  neutral: "text-[#6B7280] bg-[#F3F4F6]",
};

function parseKpiNumber(value: string): number | null {
  const cleaned = value.replace(/[^0-9.,-]/g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  return Number.isNaN(num) ? null : num;
}

export function StatCard({ kpi, index = 0 }: { kpi: MerchantKpi; index?: number }) {
  const numeric = parseKpiNumber(kpi.value);
  const isCurrency = kpi.value.includes("$");

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={nativeCardStagger(index)}
      whileHover={nativeHover}
      whileTap={nativeTap}
      className="rounded-xl border border-black/[0.05] bg-white p-4 shadow-md"
    >
      <p className="text-[11px] font-medium text-[#6B7280]">{kpi.label}</p>
      <p className="text-balance mt-1.5 text-xl font-bold tracking-tight text-[#1E1E1E]">
        {numeric !== null ? (
          <AnimatedNumber
            value={numeric}
            format={isCurrency ? formatUsd : (v) => String(Math.round(v))}
            animateFromZero={false}
          />
        ) : (
          kpi.value
        )}
      </p>
      <span
        className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${trendStyles[kpi.trend]}`}
      >
        {kpi.change}
      </span>
    </motion.article>
  );
}
