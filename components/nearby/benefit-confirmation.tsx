"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { motion } from "framer-motion";
import { useClientReady } from "@/hooks/use-client-ready";
import { AiBadge } from "@/components/ui/ai-indicator";
import { AnimatedNumber, formatUsd } from "@/components/ui/motion-primitives";
import {
  easeOutExpo,
  springSmooth,
  staggerContainer,
  staggerItem,
  tapScaleSoft,
} from "@/lib/motion-presets";
import type { CompletedPayment } from "@/types/payment";

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function AnimatedSuccessCheck() {
  return (
    <div className="relative flex h-[5.5rem] w-[5.5rem] items-center justify-center">
      <motion.span
        initial={{ scale: 0, opacity: 0.6 }}
        animate={{ scale: 1.35, opacity: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="absolute inset-0 rounded-full bg-brand-emerald/20"
      />
      <motion.span
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{ scale: 1.15, opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        className="absolute inset-2 rounded-full bg-brand-primary/10"
      />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 20, delay: 0.05 }}
        className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-linear-to-br from-brand-emerald/15 via-white to-brand-primary-muted shadow-[0_8px_32px_rgba(93,33,208,0.18)] ring-1 ring-brand-emerald/20"
      >
        <svg viewBox="0 0 52 52" className="h-11 w-11" aria-hidden>
          <motion.circle
            cx="26"
            cy="26"
            r="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-brand-emerald/25"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
          />
          <motion.path
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brand-emerald"
            d="M14 27l8 8 16-18"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.38 }}
          />
        </svg>
      </motion.div>
    </div>
  );
}

type BenefitConfirmationProps = {
  payment: CompletedPayment;
  balance: number;
  onDone: () => void;
};

export function BenefitConfirmation({
  payment,
  balance,
  onDone,
}: BenefitConfirmationProps) {
  const router = useRouter();
  const routerReady = useClientReady();
  const dashboardHref = `/comercio/dashboard?merchant=${payment.merchantId}&highlight=${payment.id}`;
  const personalizedNote =
    payment.aiInsight ??
    `Tu beneficio en ${payment.merchantName} ya está activo en tu billetera.`;

  const handleDashboardNav = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      onDone();
      if (!routerReady) return;
      router.push(dashboardHref);
    },
    [dashboardHref, onDone, router, routerReady],
  );

  return (
    <motion.div
      key="benefit-confirmation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden px-[var(--section-x)] pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2"
    >
      <div
        className="pointer-events-none absolute inset-x-8 top-0 h-32 rounded-full bg-brand-primary/[0.04] blur-3xl"
        aria-hidden
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="relative flex flex-col items-center text-center"
      >
        <motion.div variants={staggerItem}>
          <AnimatedSuccessCheck />
        </motion.div>

        <motion.p
          variants={staggerItem}
          className="mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-primary"
        >
          Beneficio aplicado
        </motion.p>

        <motion.div variants={staggerItem} className="mt-2">
          <AiBadge label="DeUna Inteligente" variant="subtle" />
        </motion.div>

        <motion.h2
          variants={staggerItem}
          className="mt-2 max-w-[20rem] text-[1.375rem] font-bold leading-snug tracking-tight text-foreground"
        >
          Ahorraste{" "}
          <AnimatedNumber
            value={payment.benefitAmount}
            format={formatUsd}
            className="text-brand-emerald"
          />{" "}
          gracias a DeUna Nearby.
        </motion.h2>

        <motion.p
          variants={staggerItem}
          className="mt-3 max-w-[19rem] text-sm leading-relaxed text-text-secondary"
        >
          {personalizedNote}
        </motion.p>

        <motion.div
          variants={staggerItem}
          className="mt-6 w-full overflow-hidden rounded-[1.375rem] border border-brand-primary/10 bg-white shadow-[0_4px_24px_rgba(91,33,182,0.08)]"
        >
          <div className="border-b border-brand-primary/8 bg-brand-primary-muted/40 px-4 py-3">
            <p className="text-label">Comercio</p>
            <p className="mt-0.5 text-base font-bold tracking-tight text-foreground">
              {payment.merchantName}
            </p>
          </div>

          <div className="grid grid-cols-2 divide-x divide-border-faint">
            <div className="px-4 py-3.5 text-left">
              <p className="text-label">Beneficio</p>
              <p className="text-balance mt-1 text-sm font-bold text-brand-primary">
                {payment.benefitLabel}
              </p>
            </div>
            <div className="px-4 py-3.5 text-left">
              <p className="text-label">Ahorro</p>
              <p className="text-balance mt-1 text-sm font-bold text-brand-emerald">
                +
                <AnimatedNumber value={payment.benefitAmount} format={formatUsd} />
              </p>
            </div>
          </div>

          <div className="border-t border-border-faint bg-surface-muted/60 px-4 py-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Pagaste</span>
              <span className="text-balance font-semibold text-foreground">
                {formatMoney(payment.amount)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-border-faint pt-2 text-sm">
              <span className="text-text-secondary">Nuevo saldo</span>
              <span className="text-balance font-semibold text-brand-primary">
                <AnimatedNumber value={balance} format={formatUsd} animateFromZero={false} />
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={staggerItem}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-emerald/10 px-3 py-1.5 text-[11px] font-semibold text-brand-emerald ring-1 ring-brand-emerald/15"
        >
          <span className="status-dot h-1.5 w-1.5 rounded-full bg-brand-emerald" />
          Pago confirmado · Nearby activo
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springSmooth, delay: 0.45 }}
        className="relative mt-7 space-y-2.5"
      >
        <motion.div whileTap={tapScaleSoft}>
          <Link
            href={dashboardHref}
            prefetch={false}
            onClick={handleDashboardNav}
            className="btn-primary block w-full py-4 text-center text-sm"
          >
            Ver en panel comercio
          </Link>
        </motion.div>
        <motion.button
          type="button"
          whileTap={tapScaleSoft}
          onClick={onDone}
          className="w-full rounded-full py-3 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary-muted/50"
        >
          Listo
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
