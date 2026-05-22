"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Eye, EyeOff } from "lucide-react";
import { useDeunaSession } from "@/context/deuna-session-context";
import { nativeHover, nativeSpring, nativeTap } from "@/lib/home-motion";
import { AnimatedBalance } from "../animated-balance";
import { useWalletDemo } from "./wallet-demo-provider";

export function BalanceCard() {
  const { balance } = useDeunaSession();
  const { recharge } = useWalletDemo();
  const [visible, setVisible] = useState(true);

  return (
    <section className="px-5 pt-2">
      <div className="rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[#6B7280]">Saldo disponible</p>
          <AnimatedBalance value={balance} visible={visible} />
        </div>

        <motion.button
          type="button"
          whileHover={nativeHover}
          whileTap={nativeTap}
          onClick={() => setVisible((v) => !v)}
          className="mt-1 flex h-10 w-10 items-center justify-center rounded-full text-[#6B7280]"
          aria-label={visible ? "Ocultar saldo" : "Mostrar saldo"}
        >
          {visible ? (
            <Eye className="h-5 w-5" strokeWidth={1.75} />
          ) : (
            <EyeOff className="h-5 w-5" strokeWidth={1.75} />
          )}
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...nativeSpring, delay: 0.06 }}
        className="mt-5 flex items-center justify-between gap-3 border-t border-black/[0.06] pt-5"
      >
        <p className="min-w-0 text-sm text-[#1E1E1E]">
          Recargar desde PRINCIPAL{" "}
          <span className="text-[#6B7280]">******73...</span>
        </p>

        <motion.button
          type="button"
          whileHover={nativeHover}
          whileTap={nativeTap}
          onClick={() => recharge(20)}
          className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[#5D21D0] px-4 py-2 text-sm font-bold text-white shadow-[0_4px_14px_rgba(93,33,208,0.35)]"
        >
          + $20
          <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          <ChevronRight className="-ml-2.5 h-4 w-4" strokeWidth={2.5} />
        </motion.button>
      </motion.div>
      </div>
    </section>
  );
}
