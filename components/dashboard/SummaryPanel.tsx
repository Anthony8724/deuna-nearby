import { Tag, TrendingUp, Users } from "lucide-react";
import type { NearbySummary, PromotionItem } from "@/types/dashboard";

type SummaryPanelProps = {
  summary: NearbySummary;
  promotions: PromotionItem[];
};

export function SummaryPanel({ summary, promotions }: SummaryPanelProps) {
  return (
    <aside className="rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] sm:p-6">
      <p className="text-xs font-bold uppercase tracking-wider text-brand-primary">
        Resumen ejecutivo
      </p>
      <h2 className="mt-2 text-xl font-bold text-[#1E1E1E]">{summary.feature}</h2>
      <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">
        Conecta el historial del usuario con comercios cercanos y promociones
        activas para aumentar descubrimiento, conversión y frecuencia en DeUna.
      </p>

      <ul className="mt-5 space-y-3">
        <li className="flex items-start gap-3 rounded-xl bg-brand-primary-subtle px-3 py-3">
          <Users className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
          <div>
            <p className="text-xs font-semibold text-[#374151]">Usuarios</p>
            <p className="text-sm text-[#6B7280]">
              {summary.usersActivated} usuario activado con recomendaciones
              personalizadas
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3 rounded-xl bg-brand-primary-subtle px-3 py-3">
          <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
          <div>
            <p className="text-xs font-semibold text-[#374151]">Comercios</p>
            <p className="text-sm text-[#6B7280]">
              {summary.businessesRecommended} negocios recomendados en el radio
              Nearby
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3 rounded-xl bg-brand-primary-subtle px-3 py-3">
          <Tag className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
          <div>
            <p className="text-xs font-semibold text-[#374151]">Promociones</p>
            <p className="text-sm text-[#6B7280]">
              {promotions.length} promoción
              {promotions.length === 1 ? "" : "es"} activa
              {promotions.length === 1 ? "" : "s"} en el ecosistema
            </p>
          </div>
        </li>
      </ul>
    </aside>
  );
}
