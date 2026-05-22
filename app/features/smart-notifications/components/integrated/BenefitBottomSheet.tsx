"use client";

import type { Recomendacion, UserLocation } from "../../types";
import {
  SmartBenefitBottomSheet,
  smartBenefitSheetPropsFromRecomendacion,
} from "../SmartBenefitBottomSheet";

type BenefitBottomSheetProps = {
  open: boolean;
  recomendacion: Recomendacion;
  userId: string;
  userOrigin?: UserLocation | null;
  onClose: () => void;
  onUseBenefit?: () => void;
};

/** @deprecated Usar SmartBenefitBottomSheet */
export function BenefitBottomSheet({
  open,
  recomendacion,
  userId,
  userOrigin = null,
  onClose,
  onUseBenefit,
}: BenefitBottomSheetProps) {
  return (
    <SmartBenefitBottomSheet
      open={open}
      {...smartBenefitSheetPropsFromRecomendacion(recomendacion, { userId })}
      userOrigin={userOrigin}
      onClose={onClose}
      onUsarBeneficio={onUseBenefit}
    />
  );
}
