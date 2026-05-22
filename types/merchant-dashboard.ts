export type DashboardPeriod = "hoy" | "semana" | "mes";

export type MerchantKpi = {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
};

export type SalesDataPoint = {
  day: string;
  amount: number;
};

export type MerchantTransaction = {
  id: string;
  customer: string;
  amount: number;
  method: "QR Deuna" | "NFC" | "Wallet";
  time: string;
  status: "completed" | "pending" | "refunded";
};

export type MerchantDashboardData = {
  merchantId: string;
  merchantName: string;
  category: string;
  isOpen: boolean;
  rating: number;
  qrActive: boolean;
  kpis: MerchantKpi[];
  salesByDay: SalesDataPoint[];
  transactions: MerchantTransaction[];
};
