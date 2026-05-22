"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Clock,
  Flame,
  MapPin,
  Sparkles,
  Tag,
  X,
  Zap,
} from "lucide-react";

import {
  buildAIInsightSnapshot,
  type AIInsightSnapshot,
  type WhyBullet,
} from "../lib/aiInsights";
import {
  formatBeneficioFromRecomendacion,
  formatTiempoRestantePromo,
} from "../lib/beneficios";
import {
  WHY_BULLET_LABELS,
  cashbackExtraLine,
  contextualReasonShort,
} from "../lib/nearbyCopy";
import { formatDistancia, formatScorePct } from "../lib/format";
import { deuna } from "../styles/deuna-ui";
import type { Recomendacion, UserLocation } from "../types";
import { ComoLlegarButton } from "./ComoLlegarButton";
import { categoryEmoji } from "./integrated/categoryEmoji";

export type SmartBenefitBottomSheetProps = {
  open: boolean;
  comercio: string;
  distancia: number;
  direccion?: string;
  score: number;
  descuentoActivo: string;
  cashbackAdicional: string;
  tiempoRestante: string;
  categoriaEmoji?: string;
  /** Bullets de explicabilidad */
  whyBullets: WhyBullet[];
  /** Barras de desglose 0–1 (proximidad, frecuencia, promoción) */
  scoreBreakdown?: {
    proximidad: number;
    frecuencia: number;
    promocion: number;
  };
  showTrending?: boolean;
  /** Frase humana sobre por qué aparece el beneficio */
  reasonLead?: string;
  latitude: number;
  longitude: number;
  /** Ubicación del usuario (GPS o simulada) para origin en Maps */
  userOrigin?: UserLocation | null;
  onClose: () => void;
  onUsarBeneficio?: () => void;
  /** Override del flujo de navegación integrado */
  onComoLlegar?: () => void;
  className?: string;
};

const SHEET_SPRING = { type: "spring" as const, stiffness: 420, damping: 36 };

