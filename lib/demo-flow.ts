import { LANDING_ROUTE, LOCK_SCREEN_ROUTE, WALLET_ROUTE } from "@/lib/demo-routes";

export const DEMO_STEP_KEY = "deuna-demo-step";

export type DemoFlowStep = {
  id: string;
  label: string;
  href: string;
};

/** Recorrido único del hackathon — cubre todos los módulos sin cambiar sus UIs. */
export const demoFlowSteps: DemoFlowStep[] = [
  {
    id: "lock",
    label: "Pantalla bloqueada + push DeUna Nearby",
    href: LOCK_SCREEN_ROUTE,
  },
  {
    id: "landing",
    label: "Landing inversores (marketing)",
    href: LANDING_ROUTE,
  },
  {
    id: "wallet",
    label: "Billetera + promos + cómo llegar",
    href: WALLET_ROUTE,
  },
  {
    id: "sheet",
    label: "Toca promoción → Bottom Sheet",
    href: WALLET_ROUTE,
  },
  {
    id: "pay",
    label: "Pagar con DeUna",
    href: WALLET_ROUTE,
  },
  {
    id: "merchant",
    label: "Panel comercio en vivo",
    href: "/comercio/dashboard",
  },
  {
    id: "analytics",
    label: "Analytics avanzado del comercio",
    href: "/comercio/analytics",
  },
  {
    id: "impact",
    label: "Dashboard impacto + pitch jurado",
    href: "/dashboard",
  },
];

export function readDemoStep(): number {
  if (typeof window === "undefined") return 0;
  const raw = sessionStorage.getItem(DEMO_STEP_KEY);
  const parsed = raw ? Number.parseInt(raw, 10) : 0;
  if (Number.isNaN(parsed)) return 0;
  return Math.min(Math.max(parsed, 0), demoFlowSteps.length - 1);
}

export function writeDemoStep(step: number): void {
  if (typeof window === "undefined") return;
  const clamped = Math.min(Math.max(step, 0), demoFlowSteps.length - 1);
  sessionStorage.setItem(DEMO_STEP_KEY, String(clamped));
}

export function demoStepForPath(pathname: string): number {
  if (pathname === LOCK_SCREEN_ROUTE) return 0;
  if (pathname.startsWith("/landing")) return 1;
  if (pathname.startsWith(WALLET_ROUTE)) return 2;
  if (pathname.startsWith("/smart-notifications")) return 0;
  if (pathname.startsWith("/comercio/dashboard")) return 5;
  if (pathname.startsWith("/comercio/analytics")) return 6;
  if (pathname.startsWith("/dashboard")) return 7;
  return readDemoStep();
}
