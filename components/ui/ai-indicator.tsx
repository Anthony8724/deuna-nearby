import type { AiContextType } from "@/constants/context-intelligence";
import { cn } from "@/lib/cn";

export function AiSparkle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={cn("h-3 w-3", className)}
      aria-hidden
    >
      <path d="M8 1l1.2 3.8L13 6l-3.8 1.2L8 11l-1.2-3.8L3 6l3.8-1.2L8 1z" />
    </svg>
  );
}

export function AiPulseDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex h-2 w-2 shrink-0", className)}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-primary/30 opacity-60" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(91,33,182,0.35)]" />
    </span>
  );
}

type AiBadgeProps = {
  label: string;
  variant?: "subtle" | "solid" | "ghost";
  className?: string;
};

export function AiBadge({ label, variant = "subtle", className }: AiBadgeProps) {
  const styles = {
    subtle:
      "bg-brand-primary-muted text-brand-primary ring-1 ring-brand-primary/12",
    solid:
      "bg-brand-primary text-white shadow-brand-soft",
    ghost: "bg-transparent text-brand-primary/80",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide",
        styles[variant],
        className,
      )}
    >
      <AiSparkle className="opacity-80" />
      {label}
    </span>
  );
}

type AiContextBadgeProps = {
  type?: AiContextType;
  label?: string;
  className?: string;
};

export function AiContextBadge({ type, label, className }: AiContextBadgeProps) {
  const typeLabels: Record<AiContextType, string> = {
    habits: "Basado en tus hábitos",
    frequency: "Basado en tus hábitos",
    location: "Cerca de ti",
    promo: "Promo relevante",
  };

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 truncate rounded-md bg-brand-primary-muted px-1.5 py-0.5 text-[9px] font-bold text-brand-primary ring-1 ring-brand-primary/10",
        className,
      )}
    >
      <AiSparkle className="h-2.5 w-2.5 shrink-0 opacity-70" />
      <span className="truncate">{label ?? (type ? typeLabels[type] : "IA contextual")}</span>
    </span>
  );
}

type AiInsightProps = {
  message: string;
  className?: string;
  compact?: boolean;
};

export function AiInsight({ message, className, compact }: AiInsightProps) {
  return (
    <p
      className={cn(
        "flex items-start gap-1.5 text-text-secondary",
        compact ? "text-[10px] leading-snug" : "text-xs leading-relaxed",
        className,
      )}
    >
      <AiSparkle className="mt-0.5 shrink-0 text-brand-primary/55" />
      <span>{message}</span>
    </p>
  );
}

type AiContextStripProps = {
  message: string;
  badge?: string;
  className?: string;
  compact?: boolean;
};

export function AiContextStrip({
  message,
  badge = "DeUna Inteligente",
  className,
  compact = false,
}: AiContextStripProps) {
  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl bg-brand-primary-muted/50 px-3 py-2 ring-1 ring-brand-primary/8",
          className,
        )}
      >
        <AiPulseDot />
        <p className="min-w-0 flex-1 text-[11px] font-medium leading-snug text-foreground/85">
          {message}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-brand-primary/10 bg-linear-to-r from-brand-primary-muted/80 via-white to-brand-primary-muted/30 px-4 py-3 shadow-[0_2px_12px_rgba(91,33,182,0.06)]",
        className,
      )}
    >
      <AiPulseDot />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-brand-primary/75">
          {badge}
        </p>
        <p className="mt-0.5 text-[0.8125rem] font-medium leading-snug tracking-tight text-foreground/90">
          {message}
        </p>
      </div>
    </div>
  );
}

type AiSectionHintProps = {
  badge?: string;
  message: string;
  className?: string;
};

export function AiSectionHint({ badge = "IA contextual", message, className }: AiSectionHintProps) {
  return (
    <div className={cn("mb-3", className)}>
      <AiBadge label={badge} variant="subtle" className="mb-2" />
      <AiInsight message={message} />
    </div>
  );
}

export function AiTag({
  type,
  className,
}: {
  type: AiContextType;
  className?: string;
}) {
  const labels: Record<AiContextType, string> = {
    habits: "Hábitos",
    frequency: "Frecuencia",
    location: "Ubicación",
    promo: "Promo",
  };

  return (
    <span
      className={cn(
        "rounded-md bg-brand-primary-muted px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-brand-primary/70",
        className,
      )}
    >
      {labels[type]}
    </span>
  );
}
