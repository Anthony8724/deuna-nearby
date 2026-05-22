import { PLATFORM } from "@/app/data/platformSnapshot";

/** Perfil de demostración Radar DeUna (alineado con segmentación CRM simulada) */
export const DEMO_USER = {
  id: "usr_demo_maria_quito_2026",
  nombre: "Ana",
  apellido: "Vega",
  segmento: "high_value_urban",
  ciudad: PLATFORM.mercado,
} as const;

export const DEMO_SCORE_THRESHOLD = 0.55;
