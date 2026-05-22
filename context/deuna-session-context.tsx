"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { demoTimings, isDemoMode } from "@/constants/demo";
import { homeUser } from "@/constants/home";
import { ensureDemoBootstrap, getFreshSessionSnapshot } from "@/lib/demo-orchestrator";
import {
  computePaymentDetails,
  createCompletedPayment,
  mergeDashboardWithPayment,
} from "@/lib/payment-mock";
import type { MerchantDashboardData } from "@/types/merchant-dashboard";
import type { NearbyMoment } from "@/types/nearby-moment";
import type { CompletedPayment, PaymentPhase } from "@/types/payment";

const SESSION_KEY = "deuna-nearby-session";

type SessionSnapshot = {
  balance: number;
  monthlyCashback: number;
  completedPayments: CompletedPayment[];
};

type DeunaSessionValue = {
  balance: number;
  monthlyCashback: number;
  completedPayments: CompletedPayment[];
  paymentPhase: PaymentPhase;
  lastPayment: CompletedPayment | null;
  recentPaymentId: string | null;
  processPayment: (moment: NearbyMoment) => Promise<CompletedPayment>;
  resetPaymentPhase: () => void;
  clearRecentPayment: () => void;
  getLiveDashboard: (base: MerchantDashboardData) => MerchantDashboardData;
};

const DeunaSessionContext = createContext<DeunaSessionValue | null>(null);

function loadSnapshot(): SessionSnapshot {
  if (typeof window === "undefined") {
    return {
      balance: homeUser.balance,
      monthlyCashback: homeUser.monthlyCashback,
      completedPayments: [],
    };
  }

  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
      return {
        balance: homeUser.balance,
        monthlyCashback: homeUser.monthlyCashback,
        completedPayments: [],
      };
    }
    return JSON.parse(raw) as SessionSnapshot;
  } catch {
    return {
      balance: homeUser.balance,
      monthlyCashback: homeUser.monthlyCashback,
      completedPayments: [],
    };
  }
}

function persistSnapshot(snapshot: SessionSnapshot) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(snapshot));
}

export function DeunaSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [snapshot, setSnapshot] = useState<SessionSnapshot>(() => ({
    balance: homeUser.balance,
    monthlyCashback: homeUser.monthlyCashback,
    completedPayments: [],
  }));
  const [paymentPhase, setPaymentPhase] = useState<PaymentPhase>("idle");
  const [lastPayment, setLastPayment] = useState<CompletedPayment | null>(
    null,
  );
  const [recentPaymentId, setRecentPaymentId] = useState<string | null>(null);

  useEffect(() => {
    if (isDemoMode() && ensureDemoBootstrap()) {
      setSnapshot(getFreshSessionSnapshot());
      return;
    }
    setSnapshot(loadSnapshot());
  }, []);

  const processPayment = useCallback(async (moment: NearbyMoment) => {
    const details = computePaymentDetails(moment);
    const payment = createCompletedPayment(moment, details);

    setPaymentPhase("processing");

    await new Promise((resolve) =>
      setTimeout(resolve, demoTimings.paymentProcessingMs),
    );

    setSnapshot((prev) => {
      const next: SessionSnapshot = {
        balance: Math.round((prev.balance - details.netDebit) * 100) / 100,
        monthlyCashback:
          Math.round((prev.monthlyCashback + details.benefitAmount) * 100) /
          100,
        completedPayments: [payment, ...prev.completedPayments],
      };
      persistSnapshot(next);
      return next;
    });

    setLastPayment(payment);
    setRecentPaymentId(payment.id);
    setPaymentPhase("success");

    return payment;
  }, []);

  const resetPaymentPhase = useCallback(() => {
    setPaymentPhase("idle");
    setLastPayment(null);
  }, []);

  const clearRecentPayment = useCallback(() => {
    setRecentPaymentId(null);
  }, []);

  const getLiveDashboard = useCallback(
    (base: MerchantDashboardData) =>
      mergeDashboardWithPayment(base, snapshot.completedPayments),
    [snapshot.completedPayments],
  );

  const value = useMemo(
    () => ({
      balance: snapshot.balance,
      monthlyCashback: snapshot.monthlyCashback,
      completedPayments: snapshot.completedPayments,
      paymentPhase,
      lastPayment,
      recentPaymentId,
      processPayment,
      resetPaymentPhase,
      clearRecentPayment,
      getLiveDashboard,
    }),
    [
      snapshot.balance,
      snapshot.monthlyCashback,
      snapshot.completedPayments,
      paymentPhase,
      lastPayment,
      recentPaymentId,
      processPayment,
      resetPaymentPhase,
      clearRecentPayment,
      getLiveDashboard,
    ],
  );

  return (
    <DeunaSessionContext.Provider value={value}>
      {children}
    </DeunaSessionContext.Provider>
  );
}

export function useDeunaSession() {
  const ctx = useContext(DeunaSessionContext);
  if (!ctx) {
    throw new Error("useDeunaSession must be used within DeunaSessionProvider");
  }
  return ctx;
}
