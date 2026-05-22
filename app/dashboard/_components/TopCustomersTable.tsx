import type { FrequentCustomer } from "../data/merchantAnalytics";

const SEGMENTO_STYLE = {
  vip: "bg-indigo-50 text-[#635bff]",
  regular: "bg-zinc-100 text-zinc-600",
  nuevo: "bg-sky-50 text-sky-700",
} as const;

export function TopCustomersTable({
  customers,
}: {
  customers: FrequentCustomer[];
}) {
  return (
    <ul className="divide-y divide-zinc-100">
      {customers.map((c, i) => (
        <li
          key={c.id}
          className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-600">
              {i + 1}
            </span>
            <div>
              <p className="font-medium text-zinc-900">{c.alias}</p>
              <p className="text-xs text-zinc-500">{c.ultimaVisita}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-sm text-zinc-800">
              {c.visitas30d} visitas
            </p>
            <div className="mt-0.5 flex items-center justify-end gap-2">
              <span className="text-xs text-zinc-500">
                ${c.ticketPromedioUsd} avg
              </span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase ${SEGMENTO_STYLE[c.segmento]}`}
              >
                {c.segmento}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
