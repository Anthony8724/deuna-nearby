"use client";

import { motion } from "framer-motion";
import {
  ArrowDown,
  Brain,
  MapPin,
  Sparkles,
  Store,
  TrendingUp,
  User,
} from "lucide-react";

const pitchBlocks = [
  {
    id: "problem",
    title: "Problema",
    body: "Los pequeños comercios tienen poca visibilidad y compiten contra grandes cadenas sin herramientas digitales accesibles.",
    tone: "bg-[#FEF2F2] text-[#991B1B] ring-[#FECACA]",
  },
  {
    id: "solution",
    title: "Solución",
    body: "DeUna Nearby combina IA, proximidad geográfica y promociones para conectar usuarios con comercios relevantes en el momento correcto.",
    tone: "bg-brand-primary-subtle text-brand-deep ring-brand-primary/15",
  },
  {
    id: "how",
    title: "Cómo funciona",
    body: "El historial del usuario alimenta la IA, que genera recomendaciones Nearby con beneficios concretos para impulsar la conversión.",
    tone: "bg-white text-[#1E1E1E] ring-black/[0.06]",
  },
  {
    id: "result",
    title: "Resultado",
    body: "El usuario descubre comercios, el comercio gana clientes y DeUna aumenta frecuencia, transacciones y retención.",
    tone: "bg-brand-primary text-white ring-brand-primary/30",
  },
];

const flowSteps = [
  { label: "Historial", icon: User },
  { label: "IA", icon: Brain },
  { label: "Nearby", icon: MapPin },
  { label: "Beneficio", icon: Sparkles },
];

const valueChain = [
  {
    title: "Usuario",
    points: ["Descubre comercios", "Recibe beneficios", "Usa más DeUna"],
    icon: User,
  },
  {
    title: "Nearby",
    points: ["Recomendación contextual", "Proximidad", "Promoción activa"],
    icon: MapPin,
  },
  {
    title: "Comercio",
    points: ["Más visibilidad", "Más tráfico", "Más clientes"],
    icon: Store,
  },
  {
    title: "Más ventas",
    points: ["Ticket promedio", "Recurrencia", "Lealtad DeUna"],
    icon: TrendingUp,
  },
];

export function PitchSection() {
  return (
    <section
      className="rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] sm:p-6"
      aria-labelledby="pitch-title"
    >
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-primary">
          Pitch final
        </p>
        <h2
          id="pitch-title"
          className="mt-2 text-xl font-bold text-[#1E1E1E] sm:text-2xl"
        >
          Valor del proyecto para el jurado
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {pitchBlocks.map((block, index) => (
          <motion.article
            key={block.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: index * 0.06 }}
            className={`rounded-2xl p-4 ring-1 sm:p-5 ${block.tone}`}
          >
            <h3 className="text-sm font-bold uppercase tracking-wide">
              {block.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed">{block.body}</p>
          </motion.article>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-[#F8F9FA] p-4 sm:p-5">
        <p className="text-center text-xs font-bold uppercase tracking-wider text-[#6B7280]">
          Flujo inteligente
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {flowSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex items-center gap-2 sm:gap-3">
                <div className="flex flex-col items-center gap-1">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-primary shadow-sm">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <span className="text-[11px] font-semibold text-[#374151]">
                    {step.label}
                  </span>
                </div>
                {index < flowSteps.length - 1 ? (
                  <ArrowDown className="hidden h-4 w-4 rotate-[-90deg] text-[#9CA3AF] sm:block" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {valueChain.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-brand-primary/10 bg-brand-primary-subtle p-4"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand-primary">
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <h3 className="font-bold text-[#1E1E1E]">{item.title}</h3>
              </div>
              <ul className="mt-3 space-y-1.5">
                {item.points.map((point) => (
                  <li
                    key={point}
                    className="text-sm text-[#6B7280] before:mr-2 before:text-brand-primary before:content-['•']"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
