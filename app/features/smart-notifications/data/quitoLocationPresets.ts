import type { UserLocation } from "../types";

export type QuitoLocationPreset = {
  id: string;
  label: string;
  zona: string;
  location: UserLocation;
};

/** Puntos de anclaje reales en el área metropolitana de Quito */
export const QUITO_LOCATION_PRESETS: QuitoLocationPreset[] = [
  {
    id: "centro-historico",
    label: "Centro histórico",
    zona: "Quito colonial",
    location: { latitude: -0.2207, longitude: -78.5125 },
  },
  {
    id: "la-mariscal",
    label: "La Mariscal",
    zona: "Turismo & gastronomía",
    location: { latitude: -0.2015, longitude: -78.495 },
  },
  {
    id: "amazonas",
    label: "Av. Amazonas",
    zona: "Corredor financiero",
    location: { latitude: -0.178, longitude: -78.478 },
  },
  {
    id: "cumbaya",
    label: "Cumbayá",
    zona: "Valle de Tumbaco",
    location: { latitude: -0.1969, longitude: -78.4412 },
  },
  {
    id: "quitumbe",
    label: "Quitumbe",
    zona: "Terminal sur",
    location: { latitude: -0.2564, longitude: -78.5481 },
  },
  {
    id: "norte-calderon",
    label: "Calderón",
    zona: "Norte Quito",
    location: { latitude: -0.1098, longitude: -78.4421 },
  },
];

export const DEFAULT_SIMULATED_LOCATION: UserLocation =
  QUITO_LOCATION_PRESETS[2].location;
