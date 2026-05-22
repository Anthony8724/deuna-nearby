import type { Metadata } from "next";

import { MerchantDashboard } from "@/app/dashboard/MerchantDashboard";

export const metadata: Metadata = {
  title: "Analytics · DeUna Nearby",
  description:
    "Métricas inteligentes para comercios afiliados: conversiones, promociones, zonas calientes y efectividad IA.",
};

export default function MerchantAnalyticsPage() {
  return <MerchantDashboard />;
}
