"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftRight, X } from "lucide-react";

import { nearbyMoments } from "@/constants/nearby-moments";
import { useDeunaSession } from "@/context/deuna-session-context";
import { useNearbyActions, useNearbyState } from "@/context/nearby-context";
import { nativeHover, nativeTap } from "@/lib/home-motion";

type WalletDemoContextValue = {
  openTransfer: () => void;
  openQrPayment: () => void;
  recharge: (amount?: number) => void;
  runQuickAction: (actionId: string) => void;
  showFeedback: (message: string) => void;
};

const WalletDemoContext = createContext<WalletDemoContextValue | null>(null);

const QUICK_ACTION_MESSAGES: Record<string, string> = {
  metro: "Pase Metro de Quito activado en tu DeUna.",
  invite: "Comparte tu código y gana $5 por cada amigo.",
  youth: "Deuna Jóvenes — beneficios exclusivos para ti.",
  verify: "Último pago verificado correctamente.",
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export function WalletDemoProvider({ children }: { children: ReactNode }) {
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState("25.00");
  const [feedback, setFeedback] = useState<string | null>(null);
  const { carouselMoments, visibleMoments } = useNearbyState();
  const { openSheet } = useNearbyActions();
  const { rechargeBalance, transferFunds } = useDeunaSession();

  const resolveMoment = useCallback(() => {
    return carouselMoments[0] ?? visibleMoments[0] ?? nearbyMoments[0] ?? null;
  }, [carouselMoments, visibleMoments]);

  const showFeedback = useCallback((message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 3200);
  }, []);

  const openQrPayment = useCallback(() => {
    const moment = resolveMoment();
    if (moment) {
      openSheet(moment);
      return;
    }
    showFeedback("No hay comercios disponibles en este momento.");
  }, [openSheet, resolveMoment, showFeedback]);

  const openTransfer = useCallback(() => {
    setTransferOpen(true);
  }, []);

  const recharge = useCallback(
    (amount = 20) => {
      rechargeBalance(amount);
      showFeedback(`Recarga de ${formatMoney(amount)} exitosa.`);
    },
    [rechargeBalance, showFeedback],
  );

  const runQuickAction = useCallback(
    (actionId: string) => {
      switch (actionId) {
        case "transfer":
          openTransfer();
          break;
        case "recharge":
          recharge(20);
          break;
        case "charge":
          openQrPayment();
          break;
        case "metro":
        case "invite":
        case "youth":
        case "verify":
          showFeedback(QUICK_ACTION_MESSAGES[actionId] ?? "Acción disponible en DeUna.");
          break;
        default:
          showFeedback("Acción disponible en DeUna.");
      }
    },
    [openTransfer, openQrPayment, recharge, showFeedback],
  );

  const confirmTransfer = useCallback(() => {
    const parsed = Number.parseFloat(transferAmount.replace(",", "."));
    const amount = Number.isFinite(parsed) && parsed > 0 ? parsed : 25;
    transferFunds(amount, "María G.");
    setTransferOpen(false);
    showFeedback(`Transferiste ${formatMoney(amount)} a María G.`);
  }, [showFeedback, transferAmount, transferFunds]);

  const value = useMemo(
    () => ({
      openTransfer,
      openQrPayment,
      recharge,
      runQuickAction,
      showFeedback,
    }),
    [openTransfer, openQrPayment, recharge, runQuickAction, showFeedback],
  );

  return (
    <WalletDemoContext.Provider value={value}>
      {children}

      <AnimatePresence>
        {feedback ? (
          <motion.div
            key={feedback}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="pointer-events-none fixed inset-x-0 bottom-24 z-[90] mx-auto flex max-w-[400px] justify-center px-5"
          >
            <p className="rounded-2xl bg-[#1E1E1E] px-4 py-3 text-center text-sm font-medium text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
              {feedback}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {transferOpen ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Cerrar transferencia"
              className="fixed inset-0 z-[85] bg-black/40"
              onClick={() => setTransferOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Transferir dinero"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="fixed inset-x-0 bottom-0 z-[86] mx-auto w-full max-w-[400px] rounded-t-[28px] bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-12px_48px_rgba(0,0,0,0.2)]"
            >
              <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-black/10" />
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#1E1E1E]">Transferir</h2>
                <button
                  type="button"
                  onClick={() => setTransferOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B7280]"
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <button
                type="button"
                className="mt-5 flex w-full items-center gap-3 rounded-2xl border border-black/[0.06] bg-[#F8F9FA] p-4 text-left"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EDE6FA] text-sm font-bold text-[#5D21D0]">
                  MG
                </span>
                <span>
                  <p className="text-sm font-semibold text-[#1E1E1E]">María G.</p>
                  <p className="text-xs text-[#6B7280]">099 *** **42</p>
                </span>
              </button>

              <label className="mt-5 block">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                  Monto
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-black/[0.08] bg-white px-4 py-3 text-2xl font-bold text-[#1E1E1E] outline-none focus:border-[#5D21D0]"
                />
              </label>

              <motion.button
                type="button"
                whileHover={nativeHover}
                whileTap={nativeTap}
                onClick={confirmTransfer}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5D21D0] py-4 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(93,33,208,0.28)]"
              >
                <ArrowLeftRight className="h-5 w-5" strokeWidth={1.75} />
                Confirmar transferencia
              </motion.button>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </WalletDemoContext.Provider>
  );
}

export function useWalletDemo() {
  const ctx = useContext(WalletDemoContext);
  if (!ctx) {
    throw new Error("useWalletDemo must be used within WalletDemoProvider");
  }
  return ctx;
}
