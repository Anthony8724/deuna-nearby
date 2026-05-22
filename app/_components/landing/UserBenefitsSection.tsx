"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { premium } from "@/app/_components/ui/premium";
import { SectionEyebrow } from "@/app/_components/ui/SectionEyebrow";

import { USER_BENEFITS } from "./data";
import { PhoneMockup } from "./PhoneMockup";

export function UserBenefitsSection() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-20 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <PhoneMockup
              title="Tu café favorito"
              body="¡Hey! Tutto Café Lab tiene cashback 4%. Estás a un paso — pila, dale."
              negocio="Tutto Café Lab"
              beneficio="Cashback 4%"
            />
            <a
              href="#billetera-demo"
              className="mt-4 block text-center text-sm font-semibold text-[#a5a0ff] hover:text-white"
            >
              Probar la app interactiva ↑
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <SectionEyebrow>Usuarios</SectionEyebrow>
            <h2 className={`mt-5 ${premium.h2}`}>Beneficios para usuarios</h2>
            <p className={`mt-4 ${premium.lead}`}>
              Pagos DeUna + ubicación + IA = experiencia que se siente natural,
              no invasiva.
            </p>
            <ul className="mt-10 space-y-3">
              {USER_BENEFITS.map((benefit, i) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className={`flex items-start gap-3 ${premium.card} p-4`}
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/90" />
                  <span className="text-sm text-white/75">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
