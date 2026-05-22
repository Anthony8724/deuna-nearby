"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { demoPresenterSteps, isDemoMode } from "@/constants/demo";
import { resetDemoState } from "@/lib/demo-orchestrator";
import { springSmooth, tapScaleSoft } from "@/lib/motion-presets";

/** Bootstrap state runs in DeunaSessionProvider via ensureDemoBootstrap */
export function DemoBootstrap() {
  return null;
}

export function DemoPresenterBar() {
  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState(0);

  if (!isDemoMode()) return null;

  const handleReset = () => {
    resetDemoState({ force: true });
    sessionStorage.removeItem("deuna-demo-bootstrapped");
    window.location.href = "/";
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={springSmooth}
          className="fixed left-0 right-0 top-0 z-[70] mx-auto w-full max-w-[400px] px-3 pt-[max(0.375rem,env(safe-area-inset-top))]"
        >
          <div className="flex items-start gap-2 rounded-2xl border border-brand-primary/15 bg-white/95 px-3 py-2.5 shadow-[0_8px_32px_rgba(91,33,182,0.12)] backdrop-blur-xl">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">
                Demo hackathon
              </p>
              <motion.p
                key={step}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                className="mt-0.5 text-[11px] font-medium leading-snug text-text-secondary"
              >
                {step + 1}/{demoPresenterSteps.length} · {demoPresenterSteps[step]}
              </motion.p>
            </div>
            <div className="flex shrink-0 gap-1">
              {step === demoPresenterSteps.length - 1 ? (
                <motion.a
                  href="/dashboard"
                  whileTap={tapScaleSoft}
                  className="rounded-lg bg-brand-primary px-2 py-1 text-[10px] font-bold text-white"
                >
                  Dashboard
                </motion.a>
              ) : null}
              <motion.button
                type="button"
                whileTap={tapScaleSoft}
                onClick={() => setStep((s) => (s + 1) % demoPresenterSteps.length)}
                className="rounded-lg bg-brand-primary-muted px-2 py-1 text-[10px] font-bold text-brand-primary"
              >
                Siguiente
              </motion.button>
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
