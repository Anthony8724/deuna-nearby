"use client";

import { motion } from "framer-motion";
import { springSmooth } from "@/lib/motion-presets";
import type { CompletedPayment } from "@/types/payment";
import { BenefitConfirmation } from "./benefit-confirmation";

export function PaymentProcessingState() {
  return (
    <motion.div
      key="processing"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={springSmooth}
      className="flex flex-col items-center px-[var(--section-x)] py-10 text-center"
    >
      <div className="relative flex h-[5.5rem] w-[5.5rem] items-center justify-center">
        <span
          className="spinner-ring absolute inset-0 rounded-full border-2 border-brand-primary/10 border-t-brand-primary"
          aria-hidden
        />
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary text-xl font-bold text-white shadow-brand-soft">
          D
        </span>
      </div>
      <p className="mt-7 text-[1.0625rem] font-semibold tracking-tight text-foreground">
        Procesando pago…
      </p>
      <p className="mt-2 max-w-[260px] text-sm leading-relaxed text-text-secondary">
        Aplicando tu beneficio DeUna Nearby de forma segura
      </p>
      <div className="mt-6 flex gap-1.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="processing-dot h-1 w-1 rounded-full bg-brand-primary/50"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </motion.div>
  );
}

type PaymentSuccessStateProps = {
  payment: CompletedPayment;
  balance: number;
  onDone: () => void;
};

export function PaymentSuccessState({
  payment,
  balance,
  onDone,
}: PaymentSuccessStateProps) {
  return (
    <BenefitConfirmation payment={payment} balance={balance} onDone={onDone} />
  );
}
