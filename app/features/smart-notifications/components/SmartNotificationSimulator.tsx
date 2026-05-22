"use client";

import { useCallback, useState, type ReactNode } from "react";

import { DEMO_USER } from "../config/demo";
import {
  DEFAULT_SIMULATED_LOCATION,
} from "../data/quitoLocationPresets";
import {
  useSmartNotifications,
  type UseSmartNotificationsReturn,
} from "../hooks/useSmartNotifications";
import type { Recomendacion, UserLocation } from "../types";
import { RecommendationsFeed } from "./simulator/RecommendationsFeed";
import { SimulatorActionsSection } from "./simulator/SimulatorActionsSection";
import { SimulatorLocationSection } from "./simulator/SimulatorLocationSection";

function parseCoordInput(value: string): number | null {
  const parsed = Number(value.replace(",", ".").trim());
  return Number.isFinite(parsed) ? parsed : null;
}

export type SmartNotificationSimulatorProps = {
  embedded?: boolean;
  demoState?: UseSmartNotificationsReturn;
  hideLastNotification?: boolean;
};

const EMBEDDED_STYLES = {
  card: "rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md",
  sectionTitle: "mb-3 text-xs font-semibold uppercase tracking-widest text-white/40",
  input:
    "rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30",
  presetButton:
    "rounded-lg border border-white/10 px-3 py-2 text-left text-xs text-white/80 transition hover:border-violet-400/40 hover:bg-violet-500/10 disabled:opacity-50",
  code: "rounded-md bg-white/10 px-2 py-1 text-xs text-white/80",
  btnPrimary:
    "rounded-xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-white/90 disabled:opacity-50",
  btnSecondary:
    "rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-50",
  btnAccent:
    "rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:opacity-90 disabled:opacity-50 sm:col-span-2",
} as const;

const STANDALONE_STYLES = {
  card: "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950",
  sectionTitle: "mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500",
  input:
    "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
  presetButton:
    "rounded-lg border border-zinc-200 px-3 py-2 text-left text-xs font-medium dark:border-zinc-700",
  code: "rounded-md bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-900",
  btnPrimary:
    "rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900",
  btnSecondary:
    "rounded-xl border border-zinc-300 px-4 py-3 text-sm font-medium dark:border-zinc-700",
  btnAccent:
    "rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white sm:col-span-2",
} as const;

export function SmartNotificationSimulator({
  embedded = false,
  demoState,
  hideLastNotification = false,
}: SmartNotificationSimulatorProps = {}): ReactNode {
  const styles = embedded ? EMBEDDED_STYLES : STANDALONE_STYLES;

  const [latInput, setLatInput] = useState(
    String(DEFAULT_SIMULATED_LOCATION.latitude),
  );
  const [lngInput, setLngInput] = useState(
    String(DEFAULT_SIMULATED_LOCATION.longitude),
  );
  const [loadingRecId, setLoadingRecId] = useState<string | null>(null);

  const internal = useSmartNotifications({
    userId: DEMO_USER.id,
    userName: DEMO_USER.nombre,
    watchLocationOnMount: false,
  });

  const demo = demoState ?? internal;

  const {
    recomendaciones,
    loading,
    error,
    ultimaNotificacion,
    location,
    simulatedLocation,
    effectiveLocation,
    locationError,
    locationLoading,
    requestLocation,
    setSimulatedLocation,
    searchRecommendations,
    sendTestNotification,
    generateNotificationFor,
  } = demo;

  const isBusy = loading || locationLoading || loadingRecId !== null;

  const applySimulatedCoords = useCallback(
    (coords: UserLocation) => {
      setSimulatedLocation(coords);
      setLatInput(String(coords.latitude));
      setLngInput(String(coords.longitude));
    },
    [setSimulatedLocation],
  );

  const handleApplyManualCoords = () => {
    const latitude = parseCoordInput(latInput);
    const longitude = parseCoordInput(lngInput);
    if (latitude === null || longitude === null) return;
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return;
    }
    applySimulatedCoords({ latitude, longitude });
  };

  const handleGenerateFor = async (rec: Recomendacion) => {
    setLoadingRecId(rec.id);
    try {
      await generateNotificationFor(rec, { bypassCooldown: true });
    } finally {
      setLoadingRecId(null);
    }
  };

  return (
    <div
      data-testid="smart-notification-simulator"
      className={
        embedded
          ? "flex flex-col gap-4"
          : "mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 sm:p-6"
      }
    >
      {!embedded ? (
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Simulador Radar DeUna
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Motor de recomendaciones con scoring y notificaciones IA.
          </p>
        </header>
      ) : null}

      <SimulatorLocationSection
        location={location}
        simulatedLocation={simulatedLocation}
        effectiveLocation={effectiveLocation}
        locationErrorMessage={locationError?.message}
        latInput={latInput}
        lngInput={lngInput}
        onLatChange={setLatInput}
        onLngChange={setLngInput}
        onApplyCoords={handleApplyManualCoords}
        onPreset={applySimulatedCoords}
        onClearSimulation={() => setSimulatedLocation(null)}
        onRequestGps={requestLocation}
        disabled={isBusy}
        cardClass={styles.card}
        sectionTitleClass={styles.sectionTitle}
        codeClass={styles.code}
        inputClass={styles.input}
        presetButtonClass={styles.presetButton}
      />

      <SimulatorActionsSection
        onRequestGps={requestLocation}
        onSearch={() => void searchRecommendations()}
        onTestNotification={() => void sendTestNotification()}
        hasLocation={Boolean(effectiveLocation)}
        hasRecommendations={recomendaciones.length > 0}
        isBusy={isBusy}
        errorMessage={error?.message}
        cardClass={styles.card}
        sectionTitleClass={styles.sectionTitle}
        btnPrimary={styles.btnPrimary}
        btnSecondary={styles.btnSecondary}
        btnAccent={styles.btnAccent}
      />

      <section className={styles.card}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className={styles.sectionTitle}>Recomendaciones</h2>
          <span
            className={
              embedded
                ? "rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/70"
                : "rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs dark:bg-zinc-800"
            }
          >
            {recomendaciones.length}
          </span>
        </div>
        <RecommendationsFeed
          recomendaciones={recomendaciones}
          loadingId={loadingRecId}
          disabled={isBusy}
          onActivarBeneficio={(rec) => void handleGenerateFor(rec)}
        />
      </section>

      {!hideLastNotification && ultimaNotificacion ? (
        <section
          className={
            embedded
              ? "rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5"
              : "rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 dark:border-emerald-900 dark:bg-emerald-950/30"
          }
        >
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-400">
            Última notificación
          </h2>
          <p className="font-semibold text-white">{ultimaNotificacion.title}</p>
          <p className="mt-1 text-sm text-white/70">{ultimaNotificacion.body}</p>
        </section>
      ) : null}
    </div>
  );
}
