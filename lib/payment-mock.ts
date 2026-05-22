import { homeUser } from "@/constants/home";
import type { NearbyMoment } from "@/types/nearby-moment";
import type {
  MerchantDashboardData,
  MerchantTransaction,
} from "@/types/merchant-dashboard";
import type { CompletedPayment } from "@/types/payment";

export type PaymentDetails = {
  amount: number;
  benefitPercent: number;
  benefitAmount: number;
  netDebit: number;
  benefitLabel: string;
};

export function computePaymentDetails(moment: NearbyMoment): PaymentDetails {
  const amount = moment.paymentAmount ?? 12;
  const benefitPercent = moment.benefitPercent ?? 15;
  const benefitAmount =
    Math.round(amount * (benefitPercent / 100) * 100) / 100;
  const netDebit = Math.round((amount - benefitAmount) * 100) / 100;

  return {
    amount,
    benefitPercent,
    benefitAmount,
    netDebit,
    benefitLabel: moment.benefit ?? `${benefitPercent}%`,
  };
}

export function createCompletedPayment(
  moment: NearbyMoment,
  details: PaymentDetails,
): CompletedPayment {
  return {
    id: `tx-nearby-${Date.now()}`,
    momentId: moment.id,
    merchantId: moment.merchantId ?? "cafe-aurora",
    merchantName: moment.merchantName ?? "Comercio",
    amount: details.amount,
    benefitAmount: details.benefitAmount,
    benefitLabel: details.benefitLabel,
    aiInsight: moment.aiInsight,
    completedAt: Date.now(),
  };
}

export function createMerchantTransaction(
  payment: CompletedPayment,
): MerchantTransaction {
  return {
    id: payment.id,
    customer: `${homeUser.firstName} A.`,
    amount: payment.amount,
    method: "QR Deuna",
    time: "Ahora",
    status: "completed",
  };
}

function parseMoney(value: string): number {
  return parseFloat(value.replace(/[$,]/g, ""));
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export function mergeDashboardWithPayment(
  base: MerchantDashboardData,
  payments: CompletedPayment[],
): MerchantDashboardData {
  const relevant = payments.filter((p) => p.merchantId === base.merchantId);
  if (relevant.length === 0) return base;

  const totalSales = relevant.reduce((sum, p) => sum + p.amount, 0);
  const txCount = relevant.length;

  const salesKpi = base.kpis.find((k) => k.id === "sales");
  const txKpi = base.kpis.find((k) => k.id === "tx");
  const ticketKpi = base.kpis.find((k) => k.id === "ticket");

  const baseSales = salesKpi ? parseMoney(salesKpi.value) : 0;
  const baseTx = txKpi ? parseInt(txKpi.value, 10) : 0;
  const newSales = baseSales + totalSales;
  const newTx = baseTx + txCount;
  const newTicket = newTx > 0 ? newSales / newTx : 0;

  const newTransactions = [
    ...relevant.map(createMerchantTransaction).reverse(),
    ...base.transactions,
  ];

  const salesByDay = [...base.salesByDay];
  if (salesByDay.length > 0) {
    const last = salesByDay[salesByDay.length - 1];
    salesByDay[salesByDay.length - 1] = {
      ...last,
      amount: last.amount + totalSales,
    };
  }

  return {
    ...base,
    kpis: base.kpis.map((kpi) => {
      if (kpi.id === "sales") {
        return {
          ...kpi,
          value: formatMoney(newSales),
          change: `+${Math.round((totalSales / baseSales) * 100)}%`,
        };
      }
      if (kpi.id === "tx") {
        const baseChange = parseInt(kpi.change.replace(/\D/g, "") || "0", 10);
        return {
          ...kpi,
          value: String(newTx),
          change: `+${baseChange + txCount}`,
        };
      }
      if (kpi.id === "ticket") {
        return {
          ...kpi,
          value: formatMoney(newTicket),
        };
      }
      return kpi;
    }),
    salesByDay,
    transactions: newTransactions,
  };
}