function ScoreBar({
  label,
  value,
  delay,
  gradient,
}: {
  label: string;
  value: number;
  delay: number;
  gradient: string;
}) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div>
      <div className="mb-1 flex justify-between text-[10px]">
        <span className={deuna.textMuted}>{label}</span>
        <span className={`font-mono font-medium ${deuna.textSecondary}`}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#E8E0F5]">
        <motion.div
          className={`h-full rounded-full ${gradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay, duration: 0.55, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function SheetBadge({
  children,
  variant,
}: {
  children: ReactNode;
  variant: "ai" | "nearby" | "trending";
}) {
  const styles = {
    ai: `${deuna.badgeBase} ${deuna.badgeBrand}`,
    nearby: `${deuna.badgeBase} ${deuna.badgeBrandSoft}`,
    trending: deuna.badgeNuevo,
  };
  return <span className={styles[variant]}>{children}</span>;
}

/**
 * Bottom sheet contextual premium — estilo DeUna (tema claro in-app).
 */
export function SmartBenefitBottomSheet({
  open,
  comercio,
  distancia,
  direccion,
  score,
  descuentoActivo,
  cashbackAdicional,
  tiempoRestante,
  categoriaEmoji: emoji = "🏪",
  whyBullets,
  scoreBreakdown,
  showTrending = false,
  reasonLead,
  latitude,
  longitude,
  userOrigin = null,
  onClose,
  onUsarBeneficio,
  onComoLlegar,
  className = "",
}: SmartBenefitBottomSheetProps) {
  const scorePct = Math.round(score * 100);
  const lead = reasonLead ?? "Encaja con dónde estás y cómo sueles gastar";

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Cerrar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-[70] bg-black/25 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal
            aria-labelledby="smart-benefit-title"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={SHEET_SPRING}
            className={`absolute inset-x-0 bottom-0 z-[75] flex max-h-[min(92%,560px)] flex-col overflow-hidden rounded-t-[24px] border-t border-[#EBEBEF] bg-white shadow-[0_-16px_48px_-8px_rgba(0,0,0,0.12)] ${className}`}
          >
            <div className="relative flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-3">
                <div className="mx-auto mb-3 h-1 w-11 shrink-0 rounded-full bg-[#D4D4DC]" />

                <button
                  type="button"
                  onClick={onClose}
                  className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center ${deuna.btnGhost}`}
                  aria-label="Cerrar"
                >
                  <X className={`h-4 w-4 ${deuna.textSecondary}`} />
                </button>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="flex flex-wrap gap-1.5 pr-10"
                >
                  <SheetBadge variant="ai">
                    <Sparkles className="h-2.5 w-2.5" />
                    Hecho para ti
                  </SheetBadge>
                  {distancia <= 500 ? (
                    <SheetBadge variant="nearby">
                      <MapPin className="h-2.5 w-2.5" />
                      Cerca
                    </SheetBadge>
                  ) : null}
                  {showTrending ? (
                    <SheetBadge variant="trending">
                      <Flame className="h-2.5 w-2.5" />
                      Popular
                    </SheetBadge>
                  ) : null}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                  className="mt-4 flex items-start gap-3"
                >
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center text-2xl ${deuna.merchantIcon}`}
                  >
                    {emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2
                      id="smart-benefit-title"
                      className={`text-xl font-bold tracking-tight ${deuna.textPrimary}`}
                    >
                      {comercio}
                    </h2>
                    <p
                      className={`mt-1 flex items-center gap-1 text-sm ${deuna.textSecondary}`}
                    >
                      <MapPin className={`h-3.5 w-3.5 shrink-0 ${deuna.brandText}`} />
                      A {formatDistancia(distancia)} de ti
                      {direccion ? ` · ${direccion}` : null}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                  className={`mt-5 rounded-2xl p-4 ${deuna.brandSurface} border ${deuna.brandBorder}`}
                >
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <p className={deuna.textLabel}>Qué tan bien encaja</p>
                      <p className={`mt-0.5 font-mono text-2xl font-bold ${deuna.brandText}`}>
                        {formatScorePct(score)}
                      </p>
                    </div>
                    <div className={`text-right text-[10px] ${deuna.textMuted}`}>
                      Calculado al instante
                      <br />
                      <span className={`font-semibold ${deuna.brandText}`}>
                        con tu ubicación
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#E8E0F5]">
                    <motion.div
                      className="h-full rounded-full bg-[#5D2A8E]"
                      initial={{ width: 0 }}
                      animate={{ width: `${scorePct}%` }}
                      transition={{ delay: 0.15, duration: 0.65, ease: "easeOut" }}
                    />
                  </div>
                  {scoreBreakdown ? (
                    <div className="mt-4 space-y-2.5 border-t border-[#E0D4F0] pt-3">
                      <ScoreBar
                        label="Cercanía"
                        value={scoreBreakdown.proximidad}
                        delay={0.2}
                        gradient="bg-[#5D2A8E]"
                      />
                      <ScoreBar
                        label="Tus visitas"
                        value={scoreBreakdown.frecuencia}
                        delay={0.26}
                        gradient="bg-[#7C3AED]"
                      />
                      <ScoreBar
                        label="La promo"
                        value={scoreBreakdown.promocion}
                        delay={0.32}
                        gradient="bg-emerald-500"
                      />
                    </div>
                  ) : null}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 }}
                  className="mt-3 grid grid-cols-2 gap-2"
                >
                  <div className={`rounded-2xl p-3 ${deuna.promoSurface}`}>
                    <div
                      className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider ${deuna.promoText}`}
                    >
                      <Tag className="h-3 w-3" />
                      Tu beneficio
                    </div>
                    <p className={`mt-1.5 text-sm font-bold leading-snug ${deuna.textPrimary}`}>
                      {descuentoActivo}
                    </p>
                  </div>
                  <div
                    className={`rounded-2xl p-3 ${deuna.brandSurface} border ${deuna.brandBorder}`}
                  >
                    <p className={`${deuna.textLabel} ${deuna.brandText}`}>Extra DeUna</p>
                    <p className={`mt-1.5 text-sm font-semibold ${deuna.textPrimary}`}>
                      {cashbackAdicional}
                    </p>
                  </div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`mt-3 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs ${deuna.promoSurface} ${deuna.promoText}`}
                >
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  {tiempoRestante}
                </motion.p>

                <motion.section
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24 }}
                  className={`mt-5 rounded-2xl p-4 ${deuna.surface}`}
                >
                  <h3 className={`text-sm font-semibold ${deuna.textPrimary}`}>
                    ¿Por qué te llegó esto?
                  </h3>
                  <p className={`mt-1.5 text-[13px] leading-relaxed ${deuna.textSecondary}`}>
                    {lead}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {whyBullets.map((b, i) => {
                      const text =
                        WHY_BULLET_LABELS[b.id as keyof typeof WHY_BULLET_LABELS] ??
                        b.text;
                      return (
                        <motion.li
                          key={b.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.28 + i * 0.05 }}
                          className={`flex items-start gap-2.5 text-[13px] ${
                            b.active ? deuna.textPrimary : deuna.textMuted
                          }`}
                        >
                          <span
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                              b.active
                                ? "border-[#5D2A8E]/30 bg-[#F3EBFA] text-[#5D2A8E]"
                                : "border-[#EBEBEF] bg-[#F5F5F7] text-[#9B9BA8]"
                            }`}
                          >
                            <Check className="h-3 w-3" strokeWidth={2.5} />
                          </span>
                          {text}
                        </motion.li>
                      );
                    })}
                  </ul>
                </motion.section>
              </div>

              <div
                className={`relative shrink-0 border-t border-[#EBEBEF] bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]`}
              >
                <ComoLlegarButton
                  latitude={latitude}
                  longitude={longitude}
                  comercio={comercio}
                  userOrigin={userOrigin}
                  size="lg"
                  pulse
                  onCustomNavigate={onComoLlegar}
                />
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={onUsarBeneficio}
                  className={`relative mt-2.5 flex w-full items-center justify-center gap-2 overflow-hidden py-3.5 text-sm ${deuna.btnPrimary}`}
                >
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "linear",
                      repeatDelay: 0.8,
                    }}
                  />
                  <Zap className="relative h-4 w-4" />
                  <span className="relative">Pagar con DeUna y ahorrar</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export function smartBenefitSheetPropsFromRecomendacion(
  rec: Recomendacion,
  options?: {
    userId?: string;
    insight?: AIInsightSnapshot;
    recomendaciones?: Recomendacion[];
  },
): Omit<
  SmartBenefitBottomSheetProps,
  "open" | "onClose" | "onUsarBeneficio" | "onComoLlegar" | "className"
> {
  const beneficio = formatBeneficioFromRecomendacion(rec);
  const insight =
    options?.insight ??
    buildAIInsightSnapshot(
      options?.recomendaciones ?? [rec],
      rec,
      options?.userId ?? "guest",
    );

  const userId = options?.userId ?? "guest";

  return {
    comercio: rec.nombreComercial,
    latitude: rec.latitude,
    longitude: rec.longitude,
    distancia: rec.distanciaMetros,
    direccion: rec.direccionCorta,
    score: rec.score,
    descuentoActivo: beneficio.texto,
    cashbackAdicional: cashbackExtraLine(rec),
    reasonLead: contextualReasonShort(rec, userId),
    tiempoRestante: formatTiempoRestantePromo(rec.promocion),
    categoriaEmoji: categoryEmoji(rec.categoria),
    whyBullets: insight.whyBullets,
    scoreBreakdown: rec.desgloseScore,
    showTrending:
      rec.score >= 0.78 ||
      rec.transaccionesUltimos30Dias >= 6 ||
      rec.desgloseScore.promocion >= 0.9,
  };
}
