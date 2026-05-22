"use client";

import {
  SmartBenefitBottomSheet,
  smartBenefitSheetPropsFromRecomendacion,
} from "./SmartBenefitBottomSheet";
import type { Recomendacion, UserLocation } from "../types";

export type RecommendationDetailSheetProps = {
  open: boolean;
  recomendacion: Recomendacion | null;
  userId?: string;
  userOrigin?: UserLocation | null;
  recomendaciones?: Recomendacion[];
  onClose: () => void;
  onPagarConDeuna?: () => void;
};

/**
 * Bottom sheet de detalle para cards de Cerca de ti / Nearby Moments.
 */
export function RecommendationDetailSheet({
  open,
  recomendacion,
  userId = "guest",
  userOrigin = null,
  recomendaciones = [],
  onClose,
  onPagarConDeuna,
}: RecommendationDetailSheetProps) {
  if (!recomendacion) return null;

  const sheetProps = smartBenefitSheetPropsFromRecomendacion(recomendacion, {
    userId,
    recomendaciones: recomendaciones.length > 0 ? recomendaciones : [recomendacion],
  });

  return (
    <SmartBenefitBottomSheet
      open={open}
      {...sheetProps}
      userOrigin={userOrigin}
      onClose={onClose}
      onUsarBeneficio={onPagarConDeuna}
      className="z-[80]"
    />
  );
}
