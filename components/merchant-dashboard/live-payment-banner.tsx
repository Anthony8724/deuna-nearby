"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { demoTimings } from "@/constants/demo";
import type { CompletedPayment } from "@/types/payment";
import { nativeSpring, nativeTap } from "@/lib/home-motion";

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export function LivePaymentBanner({
  payment,
  onDismiss,
}: {
  payment: CompletedPayment;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, demoTimings.merchantBannerMs);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={nativeSpring}
      className="border-b border-[#5D21D0]/20 bg-[#5D21D0]/10 px-5 py-3.5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5D21D0] opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#5D21D0]" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#5D21D0]">Nueva venta vía Nearby</p>
            <p className="truncate text-xs text-[#374151]">
              {payment.merchantName} · {formatMoney(payment.amount)} · QR DeUna
            </p>
          </div>
        </div>
        <motion.button
          type="button"
          whileTap={nativeTap}
          onClick={onDismiss}
          className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#374151] shadow-sm"
        >
          OK
        </motion.button>
      </div>
    </motion.div>
  );
}
