"use client";

import { useEffect, useState } from "react";

import { HomeSkeleton } from "@/components/ui/home-skeleton";
import { DeunaShell } from "@/components/layout/deuna-shell";
import { demoTimings, isDemoMode } from "@/constants/demo";

import { DeunaWalletScreen } from "./deuna-wallet-screen";
import { MobileWalletLayout } from "./mobile";
import { WalletDemoProvider } from "./mobile/wallet-demo-provider";

export type DeunaWalletAppProps = {
  /** Página completa (`/billetera`) o incrustada en landing */
  variant?: "page" | "embed";
  /** Barra extra de demo dentro del teléfono */
  demoBar?: boolean;
};

function DeunaWalletInner({
  variant = "page",
  demoBar,
}: DeunaWalletAppProps) {
  const [ready, setReady] = useState(variant === "embed");

  useEffect(() => {
    if (variant === "embed") return;
    const timer = setTimeout(() => setReady(true), demoTimings.homeReadyMs);
    return () => clearTimeout(timer);
  }, [variant]);

  return (
    <MobileWalletLayout
      variant={variant}
      ready={ready}
      demoBar={demoBar ?? (variant === "page" && isDemoMode())}
      skeleton={<HomeSkeleton />}
    >
      <DeunaWalletScreen />
    </MobileWalletLayout>
  );
}

/** App móvil DeUna unificada: pagos, transferencias, Nearby y bottom sheet. */
export function DeunaWalletApp({
  variant = "page",
  demoBar,
}: DeunaWalletAppProps) {
  return (
    <DeunaShell>
      <WalletDemoProvider>
        <DeunaWalletInner variant={variant} demoBar={demoBar} />
      </WalletDemoProvider>
    </DeunaShell>
  );
}
