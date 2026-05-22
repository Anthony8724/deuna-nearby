"use client";

import { motion } from "framer-motion";
import { BarChart3, Store, Tag, Users } from "lucide-react";
import Link from "next/link";

import { premium } from "@/app/_components/ui/premium";
import { SectionEyebrow } from "@/app/_components/ui/SectionEyebrow";

import { MERCHANT_BENEFITS } from "./data";

const FEATURES = [
  { icon: BarChart3, title: "Analytics en tiempo real" },
  { icon: Tag, title: "Campañas self-service" },
  { icon: Users, title: "CRM de clientes frecuentes" },
  { icon: Store, title: "Red de 19+ comercios demo" },
];

export function MerchantBenefitsSection() {
  return (
    <section id="comercios" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <SectionEyebrow className="mx-auto">Merchants</SectionEyebrow>
          <h2 className={`mt-5 ${premium.h2}`}>Beneficios para comercios</h2>
          <p className={`mx-auto mt-4 max-w-2xl ${premium.lead}`}>
            Convierte tráfico cercano en ventas medibles. Dashboard estilo
            Stripe para tu equipo comercial.
          </p>
        </motion.div>
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`${premium.card} p-6 text-center`}
            >
              <f.icon className="mx-auto h-7 w-7 text-white/70" strokeWidth={1.5} />
              <p className="mt-4 text-sm font-medium text-white/85">{f.title}</p>
            </motion.div>
          ))}
        </div>
        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto mt-14 grid max-w-3xl gap-2 sm:grid-cols-2"
        >
          {MERCHANT_BENEFITS.map((b) => (
            <li key={b} className={`flex items-center gap-2.5 ${premium.body}`}>
              <span className="h-1 w-1 rounded-full bg-white/40" />
              {b}
            </li>
          ))}
        </motion.ul>
        <div className="mt-12 text-center">
          <Link href="/dashboard" className={premium.btnSecondary}>
            Ver dashboard merchant →
          </Link>
        </div>
      </div>
    </section>
  );
}
