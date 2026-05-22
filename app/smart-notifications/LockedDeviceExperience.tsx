"use client";

import { useState } from "react";

import { RadarDeUnaDemo } from "./RadarDeUnaDemo";
import { LockedDeviceOverlayPortal } from "./_components/LockedDeviceOverlay";

/**
 * Demo con pantalla bloqueada: muestra el push de recomendación y,
 * al tocarlo, revela la experiencia DeUna completa sin modificarla.
 */
export function LockedDeviceExperience() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <>
      <div
        className={unlocked ? undefined : "invisible"}
        aria-hidden={!unlocked}
      >
        <RadarDeUnaDemo />
      </div>

      <LockedDeviceOverlayPortal
        visible={!unlocked}
        onUnlock={() => setUnlocked(true)}
      />
    </>
  );
}
