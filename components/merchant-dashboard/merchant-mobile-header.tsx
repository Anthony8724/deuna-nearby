"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useMerchantDashboard } from "@/context/merchant-dashboard-context";
import type { DashboardPeriod } from "@/types/merchant-dashboard";
import { nativeHover, nativeTap } from "@/lib/home-motion";

const periodOptions: { value: DashboardPeriod; label: string }[] = [
  { value: "hoy", label: "Hoy" },
  { value: "semana", label: "Semana" },
  { value: "mes", label: "Mes" },
];

export function MerchantMobileHeader() {
  const { data, period, setPeriod, isOpen } = useMerchantDashboard();

  return (
    <header className="sticky top-0 z-10 border-b border-black/[0.05] bg-white/95 px-5 pb-4 pt-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#5D21D0]"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
          Billetera
        </Link>

        <div className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as DashboardPeriod)}
            aria-label="Periodo del reporte"
            className="appearance-none rounded-full bg-[#F3F4F6] py-1.5 pl-3 pr-8 text-xs font-semibold text-[#374151] outline-none"
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6B7280]" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          type="button"
          whileHover={nativeHover}
          whileTap={nativeTap}
          onClick={() => document.getElementById("qr")?.scrollIntoView({ behavior: "smooth" })}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5D21D0]/12 text-lg font-bold text-[#5D21D0]"
        >
          {data.merchantName.charAt(0)}
        </motion.button>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
            Panel del comercio
          </p>
          <h1 className="truncate text-lg font-bold text-[#1E1E1E]">{data.merchantName}</h1>
          <p className="text-xs text-[#6B7280]">{data.category}</p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
            isOpen
              ? "bg-[#5D21D0]/12 text-[#5D21D0]"
              : "bg-[#F3F4F6] text-[#6B7280]"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-[#5D21D0] animate-pulse" : "bg-[#9CA3AF]"}`}
          />
          {isOpen ? "Abierto" : "Cerrado"}
        </span>
      </div>
    </header>
  );
}
