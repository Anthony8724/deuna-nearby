"use client";

import { useEffect, useState } from "react";

import { DeunaWalletApp } from "@/components/home/deuna-wallet-app";

import { LockedDeviceOverlayPortal } from "./_components/LockedDeviceOverlay";

const UNLOCK_KEY = "deuna-lock-unlocked";

/**
 * Demo: primero pantalla bloqueada con push; al tocarlo → billetera unificada.
 */
export function LockedDeviceExperience() {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(UNLOCK_KEY) === "1");
    setReady(true);
  }, []);

  const handleUnlock = () => {
    sessionStorage.setItem(UNLOCK_KEY, "1");
    setUnlocked(true);
  };

  if (!ready) return null;

  return (
    <>
      {unlocked ? (
        <DeunaWalletApp variant="page" demoBar={false} />
      ) : null}

      <LockedDeviceOverlayPortal
        visible={!unlocked}
        onUnlock={handleUnlock}
      />
    </>
  );
}
