"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { premium } from "@/app/_components/ui/premium";
import { LOCK_SCREEN_ROUTE } from "@/lib/demo-routes";

export function FinalCtaSection() {
  return (
    <section className="relative py-28 sm:py-36">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] px-6 py-16 text-center sm:px-14 sm:py-20"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,91,255,0.12), transparent 70%)",
          }}
        />
        <div className="relative">
          <h2 className={`${premium.h2} text-balance`}>
            El futuro del commerce es contextual
          </h2>
          <p className={`mx-auto mt-5 max-w-lg ${premium.lead}`}>
            Descubre beneficios inteligentes en el momento exacto. Empieza con
            Radar DeUna hoy.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={LOCK_SCREEN_ROUTE} className={premium.btnPrimary}>
              Continuar demo (Radar DeUna)
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/dashboard" className={premium.btnSecondary}>
              Dashboard impacto + pitch
            </Link>
          </div>
          <p className={`mt-10 ${premium.body}`}>
            DeUna Nearby · Smart Commerce Discovery · Quito, Ecuador
          </p>
        </div>
      </motion.div>
    </section>
  );
}
