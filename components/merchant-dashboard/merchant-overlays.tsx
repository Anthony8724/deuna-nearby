"use client";

import { motion, AnimatePresence } from "framer-motion";
import { nativeSpring, nativeTap } from "@/lib/home-motion";

export function MerchantToast({
  message,
  onDismiss,
}: {
  message: string | null;
  onDismiss: () => void;
}) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={nativeSpring}
          className="fixed bottom-24 left-1/2 z-50 w-[calc(100%-2.5rem)] max-w-[360px] -translate-x-1/2"
        >
          <button
            type="button"
            onClick={onDismiss}
            className="w-full rounded-2xl bg-[#1E1E1E] px-4 py-3 text-center text-sm font-semibold text-white shadow-lg"
          >
            {message}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function HoursSheet({
  open,
  isOpen,
  peakHours,
  onClose,
  onSave,
}: {
  open: boolean;
  isOpen: boolean;
  peakHours: string;
  onClose: () => void;
  onSave: (value: { isOpen: boolean; peakHours: string }) => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Cerrar editor de horario"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={nativeSpring}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[400px] rounded-t-[1.5rem] bg-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-12px_40px_rgba(0,0,0,0.15)]"
          >
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-black/10" />
            <h3 className="text-lg font-bold text-[#1E1E1E]">Editar horario</h3>
            <p className="mt-1 text-sm text-[#6B7280]">
              Ajusta el estado del comercio y la hora pico.
            </p>

            <form
              className="mt-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);
                onSave({
                  isOpen: formData.get("isOpen") === "on",
                  peakHours: String(formData.get("peakHours") ?? peakHours),
                });
              }}
            >
              <label className="flex items-center justify-between rounded-xl bg-[#F3F4F6] px-4 py-3">
                <span className="text-sm font-semibold text-[#374151]">Comercio abierto</span>
                <input
                  type="checkbox"
                  name="isOpen"
                  defaultChecked={isOpen}
                  className="h-5 w-5 accent-[#5D21D0]"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-[#374151]">Hora pico</span>
                <input
                  name="peakHours"
                  defaultValue={peakHours}
                  className="mt-2 w-full rounded-xl border border-black/[0.08] px-4 py-3 text-sm text-[#1E1E1E] outline-none focus:border-[#5D21D0]"
                />
              </label>

              <div className="flex gap-3 pt-2">
                <motion.button
                  type="button"
                  whileTap={nativeTap}
                  onClick={onClose}
                  className="flex-1 rounded-2xl bg-[#F3F4F6] py-3 text-sm font-semibold text-[#374151]"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  type="submit"
                  whileTap={nativeTap}
                  className="flex-1 rounded-2xl bg-[#5D21D0] py-3 text-sm font-semibold text-white"
                >
                  Guardar
                </motion.button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
