"use client";

import { motion } from "framer-motion";
import {
  Layers,
  ShoppingBag,
  Tag,
  Users,
} from "lucide-react";
import type { DashboardData } from "@/types/dashboard";
import { DashboardHeader } from "./DashboardHeader";
import { MetricCard } from "./MetricCard";
import { HistoryChart } from "./HistoryChart";
import { ImpactCard } from "./ImpactCard";
import { SummaryPanel } from "./SummaryPanel";
import { PitchSection } from "./PitchSection";

type DashboardViewProps = {
  data: DashboardData;
};

export function DashboardView({ data }: DashboardViewProps) {
  const { summary, history, promotions, source } = data;

  return (
    <div className="min-h-dvh bg-[#F8F9FA]">
      <DashboardHeader feature={summary.feature} source={source} />

      <main className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <MetricCard
            label="Usuarios activados"
            value={summary.usersActivated}
            icon={Users}
            hint="Usuarios con recomendaciones Nearby"
          />
          <MetricCard
            label="Negocios recomendados"
            value={summary.businessesRecommended}
            icon={ShoppingBag}
            hint="Comercios en el radio inteligente"
          />
          <MetricCard
            label="Categoría dominante"
            value={summary.mainCategory}
            icon={Layers}
            hint="Patrón detectado en el historial"
          />
          <MetricCard
            label="Promociones activas"
            value={promotions.length}
            icon={Tag}
            hint="Beneficios disponibles hoy"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="mt-4"
        >
          <ImpactCard impact={summary.impact} />
        </motion.div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <HistoryChart history={history} />
          <SummaryPanel summary={summary} promotions={promotions} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12 }}
          className="mt-6"
        >
          <PitchSection />
        </motion.div>
      </main>
    </div>
  );
}
