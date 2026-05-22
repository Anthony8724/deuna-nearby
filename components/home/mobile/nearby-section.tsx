"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useNearbyActions, useNearbyState } from "@/context/nearby-context";
import { nativeHover, nativeSpring, nativeTap } from "@/lib/home-motion";
import { NearbyCard } from "./nearby-card";

export function NearbySection() {
  const { carouselMoments } = useNearbyState();
  const { openSheet } = useNearbyActions();

  if (carouselMoments.length === 0) return null;

  const cards = carouselMoments.slice(0, 3);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={nativeSpring}
      className="mt-6 px-5"
      aria-labelledby="nearby-title"
    >
      <div className="cerca-ti-container p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2
            id="nearby-title"
            className="flex items-center gap-2 text-lg font-bold text-[#1E1E1E]"
          >
            Cerca de ti
            <span className="rounded-full bg-[#EDE6FA] px-2 py-0.5 text-xs font-semibold text-[#5D21D0]">
              Nuevo ✨
            </span>
          </h2>

          <motion.button
            type="button"
            whileHover={nativeHover}
            whileTap={nativeTap}
            onClick={() => carouselMoments[0] && openSheet(carouselMoments[0])}
            className="inline-flex items-center text-sm font-semibold text-[#5D21D0]"
          >
            Ver más
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </motion.button>
        </div>

        <ul className="list-none">
          {cards.map((moment, i) => (
            <NearbyCard key={moment.id} moment={moment} index={i} />
          ))}
        </ul>
      </div>
    </motion.section>
  );
}
