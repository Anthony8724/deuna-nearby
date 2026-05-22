"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  DollarSign,
  Menu,
  MousePointerClick,
  Sparkles,
  Tag,
  Target,
  Users,
} from "lucide-react";
import { useState } from "react";

import { formatUsd } from "@/app/lib/format";

import {
  ACTIVE_PROMOTIONS,
  CONVERSIONS_BY_DAY,
  HEAT_ZONES,
  KPI_SNAPSHOT,
  MERCHANT_PROFILE,
  PEAK_HOURS,
  TOP_CUSTOMERS,
} from "./data/merchantAnalytics";
import { AIScoreGauge } from "./_components/AIScoreGauge";
import { ConversionsChart } from "./_components/ConversionsChart";
import { DashboardBadgePill } from "./_components/DashboardBadge";
import { DashboardSidebar } from "./_components/DashboardSidebar";
import { HeatZoneMap } from "./_components/HeatZoneMap";
import { MetricCard } from "./_components/MetricCard";
import { PeakHoursChart } from "./_components/PeakHoursChart";
import { PromotionsTable } from "./_components/PromotionsTable";
import { TopCustomersTable } from "./_components/TopCustomersTable";

export function MerchantDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const kpi = KPI_SNAPSHOT;

  return (
    <div className="flex min-h-screen bg-[#f6f9fc]">
      <DashboardSidebar
        merchant={MERCHANT_PROFILE}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col lg:pl-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200/80 bg-white/85 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg border border-zinc-200 p-2 lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold tracking-[-0.02em] text-zinc-900">
                Resumen
              </h1>
              <p className="text-xs text-zinc-500">
                Últimos 7 días · {MERCHANT_PROFILE.zona}
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            {MERCHANT_PROFILE.badges.map((b) => (
              <DashboardBadgePill key={b} badge={b} />
            ))}
          </div>
        </header>

        <main className="flex-1 space-y-6 p-4 sm:p-8">
          {/* KPIs */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Usuarios impactados"
              value={kpi.usuariosImpactados.toLocaleString("es-EC")}
              delta={kpi.usuariosImpactadosDelta}
              icon={Users}
              delay={0}
            />
            <MetricCard
              label="Conversiones"
              value={kpi.conversiones.toLocaleString("es-EC")}
              delta={kpi.conversionesDelta}
              sub={`${((kpi.conversiones / kpi.usuariosImpactados) * 100).toFixed(1)}% tasa`}
              icon={Target}
              delay={0.05}
            />
            <MetricCard
              label="CTR notificaciones"
              value={`${kpi.ctr}%`}
              delta={kpi.ctrDelta}
              icon={MousePointerClick}
              delay={0.1}
            />
            <MetricCard
              label="Ventas generadas"
              value={formatUsd(kpi.ventasGeneradasUsd)}
              delta={kpi.ventasDelta}
              icon={DollarSign}
              delay={0.15}
            />
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              label="Promociones activadas"
              value={String(kpi.promocionesActivadas)}
              sub="campañas en curso"
              icon={Tag}
              delay={0.2}
            />
            <MetricCard
              label="Match IA promedio"
              value={`${(kpi.matchIaPromedio * 100).toFixed(0)}%`}
              sub="score Radar DeUna"
              icon={Sparkles}
              delay={0.25}
            />
            <div className="sm:col-span-2 lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="h-full rounded-xl border border-zinc-200/70 bg-white p-5 shadow-stripe"
              >
                <AIScoreGauge
                  score={kpi.scoreEfectividadIa}
                  matchIa={kpi.matchIaPromedio}
                />
              </motion.div>
            </div>
          </section>

          {/* Gráficos */}
          <section className="grid gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-xl border border-zinc-200/70 bg-white p-5 shadow-stripe sm:p-6"
            >
              <h2 className="text-base font-semibold text-zinc-900">
                Conversiones por día
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Notificaciones push → visita al comercio
              </p>
              <div className="mt-4">
                <ConversionsChart data={CONVERSIONS_BY_DAY} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-xl border border-zinc-200/70 bg-white p-5 shadow-stripe sm:p-6"
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-zinc-400" />
                <h2 className="text-base font-semibold text-zinc-900">
                  Horarios pico
                </h2>
              </div>
              <p className="mt-1 text-sm text-zinc-500">
                Transacciones DeUna por franja horaria
              </p>
              <div className="mt-4">
                <PeakHoursChart data={PEAK_HOURS} />
              </div>
            </motion.div>
          </section>

          {/* Mapa calor + clientes */}
          <section className="grid gap-6 lg:grid-cols-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm sm:p-6 lg:col-span-3"
            >
              <h2 className="text-base font-semibold text-zinc-900">
                Zonas calientes · Quito
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Densidad de usuarios impactados por corredor
              </p>
              <div className="mt-5">
                <HeatZoneMap zones={HEAT_ZONES} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2"
            >
              <h2 className="text-base font-semibold text-zinc-900">
                Top clientes frecuentes
              </h2>
              <p className="mt-1 text-sm text-zinc-500">Últimos 30 días</p>
              <div className="mt-4">
                <TopCustomersTable customers={TOP_CUSTOMERS} />
              </div>
            </motion.div>
          </section>

          {/* Tabla promociones */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-zinc-200/70 bg-white p-5 shadow-stripe sm:p-6"
          >
            <h2 className="text-base font-semibold text-zinc-900">
              Promociones activas
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Rendimiento por campaña en Radar DeUna
            </p>
            <div className="mt-5">
              <PromotionsTable promotions={ACTIVE_PROMOTIONS} />
            </div>
          </motion.section>
        </main>
      </div>
    </div>
  );
}
