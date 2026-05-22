import {
  FLAGSHIP_MERCHANT_ID,
  FLAGSHIP_MERCHANT_KPIS,
} from "@/app/data/platformSnapshot";
import { MERCHANTS_CATALOG } from "@/app/features/smart-notifications/data/merchantsCatalog";

/** Dataset de analytics para comercio afiliado — demo MVP DeUna Nearby */

export type DashboardBadge = "high_conversion" | "trending" | "ai_optimized";

export type MerchantProfile = {
  id: string;
  nombreComercial: string;
  categoria: string;
  plan: "growth" | "enterprise";
  zona: string;
  badges: DashboardBadge[];
};

export type KpiSnapshot = {
  usuariosImpactados: number;
  usuariosImpactadosDelta: number;
  conversiones: number;
  conversionesDelta: number;
  promocionesActivadas: number;
  ctr: number;
  ctrDelta: number;
  ventasGeneradasUsd: number;
  ventasDelta: number;
  matchIaPromedio: number;
  scoreEfectividadIa: number;
};

export type ConversionDay = {
  fecha: string;
  impresiones: number;
  conversiones: number;
  ventasUsd: number;
};

export type PeakHour = {
  hora: string;
  transacciones: number;
  matchIa: number;
};

export type HeatZone = {
  id: string;
  zona: string;
  intensidad: number;
  usuarios: number;
  x: number;
  y: number;
};

export type ActivePromotion = {
  id: string;
  titulo: string;
  tipo: "descuento" | "cashback" | "2x1";
  valor: string;
  activaciones: number;
  ctr: number;
  estado: "activa" | "pausada";
  vigenteHasta: string;
};

export type FrequentCustomer = {
  id: string;
  alias: string;
  visitas30d: number;
  ticketPromedioUsd: number;
  ultimaVisita: string;
  segmento: "vip" | "regular" | "nuevo";
};

const flagship = MERCHANTS_CATALOG.find((m) => m.id === FLAGSHIP_MERCHANT_ID)!;

export const MERCHANT_PROFILE: MerchantProfile = {
  id: flagship.id,
  nombreComercial: flagship.nombreComercial,
  categoria: "Café & brunch",
  plan: "growth",
  zona: "Corredor Naciones Unidas · Av. Amazonas",
  badges: ["high_conversion", "trending", "ai_optimized"],
};

export const KPI_SNAPSHOT: KpiSnapshot = { ...FLAGSHIP_MERCHANT_KPIS };

export const CONVERSIONS_BY_DAY: ConversionDay[] = [
  { fecha: "Lun", impresiones: 1820, conversiones: 142, ventasUsd: 5120 },
  { fecha: "Mar", impresiones: 1950, conversiones: 168, ventasUsd: 5980 },
  { fecha: "Mié", impresiones: 2100, conversiones: 195, ventasUsd: 7120 },
  { fecha: "Jue", impresiones: 1980, conversiones: 178, ventasUsd: 6450 },
  { fecha: "Vie", impresiones: 2450, conversiones: 248, ventasUsd: 8920 },
  { fecha: "Sáb", impresiones: 2680, conversiones: 198, ventasUsd: 7340 },
  { fecha: "Dom", impresiones: 1860, conversiones: 155, ventasUsd: 4990 },
];

export const PEAK_HOURS: PeakHour[] = [
  { hora: "07h", transacciones: 42, matchIa: 0.68 },
  { hora: "08h", transacciones: 98, matchIa: 0.79 },
  { hora: "09h", transacciones: 124, matchIa: 0.82 },
  { hora: "10h", transacciones: 86, matchIa: 0.71 },
  { hora: "12h", transacciones: 72, matchIa: 0.65 },
  { hora: "13h", transacciones: 58, matchIa: 0.62 },
  { hora: "17h", transacciones: 64, matchIa: 0.7 },
  { hora: "18h", transacciones: 91, matchIa: 0.76 },
];

export const HEAT_ZONES: HeatZone[] = [
  { id: "z1", zona: "Naciones Unidas", intensidad: 0.95, usuarios: 4200, x: 2, y: 1 },
  { id: "z2", zona: "El Bosque", intensidad: 0.72, usuarios: 2100, x: 1, y: 2 },
  { id: "z3", zona: "Amazonas", intensidad: 0.58, usuarios: 1800, x: 3, y: 2 },
  { id: "z4", zona: "La Mariscal", intensidad: 0.45, usuarios: 1200, x: 2, y: 3 },
  { id: "z5", zona: "Cumbayá", intensidad: 0.32, usuarios: 890, x: 4, y: 1 },
  { id: "z6", zona: "6 de Diciembre", intensidad: 0.28, usuarios: 650, x: 1, y: 1 },
];

export const ACTIVE_PROMOTIONS: ActivePromotion[] = [
  {
    id: "promo-sc-2x1",
    titulo: "2x1 en bebidas calientes",
    tipo: "2x1",
    valor: "100%",
    activaciones: 842,
    ctr: 6.2,
    estado: "activa",
    vigenteHasta: "30 jun 2026",
  },
  {
    id: "promo-sc-cb",
    titulo: "Cashback 4% fin de semana",
    tipo: "cashback",
    valor: "4%",
    activaciones: 312,
    ctr: 3.8,
    estado: "activa",
    vigenteHasta: "15 jul 2026",
  },
  {
    id: "promo-sc-am",
    titulo: "15% desayuno ejecutivo",
    tipo: "descuento",
    valor: "15%",
    activaciones: 130,
    ctr: 2.9,
    estado: "pausada",
    vigenteHasta: "—",
  },
];

export const TOP_CUSTOMERS: FrequentCustomer[] = [
  {
    id: "c1",
    alias: "María V.",
    visitas30d: 14,
    ticketPromedioUsd: 9.2,
    ultimaVisita: "Hace 2 h",
    segmento: "vip",
  },
  {
    id: "c2",
    alias: "Carlos R.",
    visitas30d: 11,
    ticketPromedioUsd: 11.5,
    ultimaVisita: "Ayer",
    segmento: "vip",
  },
  {
    id: "c3",
    alias: "Ana P.",
    visitas30d: 8,
    ticketPromedioUsd: 7.8,
    ultimaVisita: "Hace 3 días",
    segmento: "regular",
  },
  {
    id: "c4",
    alias: "Luis M.",
    visitas30d: 6,
    ticketPromedioUsd: 12.1,
    ultimaVisita: "Hace 5 días",
    segmento: "regular",
  },
  {
    id: "c5",
    alias: "Sofía T.",
    visitas30d: 4,
    ticketPromedioUsd: 8.4,
    ultimaVisita: "Esta semana",
    segmento: "nuevo",
  },
];
