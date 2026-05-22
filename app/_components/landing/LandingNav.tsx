"use client";

import { motion } from "framer-motion";
import { Radar } from "lucide-react";
import Link from "next/link";

import { premium } from "@/app/_components/ui/premium";
import { LANDING_ROUTE, LOCK_SCREEN_ROUTE } from "@/lib/demo-routes";

const LINKS = [
  { href: "#como-funciona", label: "Producto" },
  { href: "#billetera-demo", label: "App móvil" },
  { href: "#nearby-moments", label: "Moments" },
  { href: "#comercios", label: "Comercios" },
  { href: "#dashboard", label: "Impacto" },
  { href: "#impacto-pitch", label: "Pitch" },
] as const;

export function LandingNav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={premium.nav}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href={LOCK_SCREEN_ROUTE} className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
            <Radar className="h-4 w-4 text-black" strokeWidth={2.25} />
          </div>
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-white">
            DeUna Nearby
          </span>
        </Link>
        <nav className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium text-white/50 transition hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/dashboard"
            className="hidden text-[13px] font-medium text-white/55 transition hover:text-white sm:inline"
          >
            Impacto
          </Link>
          <Link href={LOCK_SCREEN_ROUTE} className={premium.btnPrimary}>
            Ver demo
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
