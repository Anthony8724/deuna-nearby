"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Loader2, Navigation } from "lucide-react";

import { openGoogleMapsNavigation } from "../lib/googleMapsNavigation";
import { deuna } from "../styles/deuna-ui";
import type { UserLocation } from "../types";

export type ComoLlegarButtonProps = {
  latitude: number;
  longitude: number;
  comercio?: string;
  userOrigin?: UserLocation | null;
  size?: "md" | "lg";
  pulse?: boolean;
  className?: string;
  onCustomNavigate?: () => void;
};

type NavStatus = "idle" | "opening" | "opened" | "failed";

export function ComoLlegarButton({
  latitude,
  longitude,
  comercio,
  userOrigin = null,
  size = "lg",
  pulse = true,
  className = "",
  onCustomNavigate,
}: ComoLlegarButtonProps) {
  const [status, setStatus] = useState<NavStatus>("idle");
  const [clipboardCopied, setClipboardCopied] = useState(false);

  const busy = status === "opening";
  const failed = status === "failed";

  const handleClick = useCallback(() => {
    if (onCustomNavigate) {
      onCustomNavigate();
      return;
    }

    setStatus("opening");

    void (async () => {
      const result = await openGoogleMapsNavigation(
        latitude,
        longitude,
        comercio,
        { origin: userOrigin, travelMode: "walking" },
      );

      if (result.opened) {
        setStatus("opened");
        window.setTimeout(() => setStatus("idle"), 2200);
      } else {
        setClipboardCopied(result.clipboardCopied ?? false);
        setStatus("failed");
      }
    })();
  }, [latitude, longitude, comercio, userOrigin, onCustomNavigate]);

  const sizeClasses =
    size === "lg"
      ? "py-3.5 text-[15px] gap-2.5 rounded-2xl"
      : "py-3 text-sm gap-2 rounded-xl";

  const iconSize = size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <div className={className}>
      <motion.button
        type="button"
        disabled={busy}
        whileTap={busy ? undefined : { scale: 0.98 }}
        onClick={handleClick}
        className={`relative flex w-full touch-manipulation items-center justify-center overflow-hidden font-semibold transition-colors ${sizeClasses} ${
          failed
            ? "border border-amber-300 bg-amber-50 text-amber-800"
            : deuna.btnSecondary
        } ${busy ? "pointer-events-none opacity-90" : ""}`}
      >
        {pulse && !busy && !failed ? (
          <motion.span
            aria-hidden
            className={`pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ${deuna.brandRing}`}
            animate={{ opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}

        {busy ? (
          <Loader2 className={`${iconSize} animate-spin ${deuna.brandText}`} />
        ) : failed ? (
          <ExternalLink className={iconSize} />
        ) : (
          <Navigation className={`${iconSize} ${deuna.brandText}`} strokeWidth={2.25} />
        )}

        <span className="relative">
          {busy
            ? "Abriendo Google Maps..."
            : failed
              ? "Toca para abrir en Maps"
              : "Cómo llegar"}
        </span>
      </motion.button>

      <AnimatePresence>
        {status === "opened" ? (
          <motion.p
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-1.5 text-center text-[11px] font-medium ${deuna.brandText}`}
          >
            Google Maps abierto en otra pestaña
          </motion.p>
        ) : null}
        {failed ? (
          <motion.p
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 text-center text-[11px] leading-snug text-amber-700"
          >
            {clipboardCopied
              ? "Enlace copiado — pégalo en el navegador o toca de nuevo."
              : "No pudimos abrir Maps. Toca de nuevo."}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
