import type { Metadata } from "next";

import { LandingPage } from "@/app/_components/landing/LandingPage";

export const metadata: Metadata = {
  title: "DeUna Nearby — Demo unificada",
  description:
    "Promos y beneficios en el momento justo. Landing, radar, billetera, comercio e impacto conectados al backend.",
};

export default function LandingRoutePage() {
  return <LandingPage />;
}
