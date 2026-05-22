"use client";

import { motion } from "framer-motion";

import type { HeatZone } from "../data/merchantAnalytics";

export function HeatZoneMap({ zones }: { zones: HeatZone[] }) {
  const maxCol = Math.max(...zones.map((z) => z.x));
  const maxRow = Math.max(...zones.map((z) => z.y));

  return (
    <div className="space-y-4">
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${maxCol}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: maxRow * maxCol }, (_, i) => {
          const col = (i % maxCol) + 1;
          const row = Math.floor(i / maxCol) + 1;
          const zone = zones.find((z) => z.x === col && z.y === row);

          if (!zone) {
            return (
              <div
                key={`empty-${col}-${row}`}
                className="aspect-[4/3] rounded-xl bg-zinc-50"
              />
            );
          }

          const opacity = 0.25 + zone.intensidad * 0.75;

          return (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: zone.intensidad * 0.15 }}
              whileHover={{ scale: 1.03 }}
              className="relative aspect-[4/3] overflow-hidden rounded-xl border border-zinc-200/80 p-2"
              style={{
                background: `linear-gradient(135deg, rgba(99,102,241,${opacity * 0.5}) 0%, rgba(16,185,129,${opacity * 0.35}) 100%)`,
              }}
            >
              <p className="text-[10px] font-semibold leading-tight text-zinc-900">
                {zone.zona}
              </p>
              <p className="mt-1 text-[9px] text-zinc-700/80">
                {zone.usuarios.toLocaleString("es-EC")} usuarios
              </p>
              <span className="absolute bottom-1.5 right-1.5 rounded bg-white/80 px-1 py-0.5 text-[9px] font-bold text-[#635bff]">
                {Math.round(zone.intensidad * 100)}%
              </span>
            </motion.div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Baja densidad</span>
        <div className="h-2 flex-1 max-w-[120px] rounded-full bg-gradient-to-r from-zinc-200 via-[#635bff]/40 to-emerald-400" />
        <span>Alta densidad</span>
      </div>
    </div>
  );
}
