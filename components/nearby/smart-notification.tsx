"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { NearbyMoment } from "@/types/nearby-moment";
import { springSmooth, tapScaleSoft } from "@/lib/motion-presets";
import { AiSparkle, AiContextBadge } from "@/components/ui/ai-indicator";
import { getMomentContextBadge, getMomentContextReason, getMomentContextType } from "@/lib/context-ai";

export function SmartNotification({
  moment,
  visible,
  onOpen,
  onDismiss,
}: {
  moment: NearbyMoment;
  visible: boolean;
  onOpen: () => void;
  onDismiss: () => void;
}) {
  const contextBadge = getMomentContextBadge(moment);
  const contextReason = getMomentContextReason(moment);
  const contextType = getMomentContextType(moment);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={springSmooth}
          className="pointer-events-none fixed inset-x-0 toast-above-nav z-50 mx-auto w-full max-w-[430px] px-4"
        >
          <motion.div
            layout
            className="pointer-events-auto overflow-hidden rounded-[1.25rem] bg-white p-3 shadow-[0_8px_32px_rgba(91,33,182,0.14),0_2px_8px_rgba(24,24,27,0.06)] ring-1 ring-brand-primary/10"
          >
            <div className="mb-2 flex items-center gap-1.5 px-0.5">
              <AiSparkle className="text-brand-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">
                DeUna Nearby
              </span>
              <AiContextBadge type={contextType} label={contextBadge} className="ml-1" />
              <span className="ml-auto text-[10px] font-medium text-text-tertiary">
                Ahora
              </span>
            </div>

            <div className="flex items-start gap-2">
              <motion.button
                type="button"
                onClick={onOpen}
                whileTap={tapScaleSoft}
                className="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-1 text-left transition-colors hover:bg-brand-primary-muted/40"
              >
                <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-primary-muted text-xl ring-1 ring-brand-primary/10">
                  {moment.imageUrl ? (
                    <Image
                      src={moment.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    moment.emoji
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-foreground">
                    {moment.merchantName}
                  </span>
                  <span className="mt-0.5 block truncate text-xs font-semibold text-brand-primary">
                    {moment.benefit}
                    {moment.distance ? ` · ${moment.distance}` : ""}
                  </span>
                  {contextReason && (
                    <span className="mt-1 block line-clamp-2 text-[11px] leading-snug text-text-secondary">
                      {contextReason}
                    </span>
                  )}
                </span>
              </motion.button>

              <button
                type="button"
                onClick={onDismiss}
                className="touch-target flex shrink-0 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-surface-muted hover:text-foreground"
                aria-label="Descartar notificación"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={tapScaleSoft}
          onClick={onOpen}
              className="mt-2.5 min-h-[2.75rem] w-full rounded-full bg-brand-primary py-3 text-xs font-bold text-white shadow-brand-soft touch-manipulation"
        >
              Ver beneficio
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
