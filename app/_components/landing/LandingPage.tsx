"use client";



import { DashboardPreviewSection } from "./DashboardPreviewSection";

import { FinalCtaSection } from "./FinalCtaSection";

import { HeroSection } from "./HeroSection";

import { HowAiWorksSection } from "./HowAiWorksSection";

import { LandingBackground } from "./LandingBackground";

import { LandingNav } from "./LandingNav";

import { MerchantBenefitsSection } from "./MerchantBenefitsSection";

import { NearbyMomentsSection } from "./NearbyMomentsSection";

import { UserBenefitsSection } from "./UserBenefitsSection";



export function LandingPage() {

  return (

    <div className="relative min-h-screen bg-black text-white">

      <LandingBackground />

      <LandingNav />

      <main>

        <HeroSection />

        <HowAiWorksSection />

        <NearbyMomentsSection />

        <UserBenefitsSection />

        <MerchantBenefitsSection />

        <DashboardPreviewSection />

        <FinalCtaSection />

      </main>

      <footer className="border-t border-white/[0.06] py-10 text-center text-[11px] text-white/30">

        © {new Date().getFullYear()} DeUna Nearby. Todos los derechos reservados.

      </footer>

    </div>

  );

}

