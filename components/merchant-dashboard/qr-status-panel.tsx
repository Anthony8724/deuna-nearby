"use client";

import { motion } from "framer-motion";
import { Copy, Power } from "lucide-react";
import { useMerchantDashboard } from "@/context/merchant-dashboard-context";
import { nativeHover, nativeTap } from "@/lib/home-motion";

export function QrStatusPanel({
  active,
  rating,
}: {
  active: boolean;
  rating: number;
}) {
  const { peakHours, toggleQrActive, generateQr, data, showMessage } = useMerchantDashboard();

  const copyPaymentLink = async () => {
    const url = `${window.location.origin}/?merchant=${data.merchantId}`;
    try {
      await navigator.clipboard.writeText(url);
      showMessage("Enlace de cobro copiado");
    } catch {
      showMessage("No se pudo copiar el enlace");
    }
  };

  return (
    <div className="rounded-xl border border-black/[0.05] bg-white p-4 shadow-md">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-bold text-[#1E1E1E]">Código QR</h2>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
              active
                ? "bg-[#5D21D0]/12 text-[#5D21D0]"
                : "bg-[#F3F4F6] text-[#6B7280]"
            }`}
          >
            {active ? "Activo" : "Inactivo"}
          </span>
          <motion.button
            type="button"
            whileTap={nativeTap}
            onClick={toggleQrActive}
            aria-label={active ? "Desactivar QR" : "Activar QR"}
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              active ? "bg-[#5D21D0]/12 text-[#5D21D0]" : "bg-[#F3F4F6] text-[#6B7280]"
            }`}
          >
            <Power className="h-4 w-4" strokeWidth={2} />
          </motion.button>
        </div>
      </div>

      <motion.button
        type="button"
        whileTap={nativeTap}
        onClick={generateQr}
        animate={active ? { scale: [1, 1.015, 1] } : {}}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
        className="relative mx-auto mt-5 flex aspect-square w-full max-w-[140px] items-center justify-center rounded-2xl bg-[#1E1E1E] shadow-lg"
      >
        <svg viewBox="0 0 80 80" className="h-20 w-20 text-white/90" aria-hidden>
          <rect x="8" y="8" width="24" height="24" rx="2" fill="currentColor" />
          <rect x="48" y="8" width="24" height="24" rx="2" fill="currentColor" />
          <rect x="8" y="48" width="24" height="24" rx="2" fill="currentColor" />
          <rect x="36" y="36" width="8" height="8" fill="currentColor" />
          <rect x="52" y="48" width="8" height="8" fill="currentColor" />
          <rect x="64" y="36" width="8" height="8" fill="currentColor" />
          <rect x="48" y="64" width="8" height="8" fill="currentColor" />
          <rect x="64" y="64" width="8" height="8" fill="currentColor" />
        </svg>
        {active && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5D21D0] opacity-60" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-[#5D21D0]" />
          </span>
        )}
      </motion.button>

      <p className="mt-4 text-center text-xs text-[#6B7280]">
        {active ? "Listo para recibir pagos DeUna" : "Activa el QR para cobrar"}
      </p>

      <motion.button
        type="button"
        whileHover={nativeHover}
        whileTap={nativeTap}
        onClick={copyPaymentLink}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F3F4F6] py-2.5 text-xs font-semibold text-[#374151]"
      >
        <Copy className="h-4 w-4" />
        Copiar enlace de cobro
      </motion.button>

      <div className="mt-4 flex items-center justify-between border-t border-black/[0.05] pt-4 text-sm">
        <span className="text-[#6B7280]">Valoración</span>
        <span className="font-bold text-[#5D21D0]">★ {rating.toFixed(1)}</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-[#6B7280]">Hora pico</span>
        <span className="font-semibold text-[#1E1E1E]">{peakHours}</span>
      </div>
    </div>
  );
}
