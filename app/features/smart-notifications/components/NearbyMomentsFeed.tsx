"use client";



import { motion } from "framer-motion";

import { ChevronRight } from "lucide-react";



import { formatBeneficioFromRecomendacion } from "../lib/beneficios";

import { formatDistancia, formatScorePct } from "../lib/format";

import { deuna } from "../styles/deuna-ui";

import type { Recomendacion } from "../types";

import { categoryEmoji } from "./integrated/categoryEmoji";



export type NearbyMomentsFeedProps = {

  items: Recomendacion[];

  activeId?: string;

  onSelect: (rec: Recomendacion) => void;

  loading?: boolean;

  maxItems?: number;

  title?: string;

  className?: string;

  compact?: boolean;

};



function CompactFeedRow({

  rec,

  index,

  active,

  onSelect,

}: {

  rec: Recomendacion;

  index: number;

  active: boolean;

  onSelect: () => void;

}) {

  const beneficio = formatBeneficioFromRecomendacion(rec);

  const emoji = categoryEmoji(rec.categoria);

  const affinity = formatScorePct(rec.score);



  return (

    <motion.button

      type="button"

      layout

      initial={{ opacity: 0, y: 8 }}

      animate={{ opacity: 1, y: 0 }}

      transition={{ delay: index * 0.04, duration: 0.35 }}

      whileTap={{ scale: 0.98 }}

      onClick={onSelect}

      className={`flex w-full touch-manipulation overflow-hidden rounded-[16px] text-left transition-shadow ${

        active

          ? `${deuna.card} ring-2 ring-[#5D2A8E]/40`

          : deuna.card

      }`}

    >

      <div

        className={`relative flex h-[72px] w-[72px] shrink-0 items-center justify-center text-2xl ${deuna.merchantBanner}`}

      >

        {emoji}

        <span

          className={`absolute bottom-1.5 left-1.5 rounded-md px-1.5 py-0.5 text-[9px] font-bold text-white ${deuna.brand}`}

        >

          {affinity}

        </span>

      </div>

      <div className="flex min-w-0 flex-1 items-center gap-2 p-3">

        <div className="min-w-0 flex-1">

          <p className={`line-clamp-1 text-[14px] font-bold ${deuna.textPrimary}`}>

            {rec.nombreComercial}

          </p>

          <p className={`mt-0.5 line-clamp-1 text-[12px] ${deuna.benefitText}`}>

            {beneficio.texto}

          </p>

          <p className={`mt-0.5 text-[11px] ${deuna.textMuted}`}>

            {formatDistancia(rec.distanciaMetros)}

          </p>

        </div>

        <span

          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#EBEBEF] bg-white ${deuna.brandText}`}

        >

          <ChevronRight className="h-4 w-4" strokeWidth={2.5} />

        </span>

      </div>

    </motion.button>

  );

}



export function NearbyMomentsFeed({

  items,

  activeId,

  onSelect,

  loading = false,

  maxItems = 10,

  title = "Más cerca de ti",

  className = "",

  compact = false,

}: NearbyMomentsFeedProps) {

  const slice = items

    .filter((rec) => (compact && activeId ? rec.id !== activeId : true))

    .slice(0, maxItems);



  if (!loading && slice.length === 0) {

    return null;

  }



  return (

    <section className={className}>

      <header className="mb-3 flex items-center justify-between px-4">

        <h3 className={deuna.sectionTitle}>{title}</h3>

        <span className={`text-[12px] font-medium ${deuna.textMuted}`}>

          {loading ? "Buscando…" : `${slice.length} más`}

        </span>

      </header>



      <div className="flex flex-col gap-3 px-4">

        {loading

          ? Array.from({ length: 2 }).map((_, i) => (

              <div

                key={i}

                className="h-[72px] animate-pulse rounded-[16px] bg-white border border-[#EBEBEF]"

              />

            ))

          : slice.map((rec, i) => (

              <CompactFeedRow

                key={rec.id}

                rec={rec}

                index={i}

                active={rec.id === activeId}

                onSelect={() => onSelect(rec)}

              />

            ))}

      </div>

    </section>

  );

}


