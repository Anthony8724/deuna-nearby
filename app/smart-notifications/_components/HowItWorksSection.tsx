"use client";

import { motion } from "framer-motion";
import { Brain, MapPin, Zap } from "lucide-react";

import { premium } from "@/app/_components/ui/premium";

import { fadeUp, stagger } from "./motion";

function HowItWorksCard({
  title,
  description,
  icon: Icon,
  delay,
}: {
  title: string;
  description: string;
  icon: typeof MapPin;
  delay: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay, duration: 0.4 }}
      className={`${premium.cardLg} p-6`}
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-white/75">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <h3 className="text-lg font-semibold tracking-[-0.02em] text-white">{title}</h3>
      <p className={`mt-2 ${premium.body}`}>{description}</p>
    </motion.div>
  );
}

export function HowItWorksSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={stagger}
      className="mb-20"
    >
      <motion.h2
        variants={fadeUp}
        className={`mb-10 text-center ${premium.h2}`}
      >
        Cómo funciona
      </motion.h2>
      <div className="grid gap-5 md:grid-cols-3">
        <HowItWorksCard
          icon={MapPin}
          title="Geolocalización"
          description="PostGIS filtra comercios en un radio configurable. Solo candidatos reales entran al modelo."
          delay={0}
        />
        <HowItWorksCard
          icon={Brain}
          title="IA contextual"
          description="Scoring 45% proximidad, 35% frecuencia de pago, 20% promoción. GPT/Grok redacta el push final."
          delay={0.08}
        />
        <HowItWorksCard
          icon={Zap}
          title="Beneficios instantáneos"
          description="Cashback, descuentos y 2x1 con rate-limit inteligente para no saturar al usuario."
          delay={0.16}
        />
      </div>
    </motion.section>
  );
}
