"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LANDING_ROUTE, LOCK_SCREEN_ROUTE } from "@/lib/demo-routes";
import {
  demoFlowSteps,
  demoStepForPath,
  isDemoMode,
  writeDemoStep,
} from "@/constants/demo";
import { resetDemoState } from "@/lib/demo-orchestrator";
import { springSmooth, tapScaleSoft } from "@/lib/motion-presets";

/** Bootstrap state runs in DeunaSessionProvider via ensureDemoBootstrap */
export function DemoBootstrap() {
  return null;
}

export function DemoPresenterBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const synced = demoStepForPath(pathname);
    setStep(synced);
    writeDemoStep(synced);
  }, [pathname]);

  if (!isDemoMode()) return null;

  const current = demoFlowSteps[step];
  const isLast = step === demoFlowSteps.length - 1;

  const handleReset = () => {
    resetDemoState({ force: true });
    sessionStorage.removeItem("deuna-demo-bootstrapped");
    sessionStorage.removeItem("deuna-lock-unlocked");
    writeDemoStep(0);
    window.location.href = LOCK_SCREEN_ROUTE;
  };

  const goNext = () => {
    const next = (step + 1) % demoFlowSteps.length;
    setStep(next);
    writeDemoStep(next);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={springSmooth}
          className="fixed left-0 right-0 top-0 z-[80] mx-auto w-full max-w-[400px] px-3 pt-[max(0.375rem,env(safe-area-inset-top))] lg:max-w-none lg:px-6"
        >
          <div className="flex items-start gap-2 rounded-2xl border border-brand-primary/15 bg-white/95 px-3 py-2.5 shadow-[0_8px_32px_rgba(91,33,182,0.12)] backdrop-blur-xl lg:mx-auto lg:max-w-3xl">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">
                Demo unificada · {step + 1}/{demoFlowSteps.length}
              </p>
              <motion.p
                key={step}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                className="mt-0.5 text-[11px] font-medium leading-snug text-text-secondary lg:text-xs"
              >
                {current.label}
              </motion.p>
            </div>
            <div className="flex shrink-0 flex-wrap justify-end gap-1">
              <motion.a
                href={current.href}
                whileTap={tapScaleSoft}
                className="rounded-lg bg-brand-primary px-2 py-1 text-[10px] font-bold text-white"
              >
                Ir
              </motion.a>
              {!isLast ? (
                <motion.button
                  type="button"
                  whileTap={tapScaleSoft}
                  onClick={goNext}
                  className="rounded-lg bg-brand-primary-muted px-2 py-1 text-[10px] font-bold text-brand-primary"
                >
                  Siguiente
                </motion.button>
              ) : null}
              <motion.button
                type="button"
                whileTap={tapScaleSoft}
                onClick={handleReset}
                className="rounded-lg px-2 py-1 text-[10px] font-semibold text-text-tertiary hover:bg-surface-muted"
              >
                Reiniciar
              </motion.button>
              <button
                type="button"
                onClick={() => setVisible(false)}
                className="rounded-lg px-1.5 py-1 text-xs text-text-tertiary"
                aria-label="Ocultar guía demo"
              >
                ×
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
