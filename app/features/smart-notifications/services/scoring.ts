import { calculateDistance } from "../lib/geo";
import { formatCategoria } from "../lib/format";
import type {
  ComercioCandidato,
  Recomendacion,
  RecomendacionScoreBreakdown,
} from "../types";

export const SCORE_WEIGHTS = {
  proximidad: 0.45,
  frecuencia: 0.35,
  promocion: 0.2,
} as const;

function scoreProximidad(distanciaMetros: number, radiusMeters: number): number {
  if (radiusMeters <= 0) return 0;
  if (distanciaMetros >= radiusMeters) return 0;
  return 1 - distanciaMetros / radiusMeters;
}

function scoreFrecuencia(
  transaccionesUsuario: number,
  maxTransaccionesEnLote: number,
): number {
  if (maxTransaccionesEnLote <= 0) return 0;
  return Math.min(transaccionesUsuario / maxTransaccionesEnLote, 1);
}

function scorePromocion(tienePromocionActiva: boolean): number {
  return tienePromocionActiva ? 1 : 0;
}

function buildRazonDestacada(
  comercio: ComercioCandidato,
  desglose: RecomendacionScoreBreakdown,
  distanciaMetros: number,
): string {
  const factores: Array<{ peso: number; texto: string }> = [
    {
      peso: desglose.proximidad,
      texto: `a ${distanciaMetros} m de tu ubicación`,
    },
    {
      peso: desglose.frecuencia,
      texto: `${comercio.transaccionesUltimos30Dias} visitas en 30 días`,
    },
    {
      peso: desglose.promocion,
      texto: comercio.promocion?.titulo ?? "sin promo activa",
    },
  ];

  const principal = [...factores].sort((a, b) => b.peso - a.peso)[0];
  return `${formatCategoria(comercio.categoria)} · ${principal.texto}`;
}

export function computeWeightedScore(
  distanciaMetros: number,
  radiusMeters: number,
  transaccionesUsuario: number,
  maxTransaccionesEnLote: number,
  tienePromocionActiva: boolean,
): { score: number; desgloseScore: RecomendacionScoreBreakdown } {
  const desgloseScore: RecomendacionScoreBreakdown = {
    proximidad: scoreProximidad(distanciaMetros, radiusMeters),
    frecuencia: scoreFrecuencia(transaccionesUsuario, maxTransaccionesEnLote),
    promocion: scorePromocion(tienePromocionActiva),
  };

  const score =
    SCORE_WEIGHTS.proximidad * desgloseScore.proximidad +
    SCORE_WEIGHTS.frecuencia * desgloseScore.frecuencia +
    SCORE_WEIGHTS.promocion * desgloseScore.promocion;

  return { score, desgloseScore };
}

export function rankCandidates(
  candidatos: ComercioCandidato[],
  latitude: number,
  longitude: number,
  radiusMeters: number,
): Recomendacion[] {
  const maxTransacciones = Math.max(
    0,
    ...candidatos.map((c) => c.transaccionesUsuario),
  );

  const recomendaciones = candidatos.map((comercio) => {
    const distanciaMetros = calculateDistance(
      latitude,
      longitude,
      comercio.latitude,
      comercio.longitude,
    );

    const { score, desgloseScore } = computeWeightedScore(
      distanciaMetros,
      radiusMeters,
      comercio.transaccionesUsuario,
      maxTransacciones,
      comercio.tienePromocionActiva,
    );

    const distanciaRedondeada = Math.round(distanciaMetros);

    return {
      ...comercio,
      distanciaMetros: distanciaRedondeada,
      score: Math.round(score * 1000) / 1000,
      desgloseScore,
      razonDestacada: buildRazonDestacada(
        comercio,
        desgloseScore,
        distanciaRedondeada,
      ),
    };
  });

  return recomendaciones.sort((a, b) => b.score - a.score);
}

export { calculateDistance };
