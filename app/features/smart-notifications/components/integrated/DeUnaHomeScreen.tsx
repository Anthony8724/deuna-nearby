"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  ChevronRight,
  Eye,
  EyeOff,
  Headphones,
  QrCode,
  Send,
} from "lucide-react";

import type { NearbyBusiness } from "@/services/nearbyBusinessesService";

import type { Recomendacion, UserLocation } from "../../types";
import type { CercaDeTiCardModel } from "../../lib/cercaDeTiCard";
import { deuna } from "../../styles/deuna-ui";
import { NearbyBusinessesPanel } from "../geo/NearbyBusinessesPanel";
import { NearbyGeoStrip } from "../geo/NearbyGeoStrip";
import { SmartRecommendationsSection } from "../SmartRecommendationsSection";

/** Acciones rápidas fijas del home (no modificar labels ni orden) */
const QUICK_ACTIONS_ROW_1 = [
  { id: "transferir", label: "Transferir", emoji: "💸" },
  { id: "recargar", label: "Recargar", emoji: "👛" },
  { id: "cobrar", label: "Cobrar", emoji: "🧮" },
  { id: "metro", label: "Metro de Quito", emoji: "🚇" },
] as const;

const QUICK_ACTIONS_ROW_2 = [
  { id: "invita", label: "Invita y Gana", emoji: "🎁" },
  { id: "jovenes", label: "Deuna Jóvenes", emoji: "👤" },
  { id: "verificar", label: "Verificar pago", emoji: "🛡️" },
] as const;

export type DeUnaHomeScreenProps = {
  userName: string;
  saldo?: string;
  smartRecommendations: Recomendacion[];
  smartLoading?: boolean;
  businesses?: NearbyBusiness[];
  source?: "supabase" | "engine" | null;
  effectiveLocation?: UserLocation | null;
  onCercaCardPress?: (card: CercaDeTiCardModel) => void;
  onBusinessPress?: (business: NearbyBusiness) => void;
  onRequestGps?: () => void;
  onTransferir?: () => void;
  onPagarQr?: () => void;
};

function QuickActionTile({
  label,
  emoji,
}: {
  label: string;
  emoji: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
      <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-[#F5F5F7] text-2xl">
        {emoji}
      </div>
      <span className={`text-center text-[10px] font-medium leading-tight ${deuna.textPrimary}`}>
        {label}
      </span>
    </div>
  );
}

/**
 * Pantalla principal DeUna — layout fiel a la app (saldo, acciones, Cerca de ti).
 */
export function DeUnaHomeScreen({
  userName,
  saldo = "$22,62",
  smartRecommendations,
  smartLoading = false,
  businesses = [],
  source = null,
  effectiveLocation = null,
  onCercaCardPress,
  onBusinessPress,
  onRequestGps,
  onTransferir,
  onPagarQr,
}: DeUnaHomeScreenProps) {
  const [saldoVisible, setSaldoVisible] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-0 flex-1 px-4 pb-28 pt-3 ${deuna.page}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className={`text-[18px] font-bold ${deuna.textPrimary}`}>
          Hola {userName} <span aria-hidden>👋</span>
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`flex h-10 w-10 items-center justify-center ${deuna.btnGhost}`}
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className={`flex h-10 w-10 items-center justify-center ${deuna.btnGhost}`}
            aria-label="Soporte"
          >
            <Headphones className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Saldo */}
      <div className={`mt-4 overflow-hidden rounded-[20px] ${deuna.surfaceElevated}`}>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className={`text-[12px] ${deuna.textSecondary}`}>Saldo disponible</p>
              <p className={`mt-0.5 text-[28px] font-bold tracking-tight ${deuna.textPrimary}`}>
                {saldoVisible ? saldo : "••••••"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSaldoVisible((v) => !v)}
                className={`flex h-9 w-9 items-center justify-center ${deuna.btnGhost}`}
                aria-label={saldoVisible ? "Ocultar saldo" : "Mostrar saldo"}
              >
                {saldoVisible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
              <ChevronRight className={`h-5 w-5 ${deuna.textMuted}`} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-[#F0F0F4] bg-[#F5F5F7] px-4 py-3">
          <p className={`min-w-0 flex-1 truncate text-[11px] ${deuna.textSecondary}`}>
            Recargar desde PRINCIPAL ******73...
          </p>
          <button
            type="button"
            className="shrink-0 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#171717] shadow-sm"
          >
            + $20
          </button>
          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white ${deuna.brand}`}>
            d!
          </div>
        </div>
      </div>

      {/* Grid acciones rápidas */}
      <div className="mt-5">
        <div className="flex justify-between gap-1">
          {QUICK_ACTIONS_ROW_1.map((a) => (
            <QuickActionTile key={a.id} label={a.label} emoji={a.emoji} />
          ))}
        </div>
        <div className="mt-4 flex justify-start gap-1">
          {QUICK_ACTIONS_ROW_2.map((a) => (
            <div key={a.id} className="w-1/4 min-w-0 max-w-[25%]">
              <QuickActionTile label={a.label} emoji={a.emoji} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <NearbyGeoStrip
          effectiveLocation={effectiveLocation}
          source={source}
          loading={smartLoading}
          nearestBusiness={businesses[0] ?? null}
          onRequestGps={onRequestGps}
        />
      </div>

      <SmartRecommendationsSection
        smartRecommendations={smartRecommendations}
        loading={smartLoading}
        onCardPress={onCercaCardPress}
      />

      <NearbyBusinessesPanel
        businesses={businesses}
        loading={smartLoading}
        className="mt-5"
        onBusinessPress={onBusinessPress}
      />

      {/* CTAs inferiores (fijos visualmente sobre tab bar vía padding del scroll) */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onTransferir}
          className={`flex items-center justify-center gap-2 py-3.5 text-[15px] ${deuna.btnSecondary}`}
        >
          <Send className="h-5 w-5" strokeWidth={2} />
          Transferir
        </button>
        <button
          type="button"
          onClick={onPagarQr}
          className={`flex items-center justify-center gap-2 py-3.5 text-[15px] ${deuna.btnPrimary}`}
        >
          <QrCode className="h-5 w-5" strokeWidth={2} />
          Pagar a QR
        </button>
      </div>
    </motion.div>
  );
}
