import type { ComercioCategoria } from "../types";

export type UserAffinityProfile = {
  seed: number;
  categoriasPreferidas: ComercioCategoria[];
  multiplicadorFrecuencia: number;
};

const ALL_CATEGORIES: ComercioCategoria[] = [
  "cafe_brunch",
  "farmacia",
  "supermercado",
  "restaurante",
  "fitness",
  "belleza",
  "retail",
  "combustible",
  "panaderia",
];

function hashUserId(userId: string): number {
  let seed = 0;
  for (let i = 0; i < userId.length; i += 1) {
    seed = (seed * 31 + userId.charCodeAt(i)) >>> 0;
  }
  return seed;
}

/**
 * Perfil sintético de afinidad por usuario (simula segmentación CRM / RFM).
 */
export function buildUserAffinityProfile(userId: string): UserAffinityProfile {
  const seed = hashUserId(userId);
  const offset = seed % ALL_CATEGORIES.length;
  const categoriasPreferidas = [
    ALL_CATEGORIES[offset % ALL_CATEGORIES.length],
    ALL_CATEGORIES[(offset + 2) % ALL_CATEGORIES.length],
    ALL_CATEGORIES[(offset + 4) % ALL_CATEGORIES.length],
  ];
  const multiplicadorFrecuencia = 0.85 + (seed % 30) / 100;

  return { seed, categoriasPreferidas, multiplicadorFrecuencia };
}

export function isPreferredCategory(
  profile: UserAffinityProfile,
  categoria: ComercioCategoria,
): boolean {
  return profile.categoriasPreferidas.includes(categoria);
}
