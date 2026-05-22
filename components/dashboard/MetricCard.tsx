import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
};

export function MetricCard({ label, value, icon: Icon, hint }: MetricCardProps) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[#6B7280]">{label}</p>
          <p className="mt-2 text-balance text-2xl font-bold tracking-tight text-[#1E1E1E] sm:text-[1.75rem]">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 text-xs text-[#9CA3AF]">{hint}</p>
          ) : null}
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-primary-muted text-brand-primary">
          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
      </div>
    </article>
  );
}
