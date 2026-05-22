"use client";

import type { NearbyBusiness } from "@/services/nearbyBusinessesService";

import type { Recomendacion, UserLocation } from "../../types";
import type { CercaDeTiCardModel } from "../../lib/cercaDeTiCard";
import { DeUnaHomeScreen } from "./DeUnaHomeScreen";

export type DeUnaWalletHomeProps = {
  userName: string;
  smartRecommendations?: Recomendacion[];
  smartLoading?: boolean;
  businesses?: NearbyBusiness[];
  source?: "supabase" | "engine" | null;
  effectiveLocation?: UserLocation | null;
  onCercaCardPress?: (card: CercaDeTiCardModel) => void;
  onBusinessPress?: (business: NearbyBusiness) => void;
  onRequestGps?: () => void;
  onTransferir?: () => void;
  onPagarQr?: () => void;
  onRecharge?: () => void;
  onQuickAction?: (actionId: string) => void;
};

export function DeUnaWalletHome({
  userName,
  smartRecommendations = [],
  smartLoading = false,
  businesses = [],
  source = null,
  effectiveLocation = null,
  onCercaCardPress,
  onBusinessPress,
  onRequestGps,
  onTransferir,
  onPagarQr,
  onRecharge,
  onQuickAction,
}: DeUnaWalletHomeProps) {
  return (
    <DeUnaHomeScreen
      userName={userName}
      smartRecommendations={smartRecommendations}
      smartLoading={smartLoading}
      businesses={businesses}
      source={source}
      effectiveLocation={effectiveLocation}
      onCercaCardPress={onCercaCardPress}
      onBusinessPress={onBusinessPress}
      onRequestGps={onRequestGps}
      onTransferir={onTransferir}
      onPagarQr={onPagarQr}
      onRecharge={onRecharge}
      onQuickAction={onQuickAction}
    />
  );
}
