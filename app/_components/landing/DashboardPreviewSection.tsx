"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { premium } from "@/app/_components/ui/premium";
import { SectionEyebrow } from "@/app/_components/ui/SectionEyebrow";
import { FLAGSHIP_MERCHANT_KPIS } from "@/app/data/platformSnapshot";

import { getDashboardPreviewKpis } from "./kpiPreview";

export function DashboardPreviewSection() {
  const previewKpis = getDashboardPreviewKpis();
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
              <SectionEyebrow>Merchant Analytics</SectionEyebrow>
              <h2 className={`mt-5 ${premium.h2}`}>Dashboard analytics</h2>
              <p className={`mt-4 ${premium.body}`}>
                KPIs, zonas calientes, horarios pico, promociones y score de
                efectividad IA — todo en un solo panel.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {previewKpis.map((k) => (
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
              <Link
                href="/dashboard"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#a5a0ff] hover:text-white"
              >
                Abrir dashboard demo
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative min-h-[300px] bg-[#0a2540]/40 p-6 sm:p-8">
              <div className="relative space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3">
                  <span className="text-sm text-white/60">Conversiones</span>
                  <span className="text-sm font-semibold text-emerald-400">
                    +{FLAGSHIP_MERCHANT_KPIS.conversionesDelta}%
                  </span>
                </div>
                <div className="h-28 rounded-xl border border-white/[0.06] bg-white/[0.03]">
                  <div className="flex h-full items-end justify-around gap-1 px-4 pb-2">
                    {[40, 55, 70, 60, 85, 65, 78].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.04 }}
                        className="w-5 max-w-8 rounded-t bg-[#635bff]/70"
                      />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["Naciones", "Amazonas", "Mariscal"].map((z, i) => (
                    <div
                      key={z}
                      className="rounded-lg border border-white/[0.06] p-2 text-center text-[10px] text-white/70"
                      style={{
                        background: `rgba(99, 91, 255, ${0.08 + i * 0.06})`,
                      }}
                    >
                      {z}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
