import type { Metadata } from "next";

import { MerchantDashboard } from "./MerchantDashboard";

export const metadata: Metadata = {
  title: "Dashboard · DeUna Nearby",
  description:
    "Métricas inteligentes para comercios afiliados: conversiones, promociones, zonas calientes y efectividad IA.",
};

export default function DashboardPage() {
  return <MerchantDashboard />;
}
