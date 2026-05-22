"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Radar, Sparkles } from "lucide-react";

import { premium } from "@/app/_components/ui/premium";
import { SectionEyebrow } from "@/app/_components/ui/SectionEyebrow";

import { DemoBadge } from "./DemoBadge";
import { fadeUp, stagger } from "./motion";

type HeroSectionProps = {
  onCtaClick: () => void;
};

export function HeroSection({ onCtaClick }: HeroSectionProps) {
  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={stagger}
      className="mb-20 text-center lg:mb-24"
    >
      <motion.div
        variants={fadeUp}
        className="mb-6 flex flex-wrap justify-center gap-2"
      >
        <DemoBadge variant="ai">
          <Sparkles className="h-3 w-3" /> AI Powered
        </DemoBadge>
        <DemoBadge variant="default">
          <MapPin className="h-3 w-3" /> Nearby
        </DemoBadge>
        <DemoBadge variant="live">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Live
        </DemoBadge>
      </motion.div>

      <motion.div variants={fadeUp} className="mb-5 flex justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.04]">
          <Radar className="h-7 w-7 text-white/90" strokeWidth={1.5} />
        </div>
      </motion.div>

      <motion.h1
        variants={fadeUp}
        className="text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl"
      >
        Radar DeUna
      </motion.h1>

      <motion.p variants={fadeUp} className={`mx-auto mt-4 max-w-2xl ${premium.lead}`}>
        Notificaciones inteligentes impulsadas por IA contextual
      </motion.p>

      <motion.p
        variants={fadeUp}
        className={`mx-auto mt-3 max-w-xl ${premium.body} sm:text-[15px]`}
      >
        Descubre promociones relevantes según tu ubicación, hábitos de pago y
        momento del día — con scoring explicable en tiempo real.
      </motion.p>

      <motion.div variants={fadeUp} className="mt-8">
        <motion.button
          type="button"
          onClick={onCtaClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={premium.btnPrimary}
        >
          Probar simulador
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </motion.div>
    </motion.section>
  );
}
