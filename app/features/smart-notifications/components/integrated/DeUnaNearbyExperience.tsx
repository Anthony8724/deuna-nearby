"use client";



import { useCallback, useEffect, useMemo, useRef, useState } from "react";



import { FLAGSHIP_RECOMENDACION } from "@/app/data/platformSnapshot";



import { DEMO_USER, DEMO_SCORE_THRESHOLD } from "../../config/demo";

import { DEFAULT_SIMULATED_LOCATION } from "../../data/quitoLocationPresets";

import { useNearbyGeoExperience } from "../../hooks/useNearbyGeoExperience";

import { mapNearbyBusinessToRecomendacion } from "../../lib/mapNearbyApi";

import { RecommendationDetailSheet } from "../RecommendationDetailSheet";

import type { CercaDeTiCardModel } from "../../lib/cercaDeTiCard";

import { resolveCardRecomendacion } from "../../lib/resolveCardRecomendacion";

import type { NearbyBusiness } from "@/services/nearbyBusinessesService";

import type { Recomendacion } from "../../types";

import { deuna } from "../../styles/deuna-ui";

import { DeUnaWalletHome } from "./DeUnaWalletHome";

import { PremiumPhoneMockup } from "./PremiumPhoneMockup";

import type { DeUnaTabId } from "./PhoneTabBar";

import { PhoneTabBar } from "./PhoneTabBar";



/**

 * Demo DeUna: home unificado con Cerca de ti (proximidad, GPS y negocios).

 */

export function DeUnaNearbyExperience() {

  const demo = useNearbyGeoExperience({

    userId: DEMO_USER.id,

    userName: DEMO_USER.nombre,

    watchLocationOnMount: false,

  });



  const [activeTab, setActiveTab] = useState<DeUnaTabId>("home");

  const [featured, setFeatured] = useState<Recomendacion | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);

  const [detailRec, setDetailRec] = useState<Recomendacion | null>(null);

  const initDone = useRef(false);

  const pushInitDone = useRef(false);

  const walletScrollRef = useRef<HTMLDivElement>(null);



  useEffect(() => {

    if (initDone.current) return;

    initDone.current = true;

    demo.setSimulatedLocation(DEFAULT_SIMULATED_LOCATION);

  }, [demo]);



  /** Push en background (demo con ubicación simulada) */

  useEffect(() => {

    if (pushInitDone.current || demo.loading) return;

    if (demo.recomendaciones.length === 0) return;



    const candidata =

      demo.recomendaciones.find((r) => r.score >= DEMO_SCORE_THRESHOLD) ??

      demo.recomendaciones[0];



    if (!candidata || demo.ultimaNotificacion) return;



    pushInitDone.current = true;

    void demo.generateNotificationFor(candidata);

  }, [

    demo.loading,

    demo.recomendaciones,

    demo.ultimaNotificacion,

    demo.generateNotificationFor,

  ]);



  const destacada = useMemo(() => {

    if (featured) return featured;

    if (demo.ultimaNotificacion?.recomendacion) {

      return demo.ultimaNotificacion.recomendacion;

    }

    if (demo.recomendaciones[0]) return demo.recomendaciones[0];

    return FLAGSHIP_RECOMENDACION;

  }, [featured, demo.ultimaNotificacion, demo.recomendaciones]);



  useEffect(() => {

    if (!featured && demo.recomendaciones[0]) {

      setFeatured(demo.recomendaciones[0]);

    }

  }, [demo.recomendaciones, featured]);



  const openCardDetail = useCallback(

    (card: CercaDeTiCardModel) => {

      const rec = resolveCardRecomendacion(

        card,

        demo.recomendaciones,

        demo.effectiveLocation,

      );

      setFeatured(rec);

      setDetailRec(rec);

      setDetailOpen(true);

    },

    [demo.recomendaciones, demo.effectiveLocation],

  );



  const openBusinessDetail = useCallback((business: NearbyBusiness) => {

    const rec = mapNearbyBusinessToRecomendacion(business);

    setFeatured(rec);

    setDetailRec(rec);

    setDetailOpen(true);

  }, []);



  const closeCardDetail = useCallback(() => {

    setDetailOpen(false);

  }, []);



  const handleTab = useCallback((tab: DeUnaTabId) => {

    setActiveTab(tab);

    requestAnimationFrame(() => {

      walletScrollRef.current?.scrollTo({ top: 0, behavior: "auto" });

    });

  }, []);



  return (

    <div className="flex min-h-[100dvh] items-center justify-center bg-[#E8E8ED] px-3 py-6 sm:py-10">

      <div

        className="pointer-events-none fixed inset-0 opacity-60"

        style={{

          background:

            "radial-gradient(ellipse 55% 45% at 50% 20%, rgba(93,42,142,0.06), transparent 70%)",

        }}

      />



      <PremiumPhoneMockup embedded className="relative z-10 w-full">

        <div className={`relative flex h-full min-h-0 flex-col ${deuna.app}`}>

          <div className="relative min-h-0 flex-1 overflow-hidden">

            <div

              ref={walletScrollRef}

              className="h-full overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"

            >

              <DeUnaWalletHome

                userName={DEMO_USER.nombre}

                smartRecommendations={demo.recomendaciones}

                smartLoading={demo.loading}

                businesses={demo.businesses}

                source={demo.source}

                effectiveLocation={demo.effectiveLocation}

                onCercaCardPress={openCardDetail}

                onBusinessPress={openBusinessDetail}

                onRequestGps={demo.requestLocation}

              />

            </div>

          </div>



          <PhoneTabBar activeTab={activeTab} onTabPress={handleTab} />



          <RecommendationDetailSheet

            open={detailOpen}

            recomendacion={detailRec}

            userId={DEMO_USER.id}

            userOrigin={demo.effectiveLocation}

            recomendaciones={demo.recomendaciones}

            onClose={closeCardDetail}

            onPagarConDeuna={() => {

              /* demo: acción de pago */

            }}

          />

        </div>

      </PremiumPhoneMockup>

    </div>

  );

}


