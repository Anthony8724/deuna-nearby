"use client";

import { useCallback } from "react";
import { NearbyBottomSheet } from "@/components/nearby/nearby-bottom-sheet";
import { DemoBootstrap, DemoPresenterBar } from "@/components/demo/demo-bootstrap";
import { demoFollowUp, demoTimings, isDemoMode } from "@/constants/demo";
import { primaryNearbyMoment } from "@/constants/nearby-moments";
import { notificationGenerator } from "@/lib/notification-generator";
import { smartRecommendationToMoment } from "@/lib/smart-recommendation-mapper";
import { recommendationService } from "@/lib/recommendation-service";
import {
  NearbyProvider,
  useNearbyActions,
  useNearbyState,
} from "@/context/nearby-context";
import { useDeunaSession } from "@/context/deuna-session-context";

function NearbySheetLayer() {
  const { activeMoment, isSheetOpen } = useNearbyState();
  const { closeSheet, dismissMoment, refreshPushQueue } = useNearbyActions();
  const { resetPaymentPhase } = useDeunaSession();
  const moment = activeMoment ?? primaryNearbyMoment;

  const handleClose = useCallback(() => {
    resetPaymentPhase();
    closeSheet();
  }, [resetPaymentPhase, closeSheet]);

  const handlePaymentComplete = useCallback(() => {
    if (!activeMoment) return;

    dismissMoment(activeMoment.id);
    notificationGenerator.markReadByRecommendationId(activeMoment.id);
    refreshPushQueue();

    if (isDemoMode()) {
      window.setTimeout(() => {
        const location = recommendationService.getFallbackLocation();
        const recs = recommendationService.getRecommendations(
          location,
          recommendationService.getDefaultHistory(),
          [demoFollowUp.merchantName],
        );
        const followUp =
          recs.find((r) => r.id === demoFollowUp.recommendationId) ?? recs[0];
        if (!followUp) return;
        const followMoment = smartRecommendationToMoment(followUp);
        notificationGenerator.enqueueFromMoment(followMoment);
        refreshPushQueue();
      }, demoTimings.postPaymentNotificationMs);
    }
  }, [activeMoment, dismissMoment, refreshPushQueue]);

  return (
    <NearbyBottomSheet
      moment={moment}
      open={isSheetOpen}
      onClose={handleClose}
      onPaymentComplete={handlePaymentComplete}
    />
  );
}

export function DeunaShell({ children }: { children: React.ReactNode }) {
  return (
    <NearbyProvider>
      <DemoBootstrap />
      <DemoPresenterBar />
      {children}
      <NearbySheetLayer />
    </NearbyProvider>
  );
}
