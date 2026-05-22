import type { ReactNode } from "react";

type DemoBadgeVariant = "default" | "live" | "ai" | "partner";

const STYLES: Record<DemoBadgeVariant, string> = {
  default: "border-white/[0.12] bg-white/[0.04] text-white/70",
  live: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300/90",
  ai: "border-[#635bff]/30 bg-[#635bff]/10 text-[#c4c0ff]",
  partner: "border-white/20 bg-white/[0.06] text-white/75",
};

export function DemoBadge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: DemoBadgeVariant;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${STYLES[variant]}`}
    >
      {children}
    </span>
  );
}
