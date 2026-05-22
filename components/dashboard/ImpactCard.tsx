import { Sparkles } from "lucide-react";

type ImpactCardProps = {
  impact: string;
};

export function ImpactCard({ impact }: ImpactCardProps) {
  return (
    <article className="rounded-2xl bg-linear-to-br from-brand-primary to-brand-indigo p-5 text-white shadow-brand sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
          <Sparkles className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
        <div>
          <h2 className="text-base font-bold sm:text-lg">Impacto</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/90 sm:text-[15px]">
            {impact}
          </p>
        </div>
      </div>
    </article>
  );
}
