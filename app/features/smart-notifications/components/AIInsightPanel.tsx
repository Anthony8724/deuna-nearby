"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Clock,
  MapPin,
  ShoppingBag,
  Sparkles,
  Store,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useMemo, type ReactNode } from "react";

import { buildAIInsightSnapshot, type AIInsightBadge } from "../lib/aiInsights";
import { formatDistancia, formatScorePct } from "../lib/format";
import type { Recomendacion } from "../types";
import type { UltimaNotificacion } from "../hooks/useSmartNotifications";

export type AIInsightPanelProps = {
  recomendaciones: Recomendacion[];
  ultimaNotificacion?: UltimaNotificacion | null;
  userId?: string;
  loading?: boolean;
  className?: string;
};

const BADGE_CONFIG: Record<
  AIInsightBadge,
  { label: string; className: string; icon: typeof Zap }
> = {
  high_intent: {
    label: "High Intent",
    className: "border-amber-400/35 bg-amber-500/15 text-amber-200",
    icon: Zap,
  },
  nearby: {
    label: "Nearby",
    className: "border-sky-400/35 bg-sky-500/15 text-sky-200",
    icon: MapPin,
  },
  frequent_user: {
    label: "Frequent User",
    className: "border-[#635bff]/30 bg-[#635bff]/10 text-[#c4c0ff]",
    icon: Users,
  },
};

function MetricBar({
  label,
  value,
  display,
  gradient,
  delay,
  icon: Icon,
}: {
  label: string;
  value: number;
  display: string;
  gradient: string;
  delay: number;
  icon: typeof Target;
}) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);

  return (
    <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-white/75">
          <Icon className="h-4 w-4 text-white/50" />
          {label}
        </div>
        <span className="font-mono text-sm font-semibold text-white">{display}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className={`h-full rounded-full ${gradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

function InsightCard({
  title,
  value,
  sub,
  icon: Icon,
  children,
}: {
  title: string;
  value: string;
  sub?: string;
  icon: typeof Store;
  children?: ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md"
    >
      <div className="mb-2 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-white/70">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-white/45">
            {title}
          </p>
          <p className="mt-0.5 truncate text-base font-semibold text-white">
            {value}
          </p>
          {sub ? (
            <p className="mt-0.5 text-xs text-white/40">{sub}</p>
          ) : null}
        </div>
      </div>
      {children}
    </motion.div>
  );
}

export function AIInsightPanel({
  recomendaciones,
  ultimaNotificacion = null,
  userId = "guest",
  loading = false,
  className = "",
}: AIInsightPanelProps) {
  const destacada =
    ultimaNotificacion?.recomendacion ?? recomendaciones[0] ?? null;

  const insights = useMemo(
    () => buildAIInsightSnapshot(recomendaciones, destacada, userId),
    [recomendaciones, destacada, userId],
  );

  if (!destacada) {
    return (
      <div
        className={`flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl ${className}`}
      >
        <Brain className="mb-4 h-12 w-12 text-white/30" />
        <p className="text-lg font-semibold text-white">Panel de decisión IA</p>
        <p className="mt-2 max-w-xs text-sm text-white/50">
          Ejecuta una búsqueda para visualizar intención de compra, categoría
          favorita y factores de la recomendación.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      className={`flex flex-col gap-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#a5a0ff]" />
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
              AI Decision Engine
            </span>
            {loading ? (
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            ) : null}
          </div>
          <h3 className="text-xl font-semibold text-white">
            {destacada.nombreComercial}
          </h3>
          <p className="mt-1 text-xs text-white/45">{destacada.razonDestacada}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {insights.badges.map((badge) => {
            const cfg = BADGE_CONFIG[badge];
            const BadgeIcon = cfg.icon;
            return (
              <span
                key={badge}
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${cfg.className}`}
              >
                <BadgeIcon className="h-3 w-3" />
                {cfg.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Métricas principales — barras */}
      <div className="grid gap-3 sm:grid-cols-2">
        <MetricBar
          label="Score de intención de compra"
          value={insights.intentScore}
          display={formatScorePct(insights.intentScore)}
          gradient="bg-amber-400/90"
          delay={0.05}
          icon={Zap}
        />
        <MetricBar
          label="Nivel de coincidencia IA"
          value={insights.coincidenciaIA}
          display={formatScorePct(insights.coincidenciaIA)}
          gradient="bg-[#635bff]"
          delay={0.12}
          icon={Target}
        />
        <MetricBar
          label="Predicción de compra"
          value={insights.prediccionCompra}
          display={formatScorePct(insights.prediccionCompra)}
          gradient="bg-emerald-400"
          delay={0.18}
          icon={TrendingUp}
        />
      </div>

      {/* Cards informativas */}
      <div className="grid gap-3 sm:grid-cols-2">
        <InsightCard
          title="Categoría favorita detectada"
          value={insights.categoriaFavorita}
          sub="Basada en historial DeUna"
          icon={ShoppingBag}
        />
        <InsightCard
          title="Hora de mayor actividad"
          value={insights.horaActividad}
          sub="Zona horaria Ecuador"
          icon={Clock}
        />
      </div>

      {/* Comercios cercanos */}
      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white/80">
          <Store className="h-4 w-4 text-sky-400" />
          Comercios cercanos relevantes
        </div>
        <ul className="space-y-2">
          {insights.comerciosCercanos.map((c, i) => (
            <motion.li
              key={`${c.nombre}-${i}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="flex items-center justify-between gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-sm"
            >
              <span className="truncate text-white/85">{c.nombre}</span>
              <span className="shrink-0 font-mono text-xs text-white/45">
                {formatDistancia(c.distanciaMetros)} · {c.score.toFixed(2)}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* ¿Por qué esta recomendación? */}
      <section className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
          <Brain className="h-4 w-4 text-white/50" />
          ¿Por qué esta recomendación?
        </h4>
        <ul className="space-y-2.5">
          {insights.whyBullets.map((bullet, index) => (
            <motion.li
              key={bullet.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + index * 0.07 }}
              className="flex items-start gap-3"
            >
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  bullet.active
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                    : "bg-white/20"
                }`}
              />
              <span
                className={
                  bullet.active
                    ? "text-sm text-white/85"
                    : "text-sm text-white/35 line-through decoration-white/20"
                }
              >
                {bullet.text}
              </span>
            </motion.li>
          ))}
        </ul>
      </section>
    </motion.div>
  );
}
