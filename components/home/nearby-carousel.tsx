"use client";

import { NearbyCarouselCard } from "./nearby-carousel-card";
import { useNearby } from "@/context/nearby-context";

/** @deprecated Usar SmartRecommendationsSection para incluir recomendaciones IA */
export function NearbyCarousel() {
  const { visibleMoments } = useNearby();

  if (visibleMoments.length === 0) return null;

  return (
    <section className="home-section-wide mt-9" aria-labelledby="nearby-carousel-title">
      <div className="home-section mb-4 flex items-center justify-between">
        <h2 id="nearby-carousel-title" className="text-section-title">
          Cerca de ti
        </h2>
        <button type="button" className="text-xs font-semibold text-brand-primary">
          Ver todo
        </button>
      </div>

      <div className="overflow-x-auto pb-1 scrollbar-hide scroll-smooth">
        <ul className="flex snap-x snap-mandatory gap-3.5 px-[1.125rem] lg:px-5">
          {visibleMoments.map((moment, i) => (
            <NearbyCarouselCard key={moment.id} moment={moment} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
