import { FLAGSHIP_MERCHANT_KPIS } from "@/app/data/platformSnapshot";
import { formatCount, formatUsdCompact } from "@/app/lib/format";

/** KPIs formateados para preview en landing (alineados al dashboard real) */
export function getDashboardPreviewKpis() {
  const k = FLAGSHIP_MERCHANT_KPIS;
  return [
    {
      v: formatCount(k.usuariosImpactados),
      l: "Usuarios impactados",
      d: `+${k.usuariosImpactadosDelta}%`,
    },
    { v: `${k.ctr}%`, l: "CTR push", d: `+${k.ctrDelta}pp` },
    {
      v: formatUsdCompact(k.ventasGeneradasUsd),
      l: "Ventas 7 días",
      d: `+${k.ventasDelta}%`,
    },
    { v: String(k.scoreEfectividadIa), l: "Score IA", d: "efectividad" },
  ] as const;
}
