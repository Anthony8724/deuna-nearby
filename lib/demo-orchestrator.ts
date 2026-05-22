import {
  DEMO_BOOTSTRAP_KEY,
  DEMO_PUSH_KEY,
  DEMO_SESSION_KEY,
  demoHero,
  isDemoMode,
} from "@/constants/demo";
import { homeUser } from "@/constants/home";
import {
  mapApiRecommendationToSmart,
  mapSmartToNearbyMoment,
} from "@/lib/api-recommendation-mapper";
import { notificationGenerator } from "@/lib/notification-generator";
import { nearbyMoments } from "@/constants/nearby-moments";

export function resetDemoState(options?: { force?: boolean }) {
  if (typeof window === "undefined") return;
  if (!isDemoMode() && !options?.force) return;

  sessionStorage.removeItem(DEMO_SESSION_KEY);
  sessionStorage.removeItem(DEMO_PUSH_KEY);
  sessionStorage.removeItem(DEMO_BOOTSTRAP_KEY);
}

async function resolveHeroMoment() {
  try {
    const res = await fetch("/api/recommendations", { cache: "no-store" });
    if (res.ok) {
      const payload = await res.json();
      const top = payload.recommendations?.[0];
      if (top) {
        return mapSmartToNearbyMoment(
          mapApiRecommendationToSmart(top, payload.favoriteCategory),
        );
      }
    }
  } catch {
    /* fallback below */
  }

  return (
    nearbyMoments.find((m) => m.id === demoHero.momentId) ?? nearbyMoments[0]
  );
}

export function ensureDemoBootstrap() {
  if (typeof window === "undefined" || !isDemoMode()) return false;

  const bootstrapped = sessionStorage.getItem(DEMO_BOOTSTRAP_KEY);
  if (bootstrapped) return false;

  resetDemoState({ force: true });

  void resolveHeroMoment().then((heroMoment) => {
    notificationGenerator.enqueueFromMoment(heroMoment);
  });

  sessionStorage.setItem(DEMO_BOOTSTRAP_KEY, String(Date.now()));
  return true;
}

export function getFreshSessionSnapshot() {
  return {
    balance: homeUser.balance,
    monthlyCashback: 42.3,
    completedPayments: [] as never[],
  };
}

export function schedulePostPaymentScenario(onReady: () => void, delayMs: number) {
  if (!isDemoMode()) return () => undefined;
  const timer = setTimeout(onReady, delayMs);
  return () => clearTimeout(timer);
}
