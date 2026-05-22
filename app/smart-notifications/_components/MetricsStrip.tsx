"use client";

import { motion } from "framer-motion";
import { Gift, MapPin, Store, Target } from "lucide-react";

import { premium } from "@/app/_components/ui/premium";
import type { Recomendacion } from "@/app/features/smart-notifications/types";
import {
  formatDistancia,
  formatScorePct,
} from "@/app/features/smart-notifications/lib/format";

import { fadeUp, stagger } from "./motion";

function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  delay,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: typeof Store;
  delay: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay, duration: 0.4 }}
      className={`min-w-[160px] flex-1 ${premium.metric}`}
    >
      <Icon className="mb-3 h-5 w-5 text-white/50" strokeWidth={1.5} />
      <p className="text-2xl font-semibold tracking-[-0.02em] text-white">{value}</p>
      <p className="mt-1 text-xs text-white/50">{label}</p>
      {sub ? <p className="mt-0.5 text-[10px] text-white/35">{sub}</p> : null}
    </motion.div>
  );
}

export function MetricsStrip({
  recomendaciones,
}: {
  recomendaciones: Recomendacion[];
}) {
  const count = recomendaciones.length;
  const avgScore =
    count > 0
      ? recomendaciones.reduce((s, r) => s + r.score, 0) / count
      : 0;
  const promos = recomendaciones.filter((r) => r.tienePromocionActiva).length;
  const partners = recomendaciones.filter((r) => r.partnerDeuna).length;
  const avgDist =
    count > 0
      ? Math.round(
          recomendaciones.reduce((s, r) => s + r.distanciaMetros, 0) / count,
        )
      : 0;

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={stagger}
      className="mb-16 flex flex-wrap gap-3"
    >
      <MetricCard
        label="Comercios detectados"
        value={count > 0 ? String(count) : "—"}
        sub={count > 0 ? `${partners} partners DeUna` : "en radio 2 km"}
        icon={Store}
        delay={0}
      />
      <MetricCard
        label="Match IA promedio"
        value={count > 0 ? formatScorePct(avgScore) : "—"}
        sub="score ponderado"
        icon={Target}
        delay={0.05}
      />
      <MetricCard
        label="Promociones activas"
        value={count > 0 ? String(promos) : "—"}
        sub="vigentes hoy"
        icon={Gift}
        delay={0.1}
      />
      <MetricCard
        label="Distancia promedio"
        value={count > 0 ? formatDistancia(avgDist) : "—"}
        sub="desde tu ubicación"
        icon={MapPin}
        delay={0.15}
      />
    </motion.section>
  );
}
