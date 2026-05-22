"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/cn";
import {
  cardHover,
  springGentle,
  springSmooth,
  tapScaleSoft,
} from "@/lib/motion-presets";

type AnimatedNumberProps = {
  value: number;
  format?: (value: number) => string;
  animateFromZero?: boolean;
  className?: string;
};

export function AnimatedNumber({
  value,
  format = (v) => v.toFixed(0),
  animateFromZero = true,
  className,
}: AnimatedNumberProps) {
  const spring = useSpring(value, { stiffness: 120, damping: 28, mass: 0.55 });
  const display = useTransform(spring, format);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current && animateFromZero) {
      spring.set(0);
      mounted.current = true;
    }
    spring.set(value);
  }, [value, spring, animateFromZero]);

  return (
    <motion.span className={cn("text-balance inline-block", className)}>
      {display}
    </motion.span>
  );
}

export function formatUsd(value: number) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

type MotionPressableProps = HTMLMotionProps<"button"> & {
  lift?: boolean;
};

export function MotionPressable({
  className,
  lift = true,
  children,
  ...props
}: MotionPressableProps) {
  return (
    <motion.button
      whileHover={lift ? { y: -2, transition: springGentle } : undefined}
      whileTap={tapScaleSoft}
      transition={springSmooth}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}

type MotionCardProps = HTMLMotionProps<"div"> & {
  floating?: boolean;
};

export function MotionCard({
  className,
  floating: _floating = false,
  children,
  ...props
}: MotionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={cardHover}
      whileTap={tapScaleSoft}
      transition={springSmooth}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** @deprecated Use Skeleton from ./skeleton — CSS-only shimmer */
export function MotionSkeleton({
  className,
  delay: _delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={cn("skeleton rounded-xl", className)}
      aria-hidden
    />
  );
}

/** @deprecated Infinite float removed for performance — renders children as-is */
export function Floating({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  slow?: boolean;
}) {
  return <div className={className}>{children}</div>;
}
