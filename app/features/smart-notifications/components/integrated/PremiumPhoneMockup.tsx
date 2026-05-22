"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type PremiumPhoneMockupProps = {
  children: ReactNode;
  /** La tab bar va en children; esto solo muestra el home indicator */
  showHomeIndicator?: boolean;
  /** Modo integrado DeUna: menos escenario “demo producto” */
  embedded?: boolean;
  className?: string;
};

function DynamicIsland() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-[11px] z-50 -translate-x-1/2">
      <motion.div
        animate={{
          boxShadow: [
            "0 0 0 rgba(0,0,0,0)",
            "0 4px 20px rgba(0,0,0,0.45)",
            "0 0 0 rgba(0,0,0,0)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-[30px] w-[118px] items-center justify-center rounded-full bg-black ring-1 ring-white/10"
      >
        <div className="mr-2 h-2 w-2 rounded-full bg-zinc-800 ring-1 ring-zinc-700" />
        <div className="h-1.5 w-10 rounded-full bg-zinc-900" />
      </motion.div>
    </div>
  );
}

function PhoneStatusBar() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between px-7 pt-[14px] text-[11px] font-semibold text-[#171717]"
      style={{ paddingTop: "max(14px, env(safe-area-inset-top, 14px))" }}
    >
      <span className="w-14 tabular-nums">9:41</span>
      <div className="w-[118px]" aria-hidden />
      <div className="flex w-14 items-center justify-end gap-1">
        <svg className="h-2.5 w-[15px]" viewBox="0 0 15 10" fill="currentColor" aria-hidden>
          <rect x="0" y="6" width="2.5" height="4" rx="0.5" opacity="0.4" />
          <rect x="4" y="4" width="2.5" height="6" rx="0.5" opacity="0.55" />
          <rect x="8" y="2" width="2.5" height="8" rx="0.5" opacity="0.7" />
          <rect x="12" y="0" width="2.5" height="10" rx="0.5" />
        </svg>
        <svg className="h-2.5 w-3.5" viewBox="0 0 14 10" fill="currentColor" aria-hidden>
          <path d="M7 2C4.5 2 2.2 3.1 0.5 5c1.7 1.9 4 3 6.5 3s4.8-1.1 6.5-3C12.8 3.1 10.5 2 8 2z" opacity="0.5" />
          <circle cx="7" cy="5" r="2" />
        </svg>
        <div className="flex h-2.5 w-6 items-center rounded-[3px] border border-black/25 px-px">
          <div className="h-1.5 w-3.5 rounded-[2px] bg-[#171717]" />
        </div>
      </div>
    </div>
  );
}

/**
 * Mockup iPhone premium — marco, Dynamic Island, safe areas y tab bar DeUna.
 */
export function PremiumPhoneMockup({
  children,
  showHomeIndicator = true,
  embedded = false,
  className = "",
}: PremiumPhoneMockupProps) {
  return (
    <motion.div
      initial={embedded ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: embedded ? 0.3 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`relative mx-auto w-full ${embedded ? "max-w-[min(400px,100%)]" : "max-w-[400px]"} ${className}`}
    >
      {!embedded ? (
        <div
          className="pointer-events-none absolute -inset-8 rounded-[4rem] opacity-80 blur-3xl"
          style={{
            background:
              "conic-gradient(from 200deg at 50% 50%, rgba(93,42,142,0.06), rgba(255,255,255,0.5), rgba(93,42,142,0.04), rgba(93,42,142,0.06))"
          }}
        />
      ) : null}

      {/* Marco titanio */}
      <div className="relative rounded-[3.25rem] bg-gradient-to-b from-zinc-600 via-zinc-800 to-zinc-950 p-[3px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.75),0_0_0_1px_rgba(255,255,255,0.08)_inset]">
        <div className="absolute -left-[2px] top-[28%] h-14 w-[3px] rounded-l-sm bg-zinc-700/90" />
        <div className="absolute -left-[2px] top-[38%] h-10 w-[3px] rounded-l-sm bg-zinc-700/90" />
        <div className="absolute -right-[2px] top-[34%] h-16 w-[3px] rounded-r-sm bg-zinc-700/90" />

        <div className="overflow-hidden rounded-[3.1rem] bg-zinc-950 ring-1 ring-black/80">
          {/* Pantalla */}
          <div className="relative mx-auto aspect-[393/852] w-full max-h-[min(852px,90dvh)] min-h-[640px] bg-white">
            <div
              className="pointer-events-none absolute inset-0 z-0 bg-[#F5F5F7]"
              style={{
                background: `
                  linear-gradient(180deg, #ffffff 0%, #f5f5f7 32%, #f5f5f7 100%)
                `,
              }}
            />

            <DynamicIsland />
            <PhoneStatusBar />

            {/* Área de contenido con safe areas */}
            <div className="relative z-10 flex h-full min-h-0 flex-col pt-[52px]">
              <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
                {children}
              </div>
            </div>

            {showHomeIndicator ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-2 z-10 flex justify-center">
                <div className="h-1 w-[108px] rounded-full bg-black/20" />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {!embedded ? (
        <div
          className="pointer-events-none mx-auto mt-4 h-8 w-[70%] rounded-[100%] blur-2xl"
          style={{ background: "rgba(93, 42, 142, 0.08)" }}
        />
      ) : null}
    </motion.div>
  );
}
