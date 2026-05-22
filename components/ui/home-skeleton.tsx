"use client";

import { motion } from "framer-motion";
import { Skeleton } from "./skeleton";
import { nativeSpring, nativeStaggerContainer, nativeStaggerItem } from "@/lib/home-motion";

export function HomeSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={nativeSpring}
      className="px-5 pb-24 pt-6"
    >
      <motion.div variants={nativeStaggerContainer} initial="hidden" animate="show">
        <motion.div variants={nativeStaggerItem}>
          <Skeleton className="h-8 w-36 rounded-lg" />
        </motion.div>
        <motion.div variants={nativeStaggerItem} className="mt-6">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="mt-3 h-12 w-44 rounded-lg" />
        </motion.div>
        <motion.div variants={nativeStaggerItem} className="mt-5 flex justify-between pb-5">
          <Skeleton className="h-4 w-48 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </motion.div>
        <motion.div variants={nativeStaggerItem} className="grid grid-cols-4 gap-2 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="mx-auto h-20 w-20 rounded-2xl" />
          ))}
        </motion.div>
        <motion.div variants={nativeStaggerItem} className="mt-5 flex justify-center gap-2">
          <Skeleton className="h-3 w-20 rounded-md" />
          <Skeleton className="h-3 w-24 rounded-md" />
          <Skeleton className="h-3 w-24 rounded-md" />
        </motion.div>
        <motion.div variants={nativeStaggerItem} className="mt-8">
          <Skeleton className="mb-3 h-6 w-32 rounded-md" />
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="mb-3 h-[4.5rem] w-full rounded-xl" />
          ))}
        </motion.div>
        <motion.div variants={nativeStaggerItem} className="mt-4 flex gap-3">
          <Skeleton className="h-14 flex-1 rounded-2xl" />
          <Skeleton className="h-14 flex-1 rounded-2xl" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
