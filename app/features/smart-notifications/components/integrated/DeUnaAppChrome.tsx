"use client";



import { ChevronLeft, MoreHorizontal } from "lucide-react";



import { deuna } from "../../styles/deuna-ui";

import { NearbyContextPill } from "./NearbyContextPill";



type DeUnaAppChromeProps = {

  screen: "wallet" | "nearby";

  ubicacionLabel?: string;

  onBack?: () => void;

  onMenuPress?: () => void;

};



export function DeUnaAppChrome({

  screen,

  ubicacionLabel = "Tu zona",

  onBack,

  onMenuPress,

}: DeUnaAppChromeProps) {

  const isNearby = screen === "nearby";



  return (

    <header className={`shrink-0 ${deuna.header}`}>

      <div className="flex items-center gap-3 px-4 py-3">

        {isNearby && onBack ? (

          <button

            type="button"

            onClick={onBack}

            className={`flex h-10 w-10 items-center justify-center ${deuna.btnGhost}`}

            aria-label="Volver a inicio"

          >

            <ChevronLeft className="h-5 w-5" />

          </button>

        ) : (

          <div className={`h-10 w-10 ${deuna.logoMark}`}>

            <span className="text-sm font-bold text-white">d!</span>

          </div>

        )}

        <div className="min-w-0 flex-1">

          <p className={`text-[18px] font-bold leading-tight ${deuna.textPrimary}`}>

            DeUna

          </p>

          <p className={`text-[12px] ${deuna.textSecondary}`}>

            {isNearby ? "Nearby Moments" : "Inicio"}

          </p>

        </div>

        {isNearby ? (

          <button

            type="button"

            onClick={onMenuPress}

            className={`flex h-10 w-10 items-center justify-center ${deuna.btnGhost}`}

            aria-label="Cambiar zona"

          >

            <MoreHorizontal className="h-5 w-5" />

          </button>

        ) : null}

      </div>

      {isNearby ? (

        <div className="border-t border-[#F0F0F4] bg-[#FAFAFC] px-4 py-2.5">

          <NearbyContextPill ubicacionLabel={ubicacionLabel} />

        </div>

      ) : null}

    </header>

  );

}


