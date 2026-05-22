import type { MerchantDashboardData } from "@/types/merchant-dashboard";

export const cafeAuroraDashboard: MerchantDashboardData = {
  merchantId: "cafe-aurora",
  merchantName: "Café Aurora",
  category: "Gastronomía",
  isOpen: true,
  rating: 4.9,
  qrActive: true,
  kpis: [
    {
      id: "sales",
      label: "Ventas hoy",
      value: "$842.30",
      change: "+18.4%",
      trend: "up",
    },
    {
      id: "tx",
      label: "Transacciones",
      value: "47",
      change: "+12",
      trend: "up",
    },
    {
      id: "ticket",
      label: "Ticket promedio",
      value: "$17.92",
      change: "+3.1%",
      trend: "up",
    },
    {
      id: "customers",
      label: "Clientes nuevos",
      value: "23",
      change: "+5",
      trend: "up",
    },
  ],
  salesByDay: [
    { day: "Lun", amount: 620 },
    { day: "Mar", amount: 710 },
    { day: "Mié", amount: 540 },
    { day: "Jue", amount: 890 },
    { day: "Vie", amount: 1240 },
    { day: "Sáb", amount: 1580 },
    { day: "Dom", amount: 842 },
  ],
  transactions: [
    {
      id: "tx-001",
      customer: "María G.",
      amount: 24.5,
      method: "QR Deuna",
      time: "Hace 2 min",
      status: "completed",
    },
    {
      id: "tx-002",
      customer: "Carlos R.",
      amount: 18.0,
      method: "NFC",
      time: "Hace 14 min",
      status: "completed",
    },
    {
      id: "tx-003",
      customer: "Ana P.",
      amount: 4.5,
      method: "QR Deuna",
      time: "Hace 28 min",
      status: "completed",
    },
    {
      id: "tx-004",
      customer: "Luis M.",
      amount: 12.0,
      method: "Wallet",
      time: "Hace 45 min",
      status: "pending",
    },
    {
      id: "tx-005",
      customer: "Sofía T.",
      amount: 41.2,
      method: "QR Deuna",
      time: "Hace 1 h",
      status: "completed",
    },
    {
      id: "tx-006",
      customer: "Pedro V.",
      amount: 8.5,
      method: "NFC",
      time: "Hace 2 h",
      status: "refunded",
    },
  ],
};

export function getMerchantDashboard(
  merchantId: string = "cafe-aurora",
): MerchantDashboardData | null {
  if (merchantId === "cafe-aurora") return cafeAuroraDashboard;
  return cafeAuroraDashboard;
}
