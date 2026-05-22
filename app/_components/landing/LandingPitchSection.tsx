"use client";

import { motion } from "framer-motion";
import { ArrowRight, Brain, MapPin, Sparkles, Store, TrendingUp, User } from "lucide-react";
import Link from "next/link";

import { premium } from "@/app/_components/ui/premium";
import { LOCK_SCREEN_ROUTE } from "@/lib/demo-routes";
import { SectionEyebrow } from "@/app/_components/ui/SectionEyebrow";

const pitchBlocks = [
  {
    title: "Problema",
    body: "Pequeños comercios con poca visibilidad frente a grandes cadenas.",
  },
  {
    title: "Solución",
    body: "DeUna Nearby: IA + proximidad + promociones en el momento justo.",
  },
  {
    title: "Cómo funciona",
    body: "Historial → IA → recomendación Nearby → beneficio concreto.",
  },
  {
    title: "Resultado",
    body: "Más descubrimiento, más clientes para comercios y más uso de DeUna.",
  },
];

const flow = [
  { label: "Historial", icon: User },
  { label: "IA", icon: Brain },
  { label: "Nearby", icon: MapPin },
  { label: "Beneficio", icon: Sparkles },
];

const actors = [
  { title: "Usuario", icon: User, point: "Descubre y ahorra" },
  { title: "Comercio", icon: Store, point: "Gana visibilidad" },
  { title: "DeUna", icon: TrendingUp, point: "Más transacciones" },
];

export function LandingPitchSection() {
  return (
    <section id="impacto-pitch" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-12 text-center">
          <SectionEyebrow className="mx-auto">Pitch jurado</SectionEyebrow>
          <h2 className={`mx-auto mt-5 max-w-2xl ${premium.h2}`}>
            Valor del ecosistema en una sola demo
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pitchBlocks.map((block, index) => (
            <motion.article
              key={block.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className={premium.card + " p-5"}
            >
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#a5a0ff]">
                {block.title}
              </h3>
              <p className={`mt-3 ${premium.body} text-white/60`}>{block.body}</p>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mt-8 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 ${premium.card}`}
        >
          {flow.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-[#a5a0ff]">
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <span className="text-xs font-semibold text-white/70">{step.label}</span>
                {index < flow.length - 1 ? (
                  <span className="hidden text-white/25 sm:inline">→</span>
                ) : null}
              </div>
            );
          })}
        </motion.div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {actors.map((actor, index) => {
            const Icon = actor.icon;
            return (
              <motion.div
                key={actor.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={premium.metric + " text-center"}
              >
                <Icon className="mx-auto h-5 w-5 text-[#a5a0ff]" strokeWidth={1.75} />
                <p className="mt-2 text-sm font-semibold text-white">{actor.title}</p>
                <p className="mt-1 text-xs text-white/45">{actor.point}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={LOCK_SCREEN_ROUTE} className={premium.btnPrimary}>
            Iniciar demo completa
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/dashboard" className={premium.btnSecondary}>
            Dashboard impacto en vivo
          </Link>
        </div>
      </div>
    </section>
  );
}
