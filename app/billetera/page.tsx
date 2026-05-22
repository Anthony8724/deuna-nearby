import type { Metadata } from "next";

import { DeunaWalletApp } from "@/components/home/deuna-wallet-app";

export const metadata: Metadata = {
  title: "DeUna — Billetera",
  description:
    "Paga, transfiere y descubre comercios con beneficios exclusivos cerca de ti.",
};

export default function BilleteraPage() {
  return <DeunaWalletApp variant="page" />;
}
