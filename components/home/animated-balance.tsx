"use client";

import { useEffect, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { nativeSpring } from "@/lib/home-motion";

function formatBalance(value: number) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function AnimatedBalance({
  value,
  visible,
}: {
  value: number;
  visible: boolean;
}) {
  const spring = useSpring(value, { stiffness: 300, damping: 25, mass: 0.6 });
  const display = useTransform(spring, formatBalance);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      spring.set(value);
      mounted.current = true;
      return;
    }
    spring.set(value);
  }, [value, spring]);

  if (!visible) {
    return (
      <p className="text-balance mt-1 text-5xl font-bold leading-none tracking-tight text-[#1E1E1E]">
        $ ••••••
      </p>
    );
  }

  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={nativeSpring}
      className="text-balance mt-1 text-5xl font-bold leading-none tracking-tight text-[#1E1E1E]"
    >
      <motion.span>{display}</motion.span>
      <span className="ml-1.5">🤑</span>
    </motion.p>
  );
}
