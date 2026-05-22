import { contextualReasonSheet } from "./nearbyCopy";
import type { Recomendacion } from "../types";

/**
 * Razón contextual para UI (tono conversacional).
 */
export function buildRazonIA(recomendacion: Recomendacion): string {
  return contextualReasonSheet(recomendacion);
}
