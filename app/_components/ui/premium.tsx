/** Tokens y clases compartidas — estética Stripe/Uber (oscuro marketing + dashboard claro) */

export const premium = {
  page: "bg-black text-white",
  meshWrap: "pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black premium-mesh",
  eyebrow:
    "inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70",
  h1: "text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl xl:text-[4.25rem] xl:leading-[1.05]",
  h2: "text-3xl font-semibold tracking-[-0.025em] text-white sm:text-4xl",
  lead: "text-lg leading-relaxed text-white/[0.62] sm:text-xl",
  body: "text-sm leading-relaxed text-white/[0.45]",
  card:
    "rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl transition-colors duration-300 premium-card-hover",
  cardLg:
    "rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl transition-all duration-300 premium-card-hover",
  metric:
    "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-md",
  nav:
    "fixed top-0 z-50 w-full border-b border-white/[0.06] bg-black/70 backdrop-blur-2xl backdrop-saturate-150",
  btnPrimary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition hover:bg-white/92 active:scale-[0.98]",
  btnSecondary:
    "inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.18] bg-transparent px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/[0.06]",
  btnAccent:
    "inline-flex items-center justify-center gap-2 rounded-full bg-[#635bff] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(99,91,255,0.35)] transition hover:bg-[#7a73ff] active:scale-[0.98]",
  accentText: "text-[#a5a0ff]",
  divider: "border-white/[0.06]",
} as const;

export const dashboard = {
  page: "min-h-screen bg-[#f6f9fc]",
  card: "rounded-xl border border-zinc-200/70 bg-white shadow-stripe",
  cardLg: "rounded-xl border border-zinc-200/70 bg-white p-5 shadow-stripe sm:p-6",
  sidebar: "border-r border-white/10 bg-[#0a2540] text-white",
  sidebarLink:
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/65 transition hover:bg-white/[0.06] hover:text-white",
  sidebarLinkActive: "bg-white/10 text-white",
  header: "sticky top-0 z-30 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl",
} as const;
