"use client";

import { motion } from "framer-motion";
import { nativeStaggerContainer, nativeStaggerItem } from "@/lib/home-motion";

import {
  BalanceCard,
  BottomCTASection,
  QuickActionsGrid,
  WalletHeader,
} from "./mobile";
import { WalletGeoSection } from "./mobile/wallet-geo-section";

export function DeunaWalletScreen() {
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
        <WalletGeoSection />
      </motion.div>
      <motion.div variants={nativeStaggerItem}>
        <BottomCTASection />
      </motion.div>
    </motion.div>
  );
}
