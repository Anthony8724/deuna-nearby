"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
  Gift,
  GraduationCap,
  Plus,
  QrCode,
  ShieldCheck,
  Train,
} from "lucide-react";
import {
  nativeHover,
  nativeStaggerContainer,
  nativeStaggerItem,
  nativeTap,
} from "@/lib/home-motion";

const iconBoxClass =
  "flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-2xl bg-white text-[#5D21D0] shadow-[0_2px_12px_rgba(0,0,0,0.08)]";

const iconClass = "h-6 w-6";

const labelClass =
  "w-[4.5rem] text-center text-[11px] font-semibold leading-tight text-[#374151]";

const actions: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "transfer", label: "Transferir", icon: ArrowLeftRight },
  { id: "recharge", label: "Recargar", icon: Plus },
  { id: "charge", label: "Cobrar", icon: QrCode },
  { id: "metro", label: "Metro de Quito", icon: Train },
  { id: "invite", label: "Invita y Gana", icon: Gift },
  { id: "youth", label: "Deuna Jóvenes", icon: GraduationCap },
  { id: "verify", label: "Verificar pago", icon: ShieldCheck },
];

function QuickActionButton({
  label,
  icon: Icon,
}: {
  label: string;
  icon: LucideIcon;
}) {
  return (
    <motion.button
      type="button"
      whileHover={nativeHover}
      whileTap={nativeTap}
      className="flex flex-col items-center gap-2"
    >
      <span className={iconBoxClass}>
        <Icon className={iconClass} strokeWidth={1.75} />
      </span>
      <span className={labelClass}>{label}</span>
    </motion.button>
  );
}

export function QuickActionsGrid() {
  const primaryActions = actions.slice(0, 4);
  const secondaryActions = actions.slice(4);

  return (
    <motion.section
      variants={nativeStaggerContainer}
      initial="hidden"
      animate="show"
      className="px-5 pt-5"
      aria-label="Acciones rápidas"
    >
      <ul className="grid grid-cols-4 gap-x-2 gap-y-5">
        {primaryActions.map((action) => (
          <motion.li
            key={action.id}
            variants={nativeStaggerItem}
            className="flex justify-center"
          >
            <QuickActionButton label={action.label} icon={action.icon} />
          </motion.li>
        ))}
      </ul>

      <ul className="mt-5 flex justify-center gap-x-2">
        {secondaryActions.map((action) => (
          <motion.li
            key={action.id}
            variants={nativeStaggerItem}
            className="flex justify-center"
          >
            <QuickActionButton label={action.label} icon={action.icon} />
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
}
