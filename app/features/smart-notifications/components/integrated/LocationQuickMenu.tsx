"use client";



import { AnimatePresence, motion } from "framer-motion";



import {

  DEFAULT_SIMULATED_LOCATION,

  QUITO_LOCATION_PRESETS,

} from "../../data/quitoLocationPresets";

import { deuna } from "../../styles/deuna-ui";

import type { UserLocation } from "../../types";



type LocationQuickMenuProps = {

  open: boolean;

  onClose: () => void;

  onSelect: (location: UserLocation, label: string) => void;

};



export function LocationQuickMenu({

  open,

  onClose,

  onSelect,

}: LocationQuickMenuProps) {

  return (

    <AnimatePresence>

      {open ? (

        <>

          <motion.button

            type="button"

            aria-label="Cerrar menú"

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            exit={{ opacity: 0 }}

            className="absolute inset-0 z-[60] bg-black/25 backdrop-blur-[2px]"

            onClick={onClose}

          />

          <motion.div

            initial={{ opacity: 0, y: 8, scale: 0.96 }}

            animate={{ opacity: 1, y: 0, scale: 1 }}

            exit={{ opacity: 0, y: 8, scale: 0.96 }}

            className={`absolute right-3 top-[5.5rem] z-[70] w-[min(280px,calc(100%-1.5rem))] overflow-hidden rounded-2xl p-2 shadow-[0_12px_40px_rgba(0,0,0,0.15)] ${deuna.surfaceGlass}`}

          >

            <p className={`px-3 py-2 ${deuna.textLabel}`}>Explorar otra zona</p>

            {QUITO_LOCATION_PRESETS.map((p) => (

              <button

                key={p.id}

                type="button"

                onClick={() => {

                  onSelect(p.location, p.label);

                  onClose();

                }}

                className="flex w-full flex-col rounded-xl px-3 py-2.5 text-left transition hover:bg-[#F5F5F7] active:bg-[#F0F0F4]"

              >

                <span className={`text-[14px] font-semibold ${deuna.textPrimary}`}>

                  {p.label}

                </span>

                <span className={`text-[11px] ${deuna.textMuted}`}>{p.zona}</span>

              </button>

            ))}

            <button

              type="button"

              onClick={() => {

                onSelect(DEFAULT_SIMULATED_LOCATION, "Amazonas");

                onClose();

              }}

              className={`mt-1 w-full py-2.5 text-[13px] font-semibold ${deuna.btnSecondary}`}

            >

              Volver a Amazonas

            </button>

          </motion.div>

        </>

      ) : null}

    </AnimatePresence>

  );

}


