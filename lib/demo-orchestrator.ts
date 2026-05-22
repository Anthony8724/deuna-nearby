import {
  DEMO_BOOTSTRAP_KEY,
  DEMO_PUSH_KEY,
  DEMO_SESSION_KEY,
  demoHero,
  isDemoMode,
} from "@/constants/demo";
import { homeUser } from "@/constants/home";
import { notificationGenerator } from "@/lib/notification-generator";
import { nearbyMoments } from "@/constants/nearby-moments";

export function resetDemoState(options?: { force?: boolean }) {
  if (typeof window === "undefined") return;
  if (!isDemoMode() && !options?.force) return;

  sessionStorage.removeItem(DEMO_SESSION_KEY);
  sessionStorage.removeItem(DEMO_PUSH_KEY);
  sessionStorage.removeItem(DEMO_BOOTSTRAP_KEY);
}

export function ensureDemoBootstrap() {
  if (typeof window === "undefined" || !isDemoMode()) return false;

  const bootstrapped = sessionStorage.getItem(DEMO_BOOTSTRAP_KEY);
  if (bootstrapped) return false;

  resetDemoState({ force: true });

  const heroMoment =
    nearbyMoments.find((m) => m.id === demoHero.momentId) ?? nearbyMoments[0];
  notificationGenerator.enqueueFromMoment(heroMoment);

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
