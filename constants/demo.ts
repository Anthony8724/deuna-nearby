/**
 * Hackathon demo configuration — tune live presentation timing from one place.
 * Set NEXT_PUBLIC_DEMO_MODE=false to disable demo optimizations in production builds.
 */

export {
  DEMO_STEP_KEY,
  demoFlowSteps,
  demoFlowSteps as demoPresenterSteps,
  readDemoStep,
  writeDemoStep,
  demoStepForPath,
} from "@/lib/demo-flow";

export const DEMO_SESSION_KEY = "deuna-nearby-session";
export const DEMO_PUSH_KEY = "deuna-smart-push-queue";
export const DEMO_BOOTSTRAP_KEY = "deuna-demo-bootstrapped";

export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
}

export const demoTimings = {
  /** Home skeleton before content reveal */
  homeReadyMs: isDemoMode() ? 480 : 650,
  /** Toast after unread notification is ready */
  notificationToastMs: isDemoMode() ? 1100 : 2400,
  /** Background smart push generation after location */
  smartPushDelayMs: isDemoMode() ? 900 : 1800,
  /** Payment processing screen */
  paymentProcessingMs: isDemoMode() ? 1100 : 1400,
  /** Merchant live banner auto-dismiss */
  merchantBannerMs: isDemoMode() ? 10000 : 8000,
  /** Follow-up notification after successful payment */
  postPaymentNotificationMs: isDemoMode() ? 2800 : 4000,
  /** Geolocation timeout — instant fallback in demo */
  geolocationTimeoutMs: isDemoMode() ? 800 : 4000,
} as const;

/** Hero merchant for the live demo narrative */
export const demoHero = {
  merchantId: "cafe-aurora",
  merchantName: "Café Aurora",
  momentId: "moment-cafe",
  paymentAmount: 4.5,
  benefitPercent: 15,
  benefitAmount: 0.68,
  aiInsight: "Frecuentas cafeterías por las mañanas",
  distance: "120 m",
} as const;

/** Follow-up scenario shown after first payment */
export const demoFollowUp = {
  recommendationId: "smart-panaderia",
  merchantName: "Panadería del Valle",
  benefit: "10% cashback",
  aiInsight: "Basado en tus compras matutinas",
} as const;
