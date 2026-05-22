import { formatBeneficioFromRecomendacion } from "./beneficios";
import { formatScorePct } from "./format";
import type { Recomendacion } from "../types";
import { categoryEmoji } from "../components/integrated/categoryEmoji";

export type CercaDeTiCardModel = {
  id: string;
  nombre: string;
  distanciaMetros: number;
  afinidadLabel: string;
  beneficio: string;
  imageGradient: string;
  imageEmoji: string;
  /** Recomendación del motor (solo cards inteligentes) */
  recomendacion?: Recomendacion;
};

const GRADIENT_BY_CATEGORY: Partial<Record<string, string>> = {
  cafe_brunch: "from-amber-900 via-amber-700 to-yellow-800",
  restaurante: "from-amber-700 via-orange-600 to-amber-800",
  farmacia: "from-emerald-700 via-teal-600 to-emerald-800",
  supermercado: "from-blue-700 via-indigo-600 to-blue-800",
  panaderia: "from-orange-600 via-amber-500 to-orange-700",
  fitness: "from-violet-700 via-purple-600 to-violet-800",
  belleza: "from-pink-600 via-rose-500 to-pink-700",
  retail: "from-slate-600 via-zinc-500 to-slate-700",
  combustible: "from-gray-700 via-zinc-600 to-gray-800",
};

/** Copy de beneficio alineado al diseño DeUna ("15% beneficio DeUna", "2x puntos hoy") */
export function beneficioCercaDeTiLine(rec: Recomendacion): string {
  const promo = rec.promocion;
  if (promo) {
    switch (promo.tipo) {
      case "descuento":
        return `${promo.valor}% beneficio DeUna`;
      case "cashback":
        return `${promo.valor}% cashback DeUna`;
      case "2x1":
        return "2x puntos hoy";
      case "envio_gratis":
        return "Envío gratis DeUna";
      default:
        return promo.titulo;
    }
  }
  return formatBeneficioFromRecomendacion(rec).texto;
}

export function recomendacionToCercaDeTiCard(rec: Recomendacion): CercaDeTiCardModel {
  const gradient =
    GRADIENT_BY_CATEGORY[rec.categoria] ??
    "from-[#5D2A8E]/80 via-[#7C3AED]/70 to-[#5D2A8E]/90";

  return {
    id: rec.id,
    nombre: rec.nombreComercial,
    distanciaMetros: rec.distanciaMetros,
    afinidadLabel: `${formatScorePct(rec.score)} afinidad`,
    beneficio: beneficioCercaDeTiLine(rec),
    imageGradient: gradient,
    imageEmoji: categoryEmoji(rec.categoria),
    recomendacion: rec,
  };
}
