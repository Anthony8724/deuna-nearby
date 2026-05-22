"use client";

import { motion } from "framer-motion";
import { Navigation2 } from "lucide-react";

import type { NearbyBusiness } from "@/services/nearbyBusinessesService";

import { deuna } from "../../styles/deuna-ui";

type NearbyBusinessesPanelProps = {
  businesses: NearbyBusiness[];
  loading?: boolean;
  className?: string;
  onBusinessPress?: (business: NearbyBusiness) => void;
};

function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m`;
  return `${distanceKm.toFixed(2)} km`;
}

export function NearbyBusinessesPanel({
  businesses,
  loading = false,
  className = "",
  onBusinessPress,
}: NearbyBusinessesPanelProps) {
  return (
    <section className={className}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className={deuna.sectionTitle}>Negocios cercanos</h3>
          <p className={`mt-0.5 text-[12px] ${deuna.textSecondary}`}>
            Distancias reales desde tu ubicación
          </p>
        </div>
        <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${deuna.brandSurface} ${deuna.brandText}`}>
          {loading ? "..." : businesses.length}
        </span>
      </div>

      {loading && businesses.length === 0 ? (
        <div className={`rounded-2xl border px-4 py-6 text-center text-sm ${deuna.surfaceMuted} ${deuna.textSecondary}`}>
          Buscando comercios cerca de ti...
        </div>
      ) : null}

      {!loading && businesses.length === 0 ? (
        <div className={`rounded-2xl border px-4 py-6 text-center text-sm ${deuna.surfaceMuted} ${deuna.textSecondary}`}>
          No hay negocios en este radio todavía.
        </div>
      ) : null}

      <div className="space-y-2.5">
        {businesses.map((business, index) => (
          <motion.button
            key={business.id}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.25 }}
            onClick={() => onBusinessPress?.(business)}
            className={`flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left ${deuna.surface} transition hover:border-[#5D2A8E]/20`}
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${deuna.brandSurface}`}>
              <Navigation2 className={`h-5 w-5 ${deuna.brandText}`} />
            </div>

            <div className="min-w-0 flex-1">
              <p className={`truncate text-[14px] font-semibold ${deuna.textPrimary}`}>
                {business.name}
              </p>
              <p className={`truncate text-[12px] ${deuna.textSecondary}`}>
                {business.category}
              </p>
              <p className={`mt-0.5 line-clamp-1 text-[11px] ${deuna.textMuted}`}>
                {business.description}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className={`text-[13px] font-bold ${deuna.brandText}`}>
                {formatDistance(business.distanceKm)}
              </p>
              <p className={`text-[10px] ${deuna.textMuted}`}>distancia</p>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
