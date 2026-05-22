"use client";

import { motion } from "framer-motion";
import { MerchantMobileHeader } from "./merchant-mobile-header";
import { StatCard } from "./stat-card";
import { SalesChart } from "./sales-chart";
import { TransactionsTable } from "./transactions-table";
import { QuickActions } from "./quick-actions";
import { QrStatusPanel } from "./qr-status-panel";
import { useMerchantDashboard } from "@/context/merchant-dashboard-context";
import { nativeStaggerContainer, nativeStaggerItem } from "@/lib/home-motion";

export function MerchantDashboardView({
  highlightTransactionId,
}: {
  highlightTransactionId?: string;
}) {
  const { data } = useMerchantDashboard();

  return (
    <div className="min-h-full bg-white">
      <MerchantMobileHeader />

      <motion.div
        variants={nativeStaggerContainer}
        initial="hidden"
        animate="show"
        className="px-5 pb-6 pt-5"
      >
        <motion.section id="panel" variants={nativeStaggerItem} className="grid grid-cols-2 gap-3">
          {data.kpis.map((kpi, i) => (
            <StatCard key={`${kpi.id}-${kpi.value}`} kpi={kpi} index={i} />
          ))}
        </motion.section>

        <motion.section id="ventas" variants={nativeStaggerItem} className="mt-5 scroll-mt-24">
          <SalesChart data={data.salesByDay} />
        </motion.section>

        <motion.section id="qr" variants={nativeStaggerItem} className="mt-5 scroll-mt-24">
          <QrStatusPanel active={data.qrActive} rating={data.rating} />
        </motion.section>

        <motion.section variants={nativeStaggerItem} className="mt-5">
          <QuickActions />
        </motion.section>

        <motion.section id="transacciones" variants={nativeStaggerItem} className="mt-5 scroll-mt-24">
          <TransactionsTable
            transactions={data.transactions}
            highlightId={highlightTransactionId}
          />
        </motion.section>
      </motion.div>
    </div>
  );
}
