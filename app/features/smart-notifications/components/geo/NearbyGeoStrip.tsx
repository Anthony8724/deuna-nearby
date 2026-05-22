"use client";

import { LocateFixed, MapPin, Radar } from "lucide-react";

import type { NearbyBusiness } from "@/services/nearbyBusinessesService";

import { deuna } from "../../styles/deuna-ui";
import type { UserLocation } from "../../types";

type NearbyGeoStripProps = {
  effectiveLocation: UserLocation | null;
  source: "supabase" | "engine" | null;
  loading?: boolean;
  onRequestGps?: () => void;
  nearestBusiness?: NearbyBusiness | null;
};

function formatCoords(location: UserLocation | null): string {
  if (!location) return "Sin ubicación";
  return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
}

export function NearbyGeoStrip({
  effectiveLocation,
  source,
  loading = false,
  onRequestGps,
  nearestBusiness,
}: NearbyGeoStripProps) {
  return (
    <div className={`rounded-2xl border px-3.5 py-3 ${deuna.surfaceMuted}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Radar className={`h-4 w-4 shrink-0 ${deuna.brandText}`} />
            <p className={`text-[13px] font-semibold ${deuna.textPrimary}`}>
              Proximidad en tiempo real
            </p>
          </div>

          <p className={`mt-1.5 flex items-center gap-1.5 text-[12px] ${deuna.textSecondary}`}>
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{formatCoords(effectiveLocation)}</span>
          </p>

          {nearestBusiness ? (
            <p className={`mt-1 text-[12px] ${deuna.textSecondary}`}>
              Más cercano:{" "}
              <span className={`font-semibold ${deuna.textPrimary}`}>
                {nearestBusiness.name}
              </span>{" "}
              ·{" "}
              <span className={`font-semibold ${deuna.brandText}`}>
                {nearestBusiness.distanceKm.toFixed(2)} km
              </span>
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
              source === "supabase"
                ? "bg-emerald-500/10 text-emerald-700"
                : "bg-amber-500/10 text-amber-700"
            }`}
          >
            {loading ? "Sincronizando" : source ?? "offline"}
          </span>

          {onRequestGps ? (
            <button
              type="button"
              onClick={onRequestGps}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${deuna.brand} ${deuna.brandTextOn}`}
            >
              <LocateFixed className="h-3.5 w-3.5" />
              GPS
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
