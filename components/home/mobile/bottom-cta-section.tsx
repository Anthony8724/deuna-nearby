"use client";

import { motion } from "framer-motion";
import { ArrowLeftRight, QrCode } from "lucide-react";
import { useNearbyActions, useNearbyState } from "@/context/nearby-context";
import { nativeHover, nativeSpring, nativeTap } from "@/lib/home-motion";

export function BottomCTASection() {
  const { carouselMoments } = useNearbyState();
  const { openSheet } = useNearbyActions();
  const topMoment = carouselMoments[0];

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...nativeSpring, delay: 0.1 }}
      className="mt-2 px-5 pb-6"
      aria-label="Acciones principales"
    >
      <div className="flex gap-3">
        <motion.button
          type="button"
          whileHover={nativeHover}
          whileTap={nativeTap}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-[#5D21D0] bg-white p-4 text-sm font-semibold text-[#5D21D0]"
        >
          <ArrowLeftRight className="h-5 w-5" strokeWidth={1.75} />
          Transferir
        </motion.button>

        <motion.button
          type="button"
          whileHover={nativeHover}
          whileTap={nativeTap}
          disabled={!topMoment}
          onClick={() => topMoment && openSheet(topMoment)}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#5D21D0] p-4 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(93,33,208,0.28)] disabled:opacity-45"
        >
          <QrCode className="h-5 w-5" strokeWidth={1.75} />
          Pagar a QR
        </motion.button>
      </div>
    </motion.section>
  );
}
