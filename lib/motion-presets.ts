import type { Transition, Variants } from "framer-motion";

export const springSmooth: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 32,
  mass: 0.75,
};

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 30,
  mass: 0.65,
};

export const springGentle: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 36,
  mass: 0.9,
};

export const springBouncy: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 26,
  mass: 0.75,
};

export const easePremium: Transition = {
  duration: 0.38,
  ease: [0.22, 1, 0.36, 1],
};

export const easeOutExpo: Transition = {
  duration: 0.42,
  ease: [0.16, 1, 0.3, 1],
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: easePremium },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.32 } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: springSmooth },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.06 },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.035, delayChildren: 0.04 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: easeOutExpo },
};

export const skeletonItem: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.28 } },
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 16 },
  show: { opacity: 1, x: 0, transition: springSmooth },
};

export const pageEnter: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.22 },
  },
};

export const hoverLift = {
  y: -2,
  transition: springSnappy,
};

export const hoverLiftSubtle = {
  y: -1,
  transition: springGentle,
};

export const hoverScaleSubtle = {
  scale: 1.015,
  transition: springSnappy,
};

export const tapScale = {
  scale: 0.97,
  transition: { duration: 0.1 },
};

export const tapScaleSoft = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

export const cardHover = {
  y: -3,
  scale: 1.008,
  transition: springSnappy,
};

export const pressableMotion = {
  whileHover: hoverLiftSubtle,
  whileTap: tapScaleSoft,
};

export const pressableCardMotion = {
  whileHover: cardHover,
  whileTap: tapScaleSoft,
};
