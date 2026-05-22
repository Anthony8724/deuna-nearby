"use client";

import Image from "next/image";
import { useEffect } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { AiBadge, AiContextStrip } from "@/components/ui/ai-indicator";
import { useDeunaSession } from "@/context/deuna-session-context";
import {
  getMomentContextBadge,
  getMomentContextReason,
} from "@/lib/context-ai";
import type { NearbyMoment } from "@/types/nearby-moment";
import { computePaymentDetails } from "@/lib/payment-mock";
import { hoverLiftSubtle, springSmooth, tapScaleSoft } from "@/lib/motion-presets";
import {
  PaymentProcessingState,
  PaymentSuccessState,
} from "./payment-flow-states";

const sheetSpring = { type: "spring" as const, stiffness: 400, damping: 36 };

const contentStagger = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 + i * 0.05, ...springSmooth },
  }),
};

function MerchantHero({ moment }: { moment: NearbyMoment }) {
  const contextBadge = getMomentContextBadge(moment);

  if (moment.imageUrl) {
    return (
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={moment.imageUrl}
          alt={moment.merchantName ?? "Comercio"}
          fill
          className="object-cover"
          sizes="(max-width: 512px) 100vw, 512px"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-black/5" />
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 text-lg shadow-[0_4px_16px_rgba(0,0,0,0.15)] ring-1 ring-white/50">
            {moment.emoji}
          </span>
          {(moment.contextLabel || moment.contextType || moment.aiInsight) && (
            <AiBadge
              label={contextBadge}
              variant="solid"
              className=""
            />
          )}
          {moment.isOpen !== undefined && (
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                moment.isOpen
                  ? "bg-brand-emerald/90 text-white"
                  : "bg-black/40 text-white/80"
              }`}
            >
              {moment.isOpen ? "Abierto" : "Cerrado"}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-36 items-center justify-center bg-linear-to-br from-brand-violet/15 to-brand-indigo/10">
      <span className="text-5xl">{moment.emoji}</span>
    </div>
  );
}

function SheetDetail({
  moment,
  onClose,
  onPay,
  isPaying,
}: {
  moment: NearbyMoment;
  onClose: () => void;
  onPay: () => void;
  isPaying: boolean;
}) {
  const details = computePaymentDetails(moment);
  const contextBadge = getMomentContextBadge(moment);
  const contextReason = getMomentContextReason(moment);

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <MerchantHero moment={moment} />

      <div className="px-[var(--section-x)] pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
        {(contextReason || moment.contextLabel) && (
          <motion.div
            custom={0}
            variants={contentStagger}
            initial="hidden"
            animate="show"
            className="mb-4"
          >
            <AiContextStrip
              message={contextReason}
              badge={contextBadge}
            />
          </motion.div>
        )}

        <motion.div
          custom={1}
          variants={contentStagger}
          initial="hidden"
          animate="show"
          className="mb-1 flex items-start justify-between gap-3"
        >
          <div className="min-w-0">
            <h2 className="text-display text-[1.375rem] text-foreground">
              {moment.merchantName}
            </h2>
            {moment.distance && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  className="h-4 w-4 shrink-0 text-brand-indigo"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z"
                  />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                A {moment.distance} de ti
              </p>
            )}
          </div>
        </motion.div>

        {moment.benefit && (
          <motion.div
            custom={2}
            variants={contentStagger}
            initial="hidden"
            animate="show"
            className="mt-4"
          >
            <p className="text-label mb-2">Beneficio disponible</p>
            <span className="inline-flex items-center gap-2 rounded-2xl border border-brand-emerald/12 bg-brand-emerald/[0.07] px-4 py-3 text-sm font-semibold text-brand-emerald">
              {moment.benefit}
              {moment.expiresLabel && (
                <span className="text-xs font-medium text-brand-emerald/70">
                  · {moment.expiresLabel}
                </span>
              )}
            </span>
          </motion.div>
        )}

        {(moment.description || moment.message) && (
          <motion.p
            custom={3}
            variants={contentStagger}
            initial="hidden"
            animate="show"
            className="mt-4 text-sm leading-relaxed text-muted"
          >
            {moment.description ?? moment.message}
          </motion.p>
        )}

        {moment.hours && (
          <motion.div
            custom={4}
            variants={contentStagger}
            initial="hidden"
            animate="show"
            className="mt-4 flex items-center gap-3 rounded-2xl border border-border-faint bg-[#f8f9fc] px-4 py-3.5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-muted shadow-soft">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                className="h-4 w-4"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <div>
              <p className="text-label">Horario</p>
              <p className="text-sm font-medium text-foreground">
                {moment.hours}
              </p>
            </div>
          </motion.div>
        )}

        <motion.div
          custom={5}
          variants={contentStagger}
          initial="hidden"
          animate="show"
          className="mt-5 rounded-2xl border border-border-faint bg-[#f8f9fc] px-4 py-3.5"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Total a pagar</span>
            <span className="text-balance font-semibold text-foreground">
              ${details.amount.toFixed(2)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-border-subtle pt-2 text-sm">
            <span className="text-brand-emerald">Beneficio DeUna</span>
            <span className="text-balance font-semibold text-brand-emerald">
              −${details.benefitAmount.toFixed(2)}
            </span>
          </div>
        </motion.div>

        <motion.div
          custom={6}
          variants={contentStagger}
          initial="hidden"
          animate="show"
          className="mt-7 space-y-2.5"
        >
          <motion.button
            type="button"
            whileHover={hoverLiftSubtle}
            whileTap={tapScaleSoft}
            disabled={isPaying}
            onClick={onPay}
            className="btn-primary btn-touch w-full text-sm disabled:opacity-70"
          >
            Pagar con DeUna
          </motion.button>
          <motion.button
            type="button"
            whileTap={tapScaleSoft}
            onClick={onClose}
            disabled={isPaying}
            className="w-full min-h-[var(--btn-height)] rounded-full py-3 text-sm font-semibold text-text-secondary transition-colors hover:bg-surface-muted disabled:opacity-50 touch-manipulation"
          >
            Ahora no
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function NearbyBottomSheet({
  moment,
  open,
  onClose,
  onPaymentComplete,
}: {
  moment: NearbyMoment | null;
  open: boolean;
  onClose: () => void;
  onPaymentComplete?: () => void;
}) {
  const dragControls = useDragControls();
  const {
    paymentPhase,
    processPayment,
    resetPaymentPhase,
    lastPayment,
    balance,
  } = useDeunaSession();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!moment) return null;

  const isProcessing = paymentPhase === "processing";
  const isSuccess = paymentPhase === "success" && lastPayment;
  const canDrag = !isProcessing;

  const handleClose = () => {
    if (isProcessing) return;
    resetPaymentPhase();
    onClose();
  };

  const handleDone = () => {
    resetPaymentPhase();
    onPaymentComplete?.();
    onClose();
  };

  const handlePay = () => {
    if (isProcessing || paymentPhase === "success") return;
    void processPayment(moment);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#0a0f1a]/50"
            onClick={handleClose}
            aria-hidden
          />

          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={moment.merchantName ?? "Comercio recomendado"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={sheetSpring}
            drag={canDrag ? "y" : false}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (!canDrag) return;
              if (info.offset.y > 100 || info.velocity.y > 600) handleClose();
            }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[430px]"
          >
            <div className="sheet-mobile overflow-hidden border border-border-faint/80 bg-surface-card shadow-[0_-12px_48px_rgba(15,23,42,0.14),0_-2px_8px_rgba(15,23,42,0.06)]">
              {canDrag && (
                <div
                  className="flex min-h-[2.75rem] cursor-grab touch-manipulation items-center justify-center active:cursor-grabbing"
                  onPointerDown={(e) => dragControls.start(e)}
                >
                  <div
                    className="h-1.5 w-12 rounded-full bg-black/12"
                    aria-hidden
                  />
                </div>
              )}

              <div className="sheet-scroll">
              <AnimatePresence mode="wait">
                {isProcessing && <PaymentProcessingState key="processing" />}
                {isSuccess && lastPayment && (
                  <PaymentSuccessState
                    key="success"
                    payment={lastPayment}
                    balance={balance}
                    onDone={handleDone}
                  />
                )}
                {!isProcessing && !isSuccess && (
                  <SheetDetail
                    key="detail"
                    moment={moment}
                    onClose={handleClose}
                    onPay={handlePay}
                    isPaying={isProcessing}
                  />
                )}
              </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
