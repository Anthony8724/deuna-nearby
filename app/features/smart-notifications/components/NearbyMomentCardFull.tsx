"use client";

import { motion } from "framer-motion";
import {
  Clock,
  MapPin,
  Percent,
  Sparkles,
  Store,
  Zap,
} from "lucide-react";

import {
  formatBeneficioFromRecomendacion,
  formatTiempoRestantePromo,
} from "../lib/beneficios";
import { buildRazonIA } from "../lib/contextualCopy";
import { formatCategoria, formatDistancia } from "../lib/format";
import { deuna } from "../styles/deuna-ui";
import type { Recomendacion } from "../types";

export type NearbyMomentCardFullProps = {
  negocio: string;
  distancia: number;
  descuento: string;
  score: number;
  razonIA: string;
  categoria: string;
  tiempoRestante: string;
  onActivarBeneficio?: () => void;
  disabled?: boolean;
  className?: string;
};

function scoreTone(score: number): { bar: string; text: string } {
  if (score >= 0.75) {
    return { bar: "bg-emerald-500", text: "text-emerald-600" };
  }
  if (score >= 0.55) {
    return { bar: "bg-[#5D2A8E]", text: deuna.brandText };
  }
  return { bar: "bg-amber-400", text: "text-amber-700" };
}

/** Tarjeta premium expandida (simulador / landing). */
export function NearbyMomentCardFull({
  negocio,
  distancia,
  descuento,
  score,
  razonIA,
  categoria,
  tiempoRestante,
  onActivarBeneficio,
  disabled = false,
  className = "",
}: NearbyMomentCardFullProps) {
  const pct = Math.min(100, Math.max(0, Math.round(score * 100)));
  const tone = scoreTone(score);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={disabled ? undefined : { y: -2 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={[
        `group relative w-full overflow-hidden rounded-2xl p-5 sm:p-6 ${deuna.card}`,
        "transition-shadow duration-300 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.12)]",
        disabled ? "pointer-events-none opacity-60" : "",
        className,
      ].join(" ")}
    >
      <div className="relative flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 ${deuna.badgeBase} ${deuna.badgeBrand}`}
              >
                <Sparkles className="h-3 w-3" />
                {pct}% afinidad
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${deuna.badgeBrandSoft}`}
              >
                {categoria}
              </span>
            </div>
            <h3 className={`truncate text-lg font-bold tracking-tight sm:text-xl ${deuna.textPrimary}`}>
              {negocio}
            </h3>
            <p className={`mt-1 flex items-center gap-1.5 text-sm ${deuna.textSecondary}`}>
              <MapPin className={`h-3.5 w-3.5 shrink-0 ${deuna.brandText}`} />
              {formatDistancia(distancia)}
            </p>
          </div>

          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center ${deuna.merchantIcon}`}
          >
            <Store className={`h-5 w-5 ${deuna.textSecondary}`} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className={`font-medium ${deuna.textSecondary}`}>Score IA</span>
            <span className={`font-mono font-semibold ${tone.text}`}>{pct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#E8E0F5]">
            <motion.div
              className={`h-full rounded-full ${tone.bar}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        <div className={`flex flex-wrap items-center gap-3 rounded-xl px-4 py-3 ${deuna.surfaceMuted}`}>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${deuna.brandSurface} ${deuna.brandText}`}
          >
            <Percent className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className={deuna.textLabel}>Beneficio disponible</p>
            <p className={`text-base font-bold sm:text-lg ${deuna.benefitText}`}>
              {descuento}
            </p>
          </div>
          <div className={`flex items-center gap-1 text-xs ${deuna.textMuted}`}>
            <Clock className="h-3.5 w-3.5" />
            {tiempoRestante}
          </div>
        </div>

        <p className={`text-sm leading-relaxed ${deuna.textSecondary}`}>
          <span className={`font-medium ${deuna.textPrimary}`}>
            Te recomendamos este lugar porque{" "}
          </span>
          {razonIA.replace(/^Te recomendamos este lugar porque\s*/i, "")}
        </p>

        <motion.button
          type="button"
          disabled={disabled}
          onClick={onActivarBeneficio}
          whileHover={disabled ? undefined : { scale: 1.01 }}
          whileTap={disabled ? undefined : { scale: 0.98 }}
          className={`inline-flex w-full items-center justify-center gap-2 py-3.5 text-sm disabled:opacity-50 ${deuna.btnPrimary}`}
        >
          <Zap className="h-4 w-4" />
          Activar beneficio
        </motion.button>
      </div>
    </motion.article>
  );
}

export function nearbyMomentCardPropsFromRecomendacion(
  rec: Recomendacion,
  options?: {
    razonIA?: string;
    descuento?: string;
    tiempoRestante?: string;
  },
): NearbyMomentCardFullProps {
  const beneficio = formatBeneficioFromRecomendacion(rec);

  return {
    negocio: rec.nombreComercial,
    distancia: rec.distanciaMetros,
    descuento: options?.descuento ?? beneficio.texto,
    score: rec.score,
    razonIA: options?.razonIA ?? buildRazonIA(rec),
    categoria: formatCategoria(rec.categoria),
    tiempoRestante:
      options?.tiempoRestante ?? formatTiempoRestantePromo(rec.promocion),
  };
}
