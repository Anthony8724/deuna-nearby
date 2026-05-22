"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Camera, Flashlight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { FLAGSHIP_RECOMENDACION } from "@/app/data/platformSnapshot";
import {
  SmartPushNotification,
  smartPushPropsFromRecomendacion,
} from "@/app/features/smart-notifications/components/SmartPushNotification";
import { PremiumPhoneMockup } from "@/app/features/smart-notifications/components/integrated/PremiumPhoneMockup";
import { DEMO_USER } from "@/app/features/smart-notifications/config/demo";
import { DEFAULT_SIMULATED_LOCATION } from "@/app/features/smart-notifications/data/quitoLocationPresets";
import { pushConversationalMessage } from "@/app/features/smart-notifications/lib/nearbyCopy";
import { getNearbyMoment } from "@/services/nearbyMomentService";

type LockedDeviceOverlayProps = {
  onUnlock: () => void;
};

function getLockScreenTime(): string {
  return new Date().toLocaleTimeString("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Guayaquil",
  });
}

function getLockScreenDate(): string {
  const raw = new Date().toLocaleDateString("es-EC", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Guayaquil",
  });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function LockScreenWallpaper() {
  return (
    <>
      <div
        className="absolute inset-0 bg-[#0a0612]"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 50% 0%, rgba(93,42,142,0.55), transparent 55%),
            radial-gradient(ellipse 60% 50% at 80% 90%, rgba(139,92,246,0.25), transparent 50%),
            radial-gradient(ellipse 50% 40% at 10% 70%, rgba(59,130,246,0.18), transparent 45%),
            linear-gradient(180deg, #12081f 0%, #0a0612 45%, #050308 100%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 35%)",
        }}
      />
    </>
  );
}

export function LockedDeviceOverlay({ onUnlock }: LockedDeviceOverlayProps) {
  const [hora, setHora] = useState(getLockScreenTime);
  const [fecha] = useState(getLockScreenDate);
  const fallbackProps = useMemo(
    () =>
      smartPushPropsFromRecomendacion(FLAGSHIP_RECOMENDACION, {
        userId: DEMO_USER.id,
      }),
    [],
  );
  const [pushProps, setPushProps] = useState(fallbackProps);

  useEffect(() => {
    setHora(getLockScreenTime());
    const id = setInterval(() => setHora(getLockScreenTime()), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void getNearbyMoment(
      DEFAULT_SIMULATED_LOCATION.latitude,
      DEFAULT_SIMULATED_LOCATION.longitude,
      { userId: DEMO_USER.id },
    )
      .then((response) => {
        if (cancelled) return;

        const featured =
          response.moment ??
          response.recomendaciones[0] ??
          FLAGSHIP_RECOMENDACION;
        const message =
          response.message?.trim() ||
          pushConversationalMessage(featured, DEMO_USER.id);

        setPushProps({
          message,
          pulseGlow: true,
          delay: 0.2,
        });
      })
      .catch(() => {
        if (!cancelled) setPushProps(fallbackProps);
      });

    return () => {
      cancelled = true;
    };
  }, [fallbackProps]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: "-8%", scale: 1.02 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#E8E8ED] px-3 py-6 sm:py-10"
      aria-hidden={false}
    >
      <div
        className="pointer-events-none fixed inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 20%, rgba(93,42,142,0.06), transparent 70%)",
        }}
      />

      <PremiumPhoneMockup embedded className="relative z-10 w-full" showHomeIndicator={false}>
        <div className="relative -mt-[52px] flex h-[calc(100%+52px)] min-h-0 flex-col overflow-hidden pt-[52px] text-white">
          <div className="absolute inset-0">
            <LockScreenWallpaper />
          </div>

          <div
            className="pointer-events-none absolute -top-[52px] left-0 right-0 z-20 flex items-center justify-between px-7 pt-[14px] text-[11px] font-semibold text-white"
            style={{ paddingTop: "max(14px, env(safe-area-inset-top, 14px))" }}
          >
            <span className="w-14 tabular-nums">{hora}</span>
            <div className="w-[118px]" aria-hidden />
            <div className="flex w-14 items-center justify-end gap-1 opacity-90">
              <svg className="h-2.5 w-[15px]" viewBox="0 0 15 10" fill="currentColor" aria-hidden>
                <rect x="0" y="6" width="2.5" height="4" rx="0.5" opacity="0.5" />
                <rect x="4" y="4" width="2.5" height="6" rx="0.5" opacity="0.65" />
                <rect x="8" y="2" width="2.5" height="8" rx="0.5" opacity="0.8" />
                <rect x="12" y="0" width="2.5" height="10" rx="0.5" />
              </svg>
              <svg className="h-2.5 w-3.5" viewBox="0 0 14 10" fill="currentColor" aria-hidden>
                <path
                  d="M7 2C4.5 2 2.2 3.1 0.5 5c1.7 1.9 4 3 6.5 3s4.8-1.1 6.5-3C12.8 3.1 10.5 2 8 2z"
                  opacity="0.55"
                />
                <circle cx="7" cy="5" r="2" />
              </svg>
              <div className="flex h-2.5 w-6 items-center rounded-[3px] border border-white/35 px-px">
                <div className="h-1.5 w-3.5 rounded-[2px] bg-white" />
              </div>
            </div>
          </div>

          <div className="relative z-10 flex min-h-0 flex-1 flex-col px-5 pb-8 pt-2">
            <div className="pointer-events-none flex flex-1 flex-col items-center pt-6">
              <p className="font-mono text-[13px] font-medium tabular-nums text-white/55">
                {fecha}
              </p>
              <p className="mt-1 font-mono text-[72px] font-extralight leading-none tracking-tight text-white tabular-nums sm:text-[76px]">
                {hora}
              </p>
            </div>

            <div className="mt-auto space-y-4">
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                whileTap={{ scale: 0.985 }}
                onClick={onUnlock}
                className="w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                aria-label="Abrir recomendación DeUna"
              >
                <SmartPushNotification {...pushProps} />
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.4 }}
                className="text-center text-[11px] font-medium text-white/40"
              >
                Toca la notificación para abrir DeUna
              </motion.p>
            </div>

            <div className="mt-8 flex items-center justify-between px-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
                <Flashlight className="h-5 w-5 text-white/85" strokeWidth={1.75} />
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
                <Camera className="h-5 w-5 text-white/85" strokeWidth={1.75} />
              </div>
            </div>

            <div className="mt-5 flex justify-center">
              <div className="h-1 w-[108px] rounded-full bg-white/35" />
            </div>
          </div>
        </div>
      </PremiumPhoneMockup>
    </motion.div>
  );
}

export function LockedDeviceOverlayPortal({
  visible,
  onUnlock,
}: {
  visible: boolean;
  onUnlock: () => void;
}) {
  return (
    <AnimatePresence mode="wait">
      {visible ? <LockedDeviceOverlay key="locked-device" onUnlock={onUnlock} /> : null}
    </AnimatePresence>
  );
}
