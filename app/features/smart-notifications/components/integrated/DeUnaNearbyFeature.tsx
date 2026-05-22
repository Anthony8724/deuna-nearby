"use client";



import { AnimatePresence, motion } from "framer-motion";

import type { NearbyBusiness } from "@/services/nearbyBusinessesService";

import type { CercaDeTiCardModel } from "../../lib/cercaDeTiCard";
import type { Recomendacion, UserLocation } from "../../types";

import { deuna } from "../../styles/deuna-ui";

import { NearbyBusinessesPanel } from "../geo/NearbyBusinessesPanel";
import { NearbyGeoStrip } from "../geo/NearbyGeoStrip";
import { PromoHeroCard } from "../PromoHeroCard";

import { SmartPushNotification } from "../SmartPushNotification";

import { NearbyMomentsSection } from "../NearbyMomentsSection";



type DeUnaNearbyFeatureProps = {

  destacada: Recomendacion;

  recomendaciones: Recomendacion[];

  businesses?: NearbyBusiness[];

  source?: "supabase" | "engine" | null;

  userId: string;

  /** Mensaje push conversacional (notificación o fallback) */
  pushMessage: string;

  userOrigin?: UserLocation | null;

  loading: boolean;

  onSelectRec: (rec: Recomendacion) => void;

  onCardPress?: (card: CercaDeTiCardModel) => void;

  onBusinessPress?: (business: NearbyBusiness) => void;

  onRequestGps?: () => void;

  onPagarConDeuna?: () => void;

};



export function DeUnaNearbyFeature({

  destacada,

  recomendaciones,

  businesses = [],

  source = null,

  userId,

  pushMessage,

  userOrigin = null,

  loading,

  onSelectRec,

  onCardPress,

  onBusinessPress,

  onRequestGps,

  onPagarConDeuna,

}: DeUnaNearbyFeatureProps) {
  const nearestBusiness = businesses[0] ?? null;

  return (

    <AnimatePresence mode="wait">

      <motion.div

        key="nearby-content"

        initial={{ opacity: 0, x: 8 }}

        animate={{ opacity: 1, x: 0 }}

        exit={{ opacity: 0, x: -6 }}

        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}

        className={`min-h-0 flex-1 pb-4 ${deuna.page}`}

      >

        <div className="px-4 pt-4 pb-2">

          <div className="mb-3 flex items-center justify-between">

            <h2 className={deuna.sectionTitle}>Nearby Moments</h2>

            <span className={deuna.badgeNuevo}>Inteligente ✨</span>

          </div>

          <NearbyGeoStrip
            effectiveLocation={userOrigin}
            source={source}
            loading={loading}
            nearestBusiness={nearestBusiness}
            onRequestGps={onRequestGps}
          />

          <div className="mt-3">
            <SmartPushNotification message={pushMessage} pulseGlow delay={0.05} />
          </div>

        </div>



        <PromoHeroCard

          className="mt-2"

          recomendacion={destacada}

          userId={userId}

          userOrigin={userOrigin}

          onPagarConDeuna={onPagarConDeuna}

        />



        <NearbyMomentsSection

          recommendations={recomendaciones.filter((r) => r.id !== destacada.id)}

          loading={loading}

          maxItems={8}

          className="mt-5 px-4"

          onCardPress={(card) => {
            onCardPress?.(card);
            if (card.recomendacion) onSelectRec(card.recomendacion);
          }}

        />

        <NearbyBusinessesPanel
          businesses={businesses}
          loading={loading}
          className="mt-6 px-4 pb-2"
          onBusinessPress={onBusinessPress}
        />

      </motion.div>

    </AnimatePresence>

  );

}


