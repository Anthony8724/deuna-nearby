import type { Metadata } from "next";
import { MerchantDashboardLive } from "@/components/merchant-dashboard/merchant-dashboard-live";
import { getMerchantDashboard } from "@/constants/merchant-dashboard";

export const metadata: Metadata = {
  title: "Dashboard — Café Aurora | Deuna Nearby",
  description: "Panel de ventas, transacciones y cobros QR para comercios aliados.",
};

type PageProps = {
  searchParams: Promise<{ merchant?: string; highlight?: string }>;
};

export default async function MerchantDashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const data = getMerchantDashboard(params.merchant ?? "cafe-aurora");

  if (!data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6 text-[#6B7280]">
        Comercio no encontrado.
      </div>
    );
  }

  return (
    <MerchantDashboardLive data={data} highlightId={params.highlight} />
  );
}
