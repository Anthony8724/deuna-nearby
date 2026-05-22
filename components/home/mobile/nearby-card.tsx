"use client";

import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useNearbyActions } from "@/context/nearby-context";
import type { NearbyMoment } from "@/types/nearby-moment";
import { nativeCardStagger, nativeHover, nativeTap } from "@/lib/home-motion";

type NearbyCardProps = {
  moment: NearbyMoment;
  index: number;
};

function formatLine(moment: NearbyMoment) {
  const distance = moment.distance ?? "250 m";
  const benefit = moment.benefit ?? "15% beneficio DeUna";
  return `${distance} • ${benefit}`;
}

function NearbyCardInner({ moment, index }: NearbyCardProps) {
  const { openSheet } = useNearbyActions();
  const handleOpen = useCallback(() => openSheet(moment), [openSheet, moment]);

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={nativeCardStagger(index)}
    >
      <motion.button
        type="button"
        onClick={handleOpen}
        whileHover={nativeHover}
        whileTap={nativeTap}
        className="mb-3 flex w-full items-center gap-3 rounded-xl bg-white p-4 text-left shadow-md"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3F4F6] text-xl">
          {moment.emoji}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[15px] font-bold text-[#1E1E1E]">
              {moment.merchantName}
            </h3>
            {moment.affinityScore != null && (
              <span className="shrink-0 text-xs font-bold text-[#5D21D0]">
                {moment.affinityScore}%
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs font-medium text-[#5D21D0]">
            {formatLine(moment)}
          </p>
        </div>

        <ChevronRight className="h-4 w-4 shrink-0 text-[#9CA3AF]" strokeWidth={2} />
      </motion.button>
    </motion.li>
  );
}

export const NearbyCard = memo(
  NearbyCardInner,
  (prev, next) =>
    prev.moment.id === next.moment.id && prev.index === next.index,
);
