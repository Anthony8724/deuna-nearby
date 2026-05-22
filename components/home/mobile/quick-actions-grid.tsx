"use client";

import { motion } from "framer-motion";

import { useWalletDemo } from "./wallet-demo-provider";
import {
  nativeHover,
  nativeStaggerContainer,
  nativeStaggerItem,
  nativeTap,
} from "@/lib/home-motion";

const iconBoxClass =
  "flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-2xl bg-white text-[2rem] leading-none shadow-[0_2px_12px_rgba(0,0,0,0.08)]";

const labelClass =
  "w-[4.5rem] text-center text-[11px] font-semibold leading-tight text-[#374151]";

const actions = [
  { id: "transfer", label: "Transferir", emoji: "💸" },
  { id: "recharge", label: "Recargar", emoji: "👛" },
  { id: "charge", label: "Cobrar", emoji: "🧮" },
  { id: "metro", label: "Metro de Quito", emoji: "🚇" },
  { id: "invite", label: "Invita y Gana", emoji: "🎁" },
  { id: "youth", label: "Deuna Jóvenes", emoji: "👤" },
  { id: "verify", label: "Verificar pago", emoji: "🛡️" },
] as const;

function QuickActionButton({
  actionId,
  label,
  emoji,
  onPress,
}: {
  actionId: string;
  label: string;
  emoji: string;
  onPress: (actionId: string) => void;
}) {
  return (
    <motion.button
      type="button"
      whileHover={nativeHover}
      whileTap={nativeTap}
      onClick={() => onPress(actionId)}
      className="flex flex-col items-center gap-2"
    >
      <span className={iconBoxClass}>{emoji}</span>
      <span className={labelClass}>{label}</span>
    </motion.button>
  );
}

export function QuickActionsGrid() {
  const { runQuickAction } = useWalletDemo();
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
            <QuickActionButton
              actionId={action.id}
              label={action.label}
              emoji={action.emoji}
              onPress={runQuickAction}
            />
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
            <QuickActionButton
              actionId={action.id}
              label={action.label}
              emoji={action.emoji}
              onPress={runQuickAction}
            />
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
}
