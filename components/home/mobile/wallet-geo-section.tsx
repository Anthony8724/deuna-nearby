"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { RecommendationDetailSheet } from "@/app/features/smart-notifications/components/RecommendationDetailSheet";
import { NearbyBusinessesPanel } from "@/app/features/smart-notifications/components/geo/NearbyBusinessesPanel";
import { NearbyGeoStrip } from "@/app/features/smart-notifications/components/geo/NearbyGeoStrip";
import { SmartRecommendationsSection } from "@/app/features/smart-notifications/components/SmartRecommendationsSection";
import { DEMO_USER } from "@/app/features/smart-notifications/config/demo";
import { DEFAULT_SIMULATED_LOCATION } from "@/app/features/smart-notifications/data/quitoLocationPresets";
import { useNearbyGeoExperience } from "@/app/features/smart-notifications/hooks/useNearbyGeoExperience";
import { mapNearbyBusinessToRecomendacion } from "@/app/features/smart-notifications/lib/mapNearbyApi";
import type { CercaDeTiCardModel } from "@/app/features/smart-notifications/lib/cercaDeTiCard";
import { resolveCardRecomendacion } from "@/app/features/smart-notifications/lib/resolveCardRecomendacion";
import type { Recomendacion } from "@/app/features/smart-notifications/types";
import type { NearbyBusiness } from "@/services/nearbyBusinessesService";
import { useNearbyActions } from "@/context/nearby-context";
import { recomendacionToNearbyMoment } from "@/lib/recomendacion-to-moment";

import { useWalletDemo } from "./wallet-demo-provider";

/** GPS, negocios cercanos, cómo llegar y detalle con Maps — dentro de la billetera unificada. */
export function WalletGeoSection() {
  const demo = useNearbyGeoExperience({
    userId: DEMO_USER.id,
    userName: DEMO_USER.nombre,
    watchLocationOnMount: false,
  });
  const { openSheet } = useNearbyActions();
  const { openQrPayment } = useWalletDemo();
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRec, setDetailRec] = useState<Recomendacion | null>(null);
  const initDone = useRef(false);

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;
    demo.setSimulatedLocation(DEFAULT_SIMULATED_LOCATION);
  }, [demo]);

  const openDetail = useCallback((rec: Recomendacion) => {
    setDetailRec(rec);
    setDetailOpen(true);
  }, []);

  const openCardDetail = useCallback(
    (card: CercaDeTiCardModel) => {
      openDetail(
        resolveCardRecomendacion(
          card,
          demo.recomendaciones,
          demo.effectiveLocation,
        ),
      );
    },
    [demo.effectiveLocation, demo.recomendaciones, openDetail],
  );

  const openBusinessDetail = useCallback(
    (business: NearbyBusiness) => {
      openDetail(mapNearbyBusinessToRecomendacion(business));
    },
    [openDetail],
  );

  return (
    <>
      <section id="wallet-promos" className="mt-6 px-5" aria-label="Ubicación y negocios cercanos">
        <NearbyGeoStrip
          effectiveLocation={demo.effectiveLocation}
          source={demo.source}
          loading={demo.loading}
          nearestBusiness={demo.businesses[0] ?? null}
          onRequestGps={demo.requestLocation}
        />
        <div className="mt-4">
          <SmartRecommendationsSection
            smartRecommendations={demo.recomendaciones}
            loading={demo.loading}
            onCardPress={openCardDetail}
          />
        </div>
        <NearbyBusinessesPanel
          businesses={demo.businesses}
          loading={demo.loading}
          className="mt-4"
          onBusinessPress={openBusinessDetail}
        />
      </section>

      <RecommendationDetailSheet
        open={detailOpen}
        recomendacion={detailRec}
        userId={DEMO_USER.id}
        userOrigin={demo.effectiveLocation}
        recomendaciones={demo.recomendaciones}
        onClose={() => setDetailOpen(false)}
        onPagarConDeuna={() => {
          if (detailRec) {
            openSheet(recomendacionToNearbyMoment(detailRec));
          } else {
            openQrPayment();
          }
          setDetailOpen(false);
        }}
      />
    </>
  );
}
