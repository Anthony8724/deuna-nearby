import type { PromocionActiva, Recomendacion } from "../types";
import { tiempoPromoLabel } from "./nearbyCopy";

export type BeneficioResumen = {
  tipo: "descuento" | "cashback" | "ahorro" | "2x1" | "envio";
  texto: string;
};

/** Texto corto del beneficio para UI y notificaciones */
export function formatBeneficioFromRecomendacion(
  rec: Recomendacion,
): BeneficioResumen {
  const promo = rec.promocion;

  if (promo) {
    switch (promo.tipo) {
      case "cashback":
        return { tipo: "cashback", texto: `Cashback ${promo.valor}%` };
      case "2x1":
        return { tipo: "2x1", texto: promo.titulo };
      case "envio_gratis":
        return { tipo: "envio", texto: "Envío gratis con DeUna" };
      case "descuento":
      default:
        return { tipo: "descuento", texto: `${promo.valor}% de descuento` };
    }
  }

  if (rec.transaccionesUsuario >= 12) {
    return { tipo: "cashback", texto: "Cashback 5% por lealtad" };
  }

  if (rec.transaccionesUsuario >= 6) {
    return { tipo: "cashback", texto: "Cashback 3% DeUna Plus" };
  }

  const ahorroEst =
    rec.ticketPromedioUsd >= 30
      ? "Ahorra hasta $8"
      : rec.distanciaMetros < 400
        ? "Ahorra hasta $3"
        : "Ahorra hasta $5";

  return { tipo: "ahorro", texto: ahorroEst };
}

/** Etiqueta de urgencia según vigencia de la promoción */
export function formatTiempoRestantePromo(
  promo?: PromocionActiva,
): string {
  return tiempoPromoLabel(promo);
}
