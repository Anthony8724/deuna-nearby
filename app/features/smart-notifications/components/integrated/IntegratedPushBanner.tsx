"use client";



import type { Recomendacion } from "../../types";

import {

  SmartPushNotification,

  smartPushPropsFromRecomendacion,

} from "../SmartPushNotification";



type IntegratedPushBannerProps = {

  recomendacion: Recomendacion;

  message?: string;

};



/** @deprecated Usar SmartPushNotification + PromoHeroCard */

export function IntegratedPushBanner({

  recomendacion,

  message,

}: IntegratedPushBannerProps) {

  return (

    <SmartPushNotification

      {...smartPushPropsFromRecomendacion(recomendacion, { message })}

      pulseGlow

    />

  );

}

