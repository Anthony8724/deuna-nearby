import type { ComercioCategoria } from "../../types";

const EMOJI: Record<ComercioCategoria, string> = {
  cafe_brunch: "☕",
  farmacia: "💊",
  supermercado: "🛒",
  restaurante: "🍽️",
  fitness: "💪",
  belleza: "✨",
  retail: "🛍️",
  combustible: "⛽",
  panaderia: "🥐",
};

export function categoryEmoji(categoria: ComercioCategoria): string {
  return EMOJI[categoria] ?? "🏪";
}
