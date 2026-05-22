/**
 * Comercios fijos de la sección "Cerca de ti" (diseño app principal).
 * Las recomendaciones inteligentes se añaden después en el carrusel.
 */
export type CercaDeTiBaselineMerchant = {
  id: string;
  nombre: string;
  distanciaMetros: number;
  afinidadPct: number;
  beneficio: string;
  /** Gradiente Tailwind para simular foto del local */
  imageGradient: string;
  imageEmoji: string;
};

export const CERCA_DE_TI_BASELINE_MERCHANTS: CercaDeTiBaselineMerchant[] = [
  {
    id: "baseline-burger-factory",
    nombre: "Burger Factory",
    distanciaMetros: 250,
    afinidadPct: 92,
    beneficio: "15% beneficio DeUna",
    imageGradient: "from-amber-700 via-orange-600 to-amber-800",
    imageEmoji: "🍔",
  },
  {
    id: "baseline-cafe-central",
    nombre: "Café Central",
    distanciaMetros: 180,
    afinidadPct: 88,
    beneficio: "2x puntos hoy",
    imageGradient: "from-amber-900 via-amber-700 to-yellow-800",
    imageEmoji: "☕",
  },
];
