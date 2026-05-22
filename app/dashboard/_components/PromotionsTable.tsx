import type { ActivePromotion } from "../data/merchantAnalytics";

export function PromotionsTable({ promotions }: { promotions: ActivePromotion[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-100 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <th className="pb-3 pr-4">Promoción</th>
            <th className="pb-3 pr-4">Tipo</th>
            <th className="pb-3 pr-4">Activaciones</th>
            <th className="pb-3 pr-4">CTR</th>
            <th className="pb-3 pr-4">Estado</th>
            <th className="pb-3">Vigencia</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {promotions.map((p) => (
            <tr key={p.id} className="group hover:bg-zinc-50/80">
              <td className="py-3.5 pr-4 font-medium text-zinc-900">{p.titulo}</td>
              <td className="py-3.5 pr-4 capitalize text-zinc-600">{p.tipo}</td>
              <td className="py-3.5 pr-4 font-mono text-zinc-700">
                {p.activaciones.toLocaleString("es-EC")}
              </td>
              <td className="py-3.5 pr-4 font-mono text-zinc-700">{p.ctr}%</td>
              <td className="py-3.5 pr-4">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                    p.estado === "activa"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {p.estado}
                </span>
              </td>
              <td className="py-3.5 text-zinc-500">{p.vigenteHasta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
