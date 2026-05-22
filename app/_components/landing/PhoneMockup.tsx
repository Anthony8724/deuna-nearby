"use client";

import { motion } from "framer-motion";
import { Bell, MapPin } from "lucide-react";

type PhoneMockupProps = {
  title?: string;
  body?: string;
  negocio?: string;
  beneficio?: string;
  delay?: number;
};

export function PhoneMockup({
  title = "Promo cerca de ti",
  body = "¡Hey, María! Sweet & Coffee tiene 2x1 en bebidas. Estás a 95 m — dale hoy.",
  negocio = "Sweet & Coffee",
  beneficio = "2x1 bebidas",
  delay = 0,
}: PhoneMockupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-[272px] sm:w-[292px]"
    >
      <div className="absolute -inset-6 rounded-[2.75rem] bg-white/[0.03] blur-2xl" />
      <div className="relative rounded-[2.25rem] border border-white/[0.12] bg-zinc-950 p-2.5 shadow-stripe-lg">
        <div className="mb-2 flex justify-center">
          <div className="h-5 w-20 rounded-full bg-black" />
        </div>
        <div className="overflow-hidden rounded-[1.75rem] bg-black">
          <div className="flex items-center justify-between px-5 py-2.5">
            <span className="text-[11px] font-medium text-white/45">9:41</span>
          </div>
          <div className="px-4 pb-1">
            <p className="text-center text-base font-semibold tracking-tight text-white">
              DeUna
            </p>
            <p className="text-center text-[10px] font-medium text-white/40">
              Nearby
            </p>
          </div>
          <div className="mx-3 mb-3 rounded-xl border border-white/[0.08] bg-white/[0.04] p-3">
            <div className="mb-2 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#635bff]">
                <Bell className="h-4 w-4 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="text-[10px] text-white/40">Radar DeUna</p>
                <span className="text-[9px] font-medium uppercase tracking-wider text-white/35">
                  AI Generated
                </span>
              </div>
            </div>
            <p className="text-sm font-semibold text-white">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-white/55">{body}</p>
            <div className="mt-2 flex items-center gap-1 text-[10px] text-white/45">
              <MapPin className="h-3 w-3" />
              {negocio} · {beneficio}
            </div>
          </div>
          <div className="mx-3 mb-4 grid grid-cols-3 gap-1.5">
            {["Café", "Farmacia", "Market"].map((l) => (
              <div
                key={l}
                className="rounded-lg border border-white/[0.06] bg-white/[0.03] py-2.5 text-center text-[10px] text-white/40"
              >
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
