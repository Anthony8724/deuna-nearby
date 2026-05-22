"use client";

import { motion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import type { UltimaNotificacion } from "../hooks/useSmartNotifications";
import { formatBeneficioFromRecomendacion } from "../lib/beneficios";
import { deuna } from "../styles/deuna-ui";
import type { NotificationContentSource } from "../types";

export type PushNotificationPreviewProps = {
  title: string;
  body: string;
  source: NotificationContentSource;
  negocio: string;
  descuento: string;
  /** Texto del CTA (por defecto "Ver promoción") */
  ctaLabel?: string;
  /** Muestra marco de dispositivo */
  showDeviceFrame?: boolean;
  className?: string;
};

function getCurrentTimeLabel(): string {
  return new Date().toLocaleTimeString("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/**
 * Vista previa de push notification estilo lock screen móvil.
 */
export function PushNotificationPreview({
  title,
  body,
  source,
  negocio,
  descuento,
  ctaLabel = "Ver promoción",
  showDeviceFrame = true,
  className = "",
}: PushNotificationPreviewProps) {
  const [hora, setHora] = useState(getCurrentTimeLabel);

  useEffect(() => {
    setHora(getCurrentTimeLabel());
    const id = setInterval(() => setHora(getCurrentTimeLabel()), 30_000);
    return () => clearInterval(id);
  }, []);

  const isAI = source === "ai";

  const card = (
    <motion.div
      initial={{ opacity: 0, y: -28, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 380,
        damping: 28,
        mass: 0.8,
      }}
      className="relative mx-auto w-full max-w-[340px]"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className={`overflow-hidden ${deuna.pushCard}`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3.5 py-2">
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 ${deuna.pushBrand} rounded-xl`}>
              <span className="text-sm font-bold leading-none text-white">d!</span>
            </div>
            <span className={`text-[13px] font-semibold ${deuna.pushText}`}>DeUna</span>
          </div>
          <span className={`text-[11px] font-medium ${deuna.pushTextMuted}`}>ahora</span>
        </div>

        <div className="space-y-3 p-4">
          {/* Badge IA */}
          <motion.span
            animate={
              isAI
                ? {
                    boxShadow: [
                      "0 0 0 0 rgba(139,92,246,0.4)",
                      "0 0 0 6px rgba(139,92,246,0)",
                    ],
                  }
                : {}
            }
            transition={
              isAI
                ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                : undefined
            }
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
              isAI
                ? "border-[#5D2A8E]/40 bg-[#5D2A8E]/25 text-white"
                : "border-white/15 bg-white/10 text-white/60"
            }`}
          >
            <motion.span
              animate={isAI ? { scale: [1, 1.08, 1] } : {}}
              transition={
                isAI
                  ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                  : undefined
              }
            >
              <Sparkles className="h-3 w-3" />
            </motion.span>
            {isAI ? "AI Generated" : "Smart Template"}
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.35 }}
          >
            <h4 className="text-base font-semibold leading-snug text-white">
              {title}
            </h4>
            <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-white/75">
              {body}
            </p>
          </motion.div>

          {/* Meta negocio + descuento */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
            className="flex flex-wrap items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2"
          >
            <span className="truncate text-xs font-medium text-white/90">
              {negocio}
            </span>
            <span className="text-white/30">·</span>
            <span className="text-xs font-bold text-emerald-300">{descuento}</span>
          </motion.div>

          {/* CTA visual */}
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            whileHover={{ x: 2 }}
            className={`flex cursor-default items-center justify-center gap-2 rounded-xl px-3 py-2.5 ${deuna.pushBrand}`}
          >
            <span className="text-sm font-semibold text-white">
              {ctaLabel}
            </span>
            <ChevronRight className="h-4 w-4 text-white/80" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );

  if (!showDeviceFrame) {
    return <div className={className}>{card}</div>;
  }

  return (
    <div
      className={`relative mx-auto w-full max-w-sm ${className}`}
      aria-label="Vista previa de notificación push"
    >
      {/* Marco dispositivo */}
      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-zinc-800/80 to-zinc-950/90 p-3 shadow-2xl backdrop-blur-sm">
        <div className="mb-3 flex items-center justify-center gap-2">
          <div className="h-1 w-12 rounded-full bg-white/20" />
        </div>
        <p className="mb-3 text-center font-mono text-2xl font-light tabular-nums text-white/90">
          {hora}
        </p>
        <p className="mb-4 text-center text-[10px] font-medium uppercase tracking-widest text-white/35">
          Notificación
        </p>
        {card}
        <div className="mt-6 flex justify-center pb-1">
          <div className="h-1 w-24 rounded-full bg-white/15" />
        </div>
      </div>
    </div>
  );
}

/** Mapea la última notificación del simulador a props de preview */
export function pushPreviewPropsFromUltimaNotificacion(
  notif: UltimaNotificacion,
  descuento?: string,
): PushNotificationPreviewProps {
  const descuentoTexto =
    descuento ?? formatBeneficioFromRecomendacion(notif.recomendacion).texto;

  return {
    title: notif.title,
    body: notif.body,
    source: notif.source,
    negocio: notif.recomendacion.nombreComercial,
    descuento: descuentoTexto,
    ctaLabel: notif.actionText || "Ver promoción",
  };
}
