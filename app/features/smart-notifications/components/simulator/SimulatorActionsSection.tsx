"use client";

type SimulatorActionsSectionProps = {
  onSearch: () => void;
  onTestNotification: () => void;
  onRequestGps: () => void;
  hasLocation: boolean;
  hasRecommendations: boolean;
  isBusy: boolean;
  errorMessage?: string;
  cardClass: string;
  sectionTitleClass: string;
  btnPrimary: string;
  btnSecondary: string;
  btnAccent: string;
};

export function SimulatorActionsSection({
  onSearch,
  onTestNotification,
  onRequestGps,
  hasLocation,
  hasRecommendations,
  isBusy,
  errorMessage,
  cardClass,
  sectionTitleClass,
  btnPrimary,
  btnSecondary,
  btnAccent,
}: SimulatorActionsSectionProps) {
  return (
    <section className={cardClass}>
      <h2 className={sectionTitleClass}>Acciones</h2>
      <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2">
        <button
          type="button"
          disabled={isBusy}
          onClick={onRequestGps}
          className={btnPrimary}
        >
          1. Obtener mi ubicación actual
        </button>
        <button
          type="button"
          disabled={isBusy || !hasLocation}
          onClick={onSearch}
          className={btnSecondary}
        >
          3. Buscar recomendaciones ahora
        </button>
        <button
          type="button"
          disabled={isBusy || !hasRecommendations}
          onClick={onTestNotification}
          className={btnAccent}
        >
          4. Enviar notificación de prueba
        </button>
      </div>
      {isBusy ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-white/50" role="status">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
          Procesando motor de recomendaciones…
        </p>
      ) : null}
      {errorMessage ? (
        <div
          className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
          role="alert"
        >
          {errorMessage}
        </div>
      ) : null}
    </section>
  );
}
