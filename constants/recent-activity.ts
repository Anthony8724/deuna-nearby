import type { RecentActivityItem } from "@/types/recent-activity";
import { demoHero } from "@/constants/demo";

export const recentActivity: RecentActivityItem[] = [
  {
    id: "act-1",
    merchant: demoHero.merchantName,
    description: "Cappuccino + croissant",
    amount: -demoHero.paymentAmount,
    time: "10:24",
    emoji: "☕",
    type: "debit",
  },
  {
    id: "act-2",
    merchant: "Cashback DeUna Nearby",
    description: "Beneficio en comercio aliado",
    amount: demoHero.benefitAmount,
    time: "09:15",
    emoji: "✨",
    type: "credit",
  },
  {
    id: "act-3",
    merchant: "Metro Quito",
    description: "Pasaje transporte",
    amount: -0.45,
    time: "Ayer",
    emoji: "🚇",
    type: "debit",
  },
  {
    id: "act-4",
    merchant: "Recarga DeUna",
    description: "Desde Banco Pichincha ·••4521",
    amount: 50,
    time: "Ayer",
    emoji: "💳",
    type: "credit",
  },
];
