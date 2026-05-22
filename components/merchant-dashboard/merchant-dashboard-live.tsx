"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useDeunaSession } from "@/context/deuna-session-context";
import { MerchantDashboardProvider, useMerchantDashboard } from "@/context/merchant-dashboard-context";
import type { MerchantDashboardData } from "@/types/merchant-dashboard";
import { MerchantDashboardView } from "./merchant-dashboard";
import { LivePaymentBanner } from "./live-payment-banner";
import { HoursSheet, MerchantToast } from "./merchant-overlays";
import { MerchantMobileNav } from "./merchant-mobile-nav";

type MerchantDashboardLiveProps = {
  data: MerchantDashboardData;
  highlightId?: string;
};

function MerchantDashboardLiveInner({
  data,
  highlightId,
}: MerchantDashboardLiveProps) {
  const {
    getLiveDashboard,
    recentPaymentId,
    clearRecentPayment,
    completedPayments,
  } = useDeunaSession();

  const liveData = useMemo(
    () => getLiveDashboard(data),
    [data, getLiveDashboard],
  );

  return (
    <MerchantDashboardProvider baseData={liveData}>
      <MerchantDashboardContent
        highlightId={highlightId}
        completedPayments={completedPayments}
        recentPaymentId={recentPaymentId}
        clearRecentPayment={clearRecentPayment}
        merchantId={data.merchantId}
      />
    </MerchantDashboardProvider>
  );
}

function MerchantDashboardContent({
  highlightId,
  completedPayments,
  recentPaymentId,
  clearRecentPayment,
  merchantId,
}: {
  highlightId?: string;
  completedPayments: ReturnType<typeof useDeunaSession>["completedPayments"];
  recentPaymentId: string | null;
  clearRecentPayment: () => void;
  merchantId: string;
}) {
  const {
    toast,
    dismissToast,
    hoursSheetOpen,
    closeHoursEditor,
    saveHours,
    isOpen,
    peakHours,
  } = useMerchantDashboard();

  const highlightTransactionId = highlightId ?? recentPaymentId ?? undefined;

  const recentPayment = useMemo(() => {
    if (!highlightTransactionId) return null;
    return (
      completedPayments.find(
        (p) => p.id === highlightTransactionId && p.merchantId === merchantId,
      ) ?? null
    );
  }, [completedPayments, highlightTransactionId, merchantId]);

  const [showBanner, setShowBanner] = useState(Boolean(recentPayment));

  useEffect(() => {
    if (recentPayment) setShowBanner(true);
  }, [recentPayment]);

  const handleDismissBanner = () => {
    setShowBanner(false);
    clearRecentPayment();
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && recentPayment && (
          <LivePaymentBanner
            payment={recentPayment}
            onDismiss={handleDismissBanner}
          />
        )}
      </AnimatePresence>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <MerchantDashboardView highlightTransactionId={highlightTransactionId} />
        </div>
        <MerchantMobileNav />
      </div>
      <MerchantToast message={toast} onDismiss={dismissToast} />
      <HoursSheet
        open={hoursSheetOpen}
        isOpen={isOpen}
        peakHours={peakHours}
        onClose={closeHoursEditor}
        onSave={saveHours}
      />
    </>
  );
}

export function MerchantDashboardLive(props: MerchantDashboardLiveProps) {
  return <MerchantDashboardLiveInner {...props} />;
}
