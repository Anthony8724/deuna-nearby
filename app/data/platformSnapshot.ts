/**
 * Snapshot unificado del producto DeUna Nearby — fuente de verdad para demos
 * (landing, dashboard merchant, marketing). Alineado al catálogo mx-001…mx-019.
 */

import { MERCHANTS_CATALOG } from "@/app/features/smart-notifications/data/merchantsCatalog";
import type { Recomendacion } from "@/app/features/smart-notifications/types";

export const FLAGSHIP_MERCHANT_ID = "mx-001";

export const PLATFORM = {
  nombre: "DeUna Nearby",
  tagline: "Promos y beneficios en el momento justo — a pocos pasos.",
  mercado: "Ecuador",
  expansion: "LATAM 2026",
  comerciosAfiliados: MERCHANTS_CATALOG.length,
  usuariosActivos: 342_800,
  ventasAtribuidasUsd: 2_410_000,
  matchIaPromedio: 0.89,
  roiPromociones: 4.8,
} as const;

export type PlatformMetric = {
  value: string;
  label: string;
  sub: string;
  delta?: string;
};

export const PLATFORM_HERO_METRICS: PlatformMetric[] = [
  {
    value: "$2.4M+",
    label: "Ventas atribuidas",
    sub: "red afiliados · 2025",
    delta: "+34% YoY",
  },
  {
    value: "342K",
    label: "Usuarios activos",
    sub: "Ecuador · Quito metro",
    delta: "+18% trim.",
  },
  {
    value: "89%",
    label: "Match IA promedio",
    sub: "Cerca · contextual",
    delta: "vs. 61% baseline",
  },
  {
    value: "4.8×",
    label: "ROI promociones",
    sub: "push contextual vs. masivo",
    delta: "A/B 90 días",
  },
];

/** KPIs del comercio flagship — sincronizados con dashboard/data */
export const FLAGSHIP_MERCHANT_KPIS = {
  usuariosImpactados: 12_840,
  usuariosImpactadosDelta: 18.4,
  conversiones: 1_284,
  conversionesDelta: 12.2,
  promocionesActivadas: 3,
  ctr: 4.82,
  ctrDelta: 0.6,
  ventasGeneradasUsd: 48_920,
  ventasDelta: 22.5,
  matchIaPromedio: 0.74,
  scoreEfectividadIa: 87,
} as const;

const flagshipCatalog = MERCHANTS_CATALOG.find(
  (m) => m.id === FLAGSHIP_MERCHANT_ID,
)!;

/**
 * Recomendación enriquecida para marketing (Sweet & Coffee).
 * Coherente con scoring 45/35/20 del motor en vivo.
 */
export const FLAGSHIP_RECOMENDACION: Recomendacion = {
  id: flagshipCatalog.id,
  slug: flagshipCatalog.slug,
  nombre: flagshipCatalog.nombreComercial,
  nombreComercial: flagshipCatalog.nombreComercial,
  categoria: flagshipCatalog.categoria,
  direccionCorta: flagshipCatalog.direccionCorta,
  latitude: -0.1782,
  longitude: -78.4775,
  distanciaMetros: 95,
  tienePromocionActiva: true,
  promocion: {
    id: "promo-sc-2x1",
    titulo: "2x1 en bebidas calientes",
    tipo: "2x1",
    valor: 100,
    vigenteHasta: "2026-06-30T23:59:59.000Z",
    canal: "push",
  },
  transaccionesUsuario: 18,
  transaccionesUltimos30Dias: 8,
  ticketPromedioUsd: flagshipCatalog.ticketPromedioUsd,
  rating: flagshipCatalog.rating,
  partnerDeuna: true,
  score: 0.82,
  desgloseScore: {
    proximidad: 0.91,
    frecuencia: 0.78,
    promocion: 1,
  },
  razonDestacada:
    "Café & brunch · a 95 m de tu ubicación · 8 pagos en 30 días",
};

export const FLAGSHIP_PUSH_PREVIEW = {
  title: "☕ Tu café favorito está cerca",
  body: "María, Sweet & Coffee tiene 2x1 en bebidas. Estás a 95 m — échale un vistazo.",
  negocio: flagshipCatalog.nombreComercial,
  beneficio: "2x1 en bebidas calientes",
} as const;

export const INVESTOR_HIGHLIGHTS = [
  {
    metric: "19",
    unit: "comercios",
    label: "Red piloto Quito/Valle",
  },
  {
    metric: "<200ms",
    unit: "p95",
    label: "Pipeline recomendación",
  },
  {
    metric: "20 min",
    unit: "cooldown",
    label: "Anti-spam notificaciones",
  },
] as const;
