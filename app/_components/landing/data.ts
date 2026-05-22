export {
  PLATFORM,
  PLATFORM_HERO_METRICS as LANDING_METRICS,
  INVESTOR_HIGHLIGHTS,
} from "@/app/data/platformSnapshot";

export const AI_STEPS = [
  {
    step: "01",
    title: "Geolocalización precisa",
    description:
      "PostGIS + radio dinámico filtran candidatos reales. Sin ruido de comercios fuera de zona.",
    icon: "map" as const,
  },
  {
    step: "02",
    title: "Scoring inteligente",
    description:
      "Motor 45% proximidad · 35% historial DeUna · 20% promoción. Score explicable en dashboard.",
    icon: "brain" as const,
  },
  {
    step: "03",
    title: "Notificación IA",
    description:
      "GPT/Grok genera push en español ecuatoriano (<110 chars) con rate-limit anti-spam.",
    icon: "sparkles" as const,
  },
] as const;

export const USER_BENEFITS = [
  "Cashback y 2x1 cuando estás a menos de 500 m del comercio",
  "Máximo 1 notificación relevante cada 20 minutos",
  "Recomendaciones basadas en tus pagos previos con DeUna",
  "Copy personalizado (nombre, categoría favorita, horario)",
] as const;

export const MERCHANT_BENEFITS = [
  "Dashboard Stripe-like: CTR, conversiones, heatmap por corredor",
  "19+ comercios demo en catálogo Quito / Valle",
  "CRM de clientes VIP con ticket promedio y visitas 30d",
  "Score de efectividad IA por campaña y promoción",
] as const;
