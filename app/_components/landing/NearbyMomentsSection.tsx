"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { premium } from "@/app/_components/ui/premium";
import { SectionEyebrow } from "@/app/_components/ui/SectionEyebrow";
import { FLAGSHIP_RECOMENDACION } from "@/app/data/platformSnapshot";
import {
  NearbyMomentCardFull,
  nearbyMomentCardPropsFromRecomendacion,
} from "@/app/features/smart-notifications/components/NearbyMomentCardFull";

export function NearbyMomentsSection() {
  return (
    <section id="nearby-moments" className="relative py-28 sm:py-36">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <SectionEyebrow>Nearby Moments</SectionEyebrow>
            <h2 className={`mt-5 ${premium.h2}`}>
              El beneficio correcto, en el lugar correcto
            </h2>
            <p className={`mt-4 ${premium.lead}`}>
              Cada recomendación es un momento de compra: score IA, distancia,
              promoción y copy generado en tiempo real.
            </p>
            <Link
              href="/smart-notifications"
              className="mt-8 inline-flex text-sm font-semibold text-[#a5a0ff] transition hover:text-white"
            >
              Ver experiencia in-app →
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <NearbyMomentCardFull
              {...nearbyMomentCardPropsFromRecomendacion(FLAGSHIP_RECOMENDACION)}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
