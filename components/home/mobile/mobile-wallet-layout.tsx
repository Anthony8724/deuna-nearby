"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MobileBottomNav } from "./mobile-bottom-nav";

type MobileWalletLayoutProps = {
  children: ReactNode;
  skeleton?: ReactNode;
  ready: boolean;
  demoBar?: boolean;
  variant?: "page" | "embed";
};

export function MobileWalletLayout({
  children,
  skeleton,
  ready,
  demoBar,
  variant = "page",
}: MobileWalletLayoutProps) {
  const isEmbed = variant === "embed";

  return (
    <div
      className={
        isEmbed
          ? "relative mx-auto w-full max-w-[320px] sm:max-w-[340px]"
          : "flex min-h-dvh items-start justify-center bg-[#1A1A1A] px-3 py-4 sm:py-6"
      }
    >
      <div
        className={`relative flex w-full flex-col overflow-hidden bg-[#F8F9FA] ${
          isEmbed
            ? "h-[680px] rounded-[28px] shadow-[0_24px_80px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.08)]"
            : "max-w-[400px] min-h-[calc(100dvh-2rem)] rounded-[32px] shadow-[0_24px_80px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.06)]"
        } ${demoBar ? "pt-12" : ""}`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center pt-2">
          <span className="h-1 w-28 rounded-full bg-black/10" aria-hidden />
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain pb-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <AnimatePresence mode="wait">
            {!ready && skeleton ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {skeleton}
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <MobileBottomNav active="home" />
      </div>
    </div>
  );
}
