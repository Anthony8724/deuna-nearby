import Link from "next/link";
import { BarChart3, Home, Store, Wallet } from "lucide-react";

type DashboardHeaderProps = {
  feature: string;
  source: "live" | "fallback";
};

export function DashboardHeader({ feature, source }: DashboardHeaderProps) {
  return (
    <header className="border-b border-black/[0.06] bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-6 sm:px-8 sm:py-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-primary-muted px-3 py-1 text-xs font-semibold text-brand-primary">
            <BarChart3 className="h-3.5 w-3.5" aria-hidden />
            {feature}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E1E1E] sm:text-3xl">
            Dashboard DeUna Nearby
          </h1>
          <p className="mt-1 text-sm text-[#6B7280] sm:text-base">
            Impacto para comercios y usuarios
          </p>
          {source === "live" ? (
            <p className="mt-2 text-xs font-medium text-brand-primary">
              Datos en vivo desde Supabase
            </p>
          ) : (
            <p className="mt-2 text-xs font-medium text-[#9CA3AF]">
              Vista demo — conecta Supabase para datos en vivo
            </p>
          )}
        </div>

        <nav
          className="flex flex-wrap gap-2"
          aria-label="Navegación del demo"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-3 py-2 text-xs font-semibold text-[#374151] shadow-sm transition hover:border-brand-primary/20 hover:text-brand-primary sm:text-sm"
          >
            <Home className="h-4 w-4" aria-hidden />
            Usuario
          </Link>
          <Link
            href="/comercio/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-3 py-2 text-xs font-semibold text-[#374151] shadow-sm transition hover:border-brand-primary/20 hover:text-brand-primary sm:text-sm"
          >
            <Store className="h-4 w-4" aria-hidden />
            Comercio
          </Link>
          <span className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-3 py-2 text-xs font-semibold text-white shadow-brand sm:text-sm">
            <Wallet className="h-4 w-4" aria-hidden />
            Impacto
          </span>
        </nav>
      </div>
    </header>
  );
}
