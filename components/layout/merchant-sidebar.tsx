"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WALLET_ROUTE } from "@/lib/demo-routes";

const EXPANDED_WIDTH = 260;

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/comercio/dashboard",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M4 12h8M4 18h16"
      />
    ),
  },
  {
    id: "ventas",
    label: "Ventas",
    href: "/comercio/dashboard#ventas",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    ),
  },
  {
    id: "qr",
    label: "QR y cobros",
    href: "/comercio/dashboard#qr",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4v1m6 11h1M12 19v1M4 15H3m15-6h1M7 7h10a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z"
      />
    ),
  },
  {
    id: "clientes",
    label: "Clientes",
    href: "/comercio/dashboard#clientes",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
      />
    ),
  },
  {
    id: "promos",
    label: "Promociones",
    href: "/comercio/dashboard#promos",
    badge: "2",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v13m0-13V6a4 4 0 00-4-4H5.5M12 8h7.5"
      />
    ),
  },
  {
    id: "reportes",
    label: "Reportes",
    href: "/comercio/dashboard#reportes",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    ),
  },
];

function NavIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="h-5 w-5"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function MerchantSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-xl glass lg:hidden"
        aria-label="Abrir menú del comercio"
      >
        <NavIcon>
          <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
        </NavIcon>
      </button>

      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[260px] flex-col border-r border-white/6 glass lg:flex">
        <SidebarContent pathname={pathname} />
      </aside>

      <div className="hidden w-[260px] shrink-0 lg:block" aria-hidden />

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -EXPANDED_WIDTH }}
              animate={{ x: 0 }}
              exit={{ x: -EXPANDED_WIDTH }}
              transition={{ type: "spring", stiffness: 400, damping: 38 }}
              className="fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col border-r border-white/6 glass lg:hidden"
            >
              <SidebarContent
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/6 px-5 py-5">
        <Link
          href="/comercio/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-accent-secondary to-accent text-sm font-bold text-background">
            CA
          </div>
          <div className="leading-none">
            <p className="text-sm font-semibold">Café Aurora</p>
            <p className="text-[10px] uppercase tracking-[0.15em] text-accent">
              Comercio
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Panel comercio">
        {navItems.map((item) => {
          const active = pathname === item.href.split("#")[0];
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onNavigate}
              className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "text-foreground"
                  : "text-muted hover:bg-white/5 hover:text-foreground"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="merchant-nav-active"
                  className="absolute inset-0 rounded-xl bg-linear-to-r from-accent-secondary/15 to-accent/10 ring-1 ring-accent/25"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10 text-accent">
                <NavIcon>{item.icon}</NavIcon>
              </span>
              <span className="relative z-10 flex-1">{item.label}</span>
              {item.badge && (
                <span className="relative z-10 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-muted">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/6 p-4">
        <Link
          href={WALLET_ROUTE}
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-foreground"
        >
          <NavIcon>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </NavIcon>
          Volver a Nearby
        </Link>
      </div>
    </div>
  );
}
