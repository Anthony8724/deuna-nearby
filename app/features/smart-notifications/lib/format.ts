import type { ComercioCategoria } from "../types";

const CATEGORIA_LABELS: Record<ComercioCategoria, string> = {
  cafe_brunch: "Café & brunch",
  farmacia: "Farmacia",
  supermercado: "Supermercado",
  restaurante: "Restaurante",
  fitness: "Fitness & wellness",
  belleza: "Belleza",
  retail: "Retail",
  combustible: "Combustible",
  panaderia: "Panadería",
};

export function formatCategoria(categoria: ComercioCategoria): string {
  return CATEGORIA_LABELS[categoria];
}

export function formatDistancia(metros: number): string {
  if (metros < 1000) return `${metros} m`;
  return `${(metros / 1000).toFixed(1)} km`;
}

export function formatCoord(value: number, decimals = 5): string {
  return value.toFixed(decimals);
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatScorePct(score: number): string {
  return `${Math.round(score * 100)}%`;
}
