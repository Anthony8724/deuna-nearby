"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Clock,
  MapPin,
  ShoppingBag,
  Sparkles,
  Tag,
} from "lucide-react";

import type { AIInsightSnapshot } from "../../lib/aiInsights";
import { formatScorePct } from "../../lib/format";

type ContextualAIStripProps = {
  snapshot: AIInsightSnapshot;
  ubicacionLabel: string;
  loading?: boolean;
};

const stagger = {
  show: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 },
};

export function ContextualAIStrip({
  snapshot,
  ubicacionLabel,
  loading,
}: ContextualAIStripProps) {
  const chips = [
    {
      icon: MapPin,
      label: "Estás en",
      value: ubicacionLabel,
      accent: "text-cyan-300",
    },
    {
      icon: Tag,
      label: "Te gusta",
      value: snapshot.categoriaFavorita,
      accent: "text-fuchsia-300",
    },
    {
      icon: Clock,
      label: "Mejor hora",
      value: snapshot.horaActividad.split("(")[0]?.trim() ?? snapshot.horaActividad,
      accent: "text-amber-300",
    },
    {
      icon: Sparkles,
      label: "Encaje",
      value: formatScorePct(snapshot.coincidenciaIA),
      accent: "text-violet-300",
    },
    {
      icon: ShoppingBag,
      label: "Ganas de ir",
      value: `${Math.round(snapshot.prediccionCompra * 100)}%`,
      accent: "text-emerald-300",
    },
  ];

  return (
    <section className="px-4 py-3">
      <div className="mb-2.5 flex items-center gap-2">
        <Brain className="h-4 w-4 text-violet-400" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">
          Por qué ahora
        </h3>
        {loading ? (
          <span className="ml-auto text-[10px] text-white/35">Un segundo…</span>
        ) : null}
      </div>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-2"
      >
        {chips.map((c) => (
          <motion.div
            key={c.label}
            variants={item}
            className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 backdrop-blur-md"
          >
            <div className="flex items-center gap-1.5">
              <c.icon className={`h-3.5 w-3.5 ${c.accent}`} />
              <span className="text-[10px] font-medium text-white/40">{c.label}</span>
            </div>
            <p className="mt-1 truncate text-[13px] font-semibold text-white">
              {c.value}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
