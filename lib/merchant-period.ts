import type {
  DashboardPeriod,
  MerchantDashboardData,
  MerchantKpi,
} from "@/types/merchant-dashboard";

function parseMoney(value: string): number {
  return parseFloat(value.replace(/[$,]/g, "")) || 0;
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

const periodLabels: Record<DashboardPeriod, Record<string, string>> = {
  hoy: {
    sales: "Ventas hoy",
    tx: "Transacciones",
    ticket: "Ticket promedio",
    customers: "Clientes nuevos",
  },
  semana: {
    sales: "Ventas semana",
    tx: "Transacciones",
    ticket: "Ticket promedio",
    customers: "Clientes nuevos",
  },
  mes: {
    sales: "Ventas mes",
    tx: "Transacciones",
    ticket: "Ticket promedio",
    customers: "Clientes nuevos",
  },
};

export function applyDashboardPeriod(
  data: MerchantDashboardData,
  period: DashboardPeriod,
): MerchantDashboardData {
  if (period === "hoy") {
    return {
      ...data,
      kpis: data.kpis.map((kpi) => ({
        ...kpi,
        label: periodLabels.hoy[kpi.id] ?? kpi.label,
      })),
    };
  }

  const weekTotal = data.salesByDay.reduce((sum, d) => sum + d.amount, 0);
  const salesKpi = data.kpis.find((k) => k.id === "sales");
  const txKpi = data.kpis.find((k) => k.id === "tx");
  const baseSales = salesKpi ? parseMoney(salesKpi.value) : 0;
  const baseTx = txKpi ? parseInt(txKpi.value, 10) : 0;

  const multiplier = period === "semana" ? weekTotal / Math.max(baseSales, 1) : 4.2;
  const periodSales = period === "semana" ? weekTotal : baseSales * multiplier;
  const periodTx =
    period === "semana"
      ? Math.round(baseTx * 1.8)
      : Math.round(baseTx * multiplier * 0.85);
  const periodTicket = periodTx > 0 ? periodSales / periodTx : 0;
  const periodCustomers =
    period === "semana"
      ? Math.round(parseInt(data.kpis.find((k) => k.id === "customers")?.value ?? "0", 10) * 1.6)
      : Math.round(parseInt(data.kpis.find((k) => k.id === "customers")?.value ?? "0", 10) * 5.2);

  const kpis: MerchantKpi[] = data.kpis.map((kpi) => {
    const label = periodLabels[period][kpi.id] ?? kpi.label;
    if (kpi.id === "sales") {
      return { ...kpi, label, value: formatMoney(periodSales), change: kpi.change };
    }
    if (kpi.id === "tx") {
      return { ...kpi, label, value: String(periodTx), change: kpi.change };
    }
    if (kpi.id === "ticket") {
      return { ...kpi, label, value: formatMoney(periodTicket), change: kpi.change };
    }
    if (kpi.id === "customers") {
      return { ...kpi, label, value: String(periodCustomers), change: kpi.change };
    }
    return { ...kpi, label };
  });

  return {
    ...data,
    kpis,
    salesByDay:
      period === "mes"
        ? data.salesByDay.map((d, i) => ({
            ...d,
            amount: Math.round(d.amount * (1.1 + i * 0.08)),
          }))
        : data.salesByDay,
  };
}

export function buildTransactionsCsv(
  data: MerchantDashboardData,
  period: DashboardPeriod,
): string {
  const header = "Cliente,Monto,Metodo,Hora,Estado";
  const rows = data.transactions.map(
    (tx) =>
      `"${tx.customer}",${tx.amount.toFixed(2)},"${tx.method}","${tx.time}","${tx.status}"`,
  );
  return [`Periodo: ${period}`, header, ...rows].join("\n");
}

export function downloadTextFile(filename: string, content: string, mime = "text/csv") {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
