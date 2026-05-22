"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { premium } from "@/app/_components/ui/premium";
import { SectionEyebrow } from "@/app/_components/ui/SectionEyebrow";
import { useLandingImpactData } from "@/hooks/use-landing-impact-data";

import { LandingAutoSidebar } from "./LandingAutoSidebar";

function formatMoney(amount: number) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function DashboardPreviewSection() {
  const { summary, history, promotions, live } = useLandingImpactData();

  const kpis = [
    {
      v: String(summary.usersActivated),
      l: "Usuarios activados",
      d: live ? "Supabase live" : "Demo",
    },
    {
      v: String(summary.businessesRecommended),
      l: "Negocios recomendados",
      d: "Radio Nearby",
    },
    {
      v: summary.mainCategory,
      l: "Categoría dominante",
      d: "Historial IA",
    },
    {
      v: String(promotions.length),
      l: "Promociones activas",
      d: "Canal DeUna",
    },
  ];

  return (
    <section id="dashboard" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] shadow-stripe-lg"
        >
          <div className="grid lg:grid-cols-2">
            <div className="border-b border-white/[0.06] p-8 sm:p-12 lg:border-b-0 lg:border-r">
              <SectionEyebrow>Impacto DeUna Nearby</SectionEyebrow>
              <h2 className={`mt-5 ${premium.h2}`}>Dashboard conectado al backend</h2>
              <p className={`mt-4 ${premium.body}`}>
                {summary.impact}
              </p>
              {live ? (
                <p className="mt-2 text-xs font-semibold text-emerald-400/90">
                  Datos en vivo desde Supabase
                </p>
              ) : null}
              <div className="mt-8 grid grid-cols-2 gap-3">
                {kpis.map((k) => (
                  <div key={k.l} className={premium.metric}>
                    <p className="text-xl font-semibold tracking-tight text-white">
                      {k.v}
                    </p>
                    <p className="text-xs text-white/45">{k.l}</p>
                    <p className="mt-1 text-[10px] font-medium text-emerald-400/90">
                      {k.d}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45">
                  Historial de compras
                </p>
                <ul className="mt-3 space-y-2">
                  {history.slice(0, 4).map((item, index) => (
                    <li
                      key={item.id ?? `${item.category}-${index}`}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-white/80">{item.category}</span>
                      <span className="font-semibold text-[#a5a0ff]">
                        {item.amount != null ? formatMoney(item.amount) : "—"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/dashboard"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#a5a0ff] hover:text-white"
              >
                Abrir dashboard completo + pitch
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative min-h-[300px] bg-[#0a2540]/40 p-6 sm:p-8">
              <LandingAutoSidebar
                liveLabel={live ? "Live Supabase" : "Demo mode"}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
