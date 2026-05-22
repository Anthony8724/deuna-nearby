"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HomeSkeleton } from "@/components/ui/home-skeleton";
import { demoTimings, isDemoMode } from "@/constants/demo";
import { nativeStaggerContainer, nativeStaggerItem } from "@/lib/home-motion";
import {
  MobileWalletLayout,
  WalletHeader,
  BalanceCard,
  QuickActionsGrid,
  NearbySection,
  BottomCTASection,
} from "./mobile";

function WalletContent() {
  return (
    <motion.div variants={nativeStaggerContainer} initial="hidden" animate="show">
      <motion.div variants={nativeStaggerItem}>
        <WalletHeader />
      </motion.div>
      <motion.div variants={nativeStaggerItem}>
        <BalanceCard />
      </motion.div>
      <motion.div variants={nativeStaggerItem}>
        <QuickActionsGrid />
      </motion.div>
      <motion.div variants={nativeStaggerItem}>
        <NearbySection />
      </motion.div>
      <motion.div variants={nativeStaggerItem}>
        <BottomCTASection />
      </motion.div>
    </motion.div>
  );
}

export function DeunaHome() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), demoTimings.homeReadyMs);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MobileWalletLayout
      ready={ready}
      demoBar={isDemoMode()}
      skeleton={<HomeSkeleton />}
    >
      <WalletContent />
    </MobileWalletLayout>
  );
}
