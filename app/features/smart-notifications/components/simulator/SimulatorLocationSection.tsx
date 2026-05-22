"use client";

import { QUITO_LOCATION_PRESETS } from "../../data/quitoLocationPresets";
import { formatCoord } from "../../lib/format";
import type { UserLocation } from "../../types";

type SimulatorLocationSectionProps = {
  location: UserLocation | null;
  simulatedLocation: UserLocation | null;
  effectiveLocation: UserLocation | null;
  locationErrorMessage?: string;
  latInput: string;
  lngInput: string;
  onLatChange: (v: string) => void;
  onLngChange: (v: string) => void;
  onApplyCoords: () => void;
  onPreset: (coords: UserLocation) => void;
  onClearSimulation: () => void;
  onRequestGps: () => void;
  disabled?: boolean;
  cardClass: string;
  sectionTitleClass: string;
  codeClass: string;
  inputClass: string;
  presetButtonClass: string;
};

export function SimulatorLocationSection({
  location,
  simulatedLocation,
  effectiveLocation,
  locationErrorMessage,
  latInput,
  lngInput,
  onLatChange,
  onLngChange,
  onApplyCoords,
  onPreset,
  onClearSimulation,
  onRequestGps,
  disabled,
  cardClass,
  sectionTitleClass,
  codeClass,
  inputClass,
  presetButtonClass,
}: SimulatorLocationSectionProps) {
  return (
    <>
      <section className={cardClass}>
        <h2 className={sectionTitleClass}>Ubicación</h2>
        <div className="grid gap-3 text-sm">
          <Row label="GPS" code={location ? formatCoordPair(location) : null} codeClass={codeClass} />
          <Row
            label="Simulada"
            code={
              simulatedLocation ? formatCoordPair(simulatedLocation) : null
            }
            codeClass={`${codeClass} text-violet-200`}
            fallback="No activa"
          />
          <Row
            label="Efectiva"
            code={
              effectiveLocation ? formatCoordPair(effectiveLocation) : null
            }
            codeClass={`${codeClass} text-emerald-200`}
            fallback="Pendiente"
            fallbackClass="text-amber-400"
          />
        </div>
        {locationErrorMessage ? (
          <p className="mt-3 text-sm text-amber-400/90" role="status">
            GPS: {locationErrorMessage}
          </p>
        ) : null}
        <button
          type="button"
          disabled={disabled}
          onClick={onRequestGps}
          className="mt-4 w-full rounded-xl border border-white/15 py-2 text-xs font-medium text-white/70 hover:bg-white/5 disabled:opacity-50"
        >
          Refrescar GPS
        </button>
      </section>

      <section className={cardClass}>
        <h2 className={sectionTitleClass}>Simular ubicación · Quito</h2>
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {QUITO_LOCATION_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              disabled={disabled}
              onClick={() => onPreset(preset.location)}
              className={presetButtonClass}
            >
              <span className="block font-medium">{preset.label}</span>
              <span className="mt-0.5 block text-[10px] opacity-60">
                {preset.zona}
              </span>
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Field label="Latitud" value={latInput} onChange={onLatChange} className={inputClass} />
          <Field label="Longitud" value={lngInput} onChange={onLngChange} className={inputClass} />
          <button
            type="button"
            disabled={disabled}
            onClick={onApplyCoords}
            className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
          >
            Aplicar coords
          </button>
        </div>
        {simulatedLocation ? (
          <button
            type="button"
            className="mt-3 text-xs text-white/40 underline hover:text-white/70"
            onClick={onClearSimulation}
          >
            Quitar simulación (usar solo GPS)
          </button>
        ) : null}
      </section>
    </>
  );
}

function formatCoordPair(loc: UserLocation) {
  return `${formatCoord(loc.latitude)}, ${formatCoord(loc.longitude)}`;
}

function Row({
  label,
  code,
  codeClass,
  fallback = "Sin lectura",
  fallbackClass = "text-white/45",
}: {
  label: string;
  code: string | null;
  codeClass: string;
  fallback?: string;
  fallbackClass?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-medium text-white/55">{label}:</span>
      {code ? (
        <code className={codeClass}>{code}</code>
      ) : (
        <span className={fallbackClass}>{fallback}</span>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className: string;
}) {
  return (
    <label className="flex flex-1 flex-col gap-1 text-xs font-medium text-white/50">
      {label}
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
      />
    </label>
  );
}
