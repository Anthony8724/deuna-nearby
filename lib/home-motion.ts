import type { Transition, Variants } from "framer-motion";

export const nativeSpring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 25,
};

export const nativeHover = {
  scale: 1.02,
  transition: nativeSpring,
};

export const nativeTap = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

export const nativeStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

export const nativeStaggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: nativeSpring },
};

export const nativeCardStagger = (index: number): Transition => ({
  ...nativeSpring,
  delay: index * 0.1,
});
