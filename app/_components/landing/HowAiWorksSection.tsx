"use client";

import { motion } from "framer-motion";
import { Brain, MapPin, Sparkles } from "lucide-react";

import { premium } from "@/app/_components/ui/premium";
import { SectionEyebrow } from "@/app/_components/ui/SectionEyebrow";

import { AI_STEPS } from "./data";

const ICONS = {
  map: MapPin,
  brain: Brain,
  sparkles: Sparkles,
} as const;

export function HowAiWorksSection() {
  return (
    <section id="como-funciona" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <SectionEyebrow>Arquitectura</SectionEyebrow>
          <h2 className={`mt-5 ${premium.h2}`}>Cómo funciona la IA</h2>
          <p className={`mt-4 ${premium.lead}`}>
            Tres capas — datos, scoring y copy — en menos de 200 ms de punta a
            punta.
          </p>
        </motion.div>
        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {AI_STEPS.map((step, i) => {
            const Icon = ICONS[step.icon];
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`${premium.cardLg} p-8`}
              >
                <span className="font-mono text-sm font-medium text-white/25">
                  {step.step}
                </span>
                <div className="mt-6 flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-white/80">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em] text-white">
                  {step.title}
                </h3>
                <p className={`mt-3 ${premium.body}`}>{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
