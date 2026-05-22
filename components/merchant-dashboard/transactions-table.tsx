"use client";

import { motion } from "framer-motion";
import type { MerchantTransaction } from "@/types/merchant-dashboard";
import { useMerchantDashboard } from "@/context/merchant-dashboard-context";
import { nativeCardStagger, nativeSpring } from "@/lib/home-motion";

const statusStyles = {
  completed: "text-[#5D21D0] bg-[#5D21D0]/10",
  pending: "text-amber-600 bg-amber-50",
  refunded: "text-[#6B7280] bg-[#F3F4F6]",
};

const statusLabels = {
  completed: "Completado",
  pending: "Pendiente",
  refunded: "Reembolsado",
};

export function TransactionsTable({
  transactions,
  highlightId,
}: {
  transactions: MerchantTransaction[];
  highlightId?: string;
}) {
  const { showAllTransactions, setShowAllTransactions } = useMerchantDashboard();
  const visible = showAllTransactions ? transactions : transactions.slice(0, 4);

  return (
    <div className="rounded-xl border border-black/[0.05] bg-white shadow-md">
      <div className="flex items-center justify-between border-b border-black/[0.05] px-4 py-4">
        <div>
          <h2 className="text-base font-bold text-[#1E1E1E]">Transacciones recientes</h2>
          <p className="mt-0.5 text-xs text-[#6B7280]">
            {showAllTransactions
              ? `${transactions.length} movimientos`
              : "Últimos movimientos del día"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAllTransactions(!showAllTransactions)}
          className="text-xs font-semibold text-[#5D21D0]"
        >
          {showAllTransactions ? "Ver menos" : "Ver todas"}
        </button>
      </div>

      <ul className="divide-y divide-black/[0.04]">
        {visible.map((tx, i) => {
          const isHighlighted = highlightId === tx.id;
          return (
            <motion.li
              key={tx.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, ...nativeSpring }}
              className={`px-4 py-3.5 ${isHighlighted ? "highlight-row-merchant bg-[#5D21D0]/[0.06]" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#1E1E1E]">
                    {tx.customer}
                  </p>
                  <p className="mt-0.5 text-xs text-[#6B7280]">
                    {tx.method} · {tx.time}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-balance text-sm font-bold text-[#5D21D0]">
                    ${tx.amount.toFixed(2)}
                  </p>
                  <span
                    className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold ${statusStyles[tx.status]}`}
                  >
                    {statusLabels[tx.status]}
                  </span>
                </div>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
