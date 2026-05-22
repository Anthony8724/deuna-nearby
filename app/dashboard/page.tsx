import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard";
import { fetchDashboardData } from "@/lib/dashboard-api";

export const metadata: Metadata = {
  title: "Dashboard DeUna Nearby — Impacto",
  description:
    "Métricas de impacto, historial de compras y pitch del ecosistema DeUna Nearby.",
};

export default async function DashboardPage() {
  const data = await fetchDashboardData();

  return <DashboardView data={data} />;
}
