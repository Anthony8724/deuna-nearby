"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { SectionEyebrow } from "@/app/_components/ui/SectionEyebrow";
import { premium } from "@/app/_components/ui/premium";
import {
  PLATFORM,
  FLAGSHIP_MERCHANT_KPIS,
  FLAGSHIP_PUSH_PREVIEW,
} from "@/app/data/platformSnapshot";

import { LANDING_METRICS } from "./data";
import { InvestorHighlightsStrip } from "./InvestorHighlightsStrip";
import { PhoneMockup } from "./PhoneMockup";

const stagger = {
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-28 pb-24 sm:pt-36">
      <div className="mx-auto grid max-w-7xl items-center gap-20 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="text-center lg:text-left"
        >
          <motion.div variants={fadeUp}>
            <SectionEyebrow>Smart Commerce Discovery</SectionEyebrow>
          </motion.div>
          <motion.h1 variants={fadeUp} className={`mt-8 ${premium.h1} text-balance`}>
            DeUna{" "}
            <span className="text-white/90">Nearby</span>
          </motion.h1>
          <motion.p variants={fadeUp} className={`mt-6 max-w-xl ${premium.lead} lg:mx-0`}>
            {PLATFORM.tagline}
          </motion.p>
          <motion.p variants={fadeUp} className={`mt-4 max-w-lg ${premium.body} lg:mx-0`}>
            IA contextual sobre {PLATFORM.comerciosAfiliados} comercios afiliados
            en {PLATFORM.mercado}: scoring, push inteligente y analytics para
            merchants en un solo stack.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
          >
            <Link href="/smart-notifications" className={premium.btnPrimary}>
              Abrir DeUna · Cerca
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/dashboard" className={premium.btnSecondary}>
              Dashboard comercios
            </Link>
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
          >
            {LANDING_METRICS.map((m) => (
              <div key={m.label} className={premium.metric}>
                <p className="text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">
                  {m.value}
                </p>
                <p className="mt-1.5 text-xs font-medium text-white/65">{m.label}</p>
                <p className="text-[11px] text-white/35">{m.sub}</p>
                {m.delta ? (
                  <p className="mt-2 text-[11px] font-medium text-emerald-400/90">
                    {m.delta}
                  </p>
                ) : null}
              </div>
            ))}
          </motion.div>
          <InvestorHighlightsStrip />
        </motion.div>
        <div className="relative flex justify-center lg:justify-end">
          <PhoneMockup delay={0.15} {...FLAGSHIP_PUSH_PREVIEW} />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="absolute -left-2 top-[28%] hidden rounded-xl border border-white/[0.1] bg-black/80 px-4 py-3 shadow-stripe-lg backdrop-blur-xl lg:block"
          >
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/45">
              Ventas atribuidas
            </p>
            <p className="text-lg font-semibold tracking-tight text-white">
              +{FLAGSHIP_MERCHANT_KPIS.ventasDelta}% esta semana
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
