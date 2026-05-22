"use client";

import { motion } from "framer-motion";
import { Clock, Download, QrCode } from "lucide-react";
import { useMerchantDashboard } from "@/context/merchant-dashboard-context";
import { nativeHover, nativeTap } from "@/lib/home-motion";

const actions = [
  { id: "qr", label: "Generar QR", description: "Cobro rápido", icon: QrCode, action: "generateQr" as const },
  { id: "report", label: "Descargar reporte", description: "CSV del periodo", icon: Download, action: "downloadReport" as const },
  { id: "hours", label: "Editar horario", description: "Apertura y cierre", icon: Clock, action: "openHoursEditor" as const },
];

export function QuickActions() {
  const { generateQr, downloadReport, openHoursEditor } = useMerchantDashboard();

  const handlers = {
    generateQr,
    downloadReport,
    openHoursEditor,
  };

  return (
    <div className="rounded-xl border border-black/[0.05] bg-white p-4 shadow-md">
      <h2 className="text-base font-bold text-[#1E1E1E]">Acciones rápidas</h2>
      <ul className="mt-3 space-y-1">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.li
              key={action.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.button
                type="button"
                whileHover={nativeHover}
                whileTap={nativeTap}
                onClick={handlers[action.action]}
                className="flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5D21D0]/10 text-[#5D21D0]">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-[#1E1E1E]">
                    {action.label}
                  </span>
                  <span className="block text-xs text-[#6B7280]">{action.description}</span>
                </span>
              </motion.button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
