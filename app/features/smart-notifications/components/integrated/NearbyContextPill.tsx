"use client";



import { MapPin } from "lucide-react";



import { deuna } from "../../styles/deuna-ui";



type NearbyContextPillProps = {

  ubicacionLabel: string;

};



export function NearbyContextPill({ ubicacionLabel }: NearbyContextPillProps) {

  return (

    <p className={`flex items-center gap-1.5 text-[12px] ${deuna.textSecondary}`}>

      <MapPin className={`h-3.5 w-3.5 shrink-0 ${deuna.brandText}`} />

      <span>

        Promos cerca de{" "}

        <span className={`font-semibold ${deuna.textPrimary}`}>{ubicacionLabel}</span>

      </span>

    </p>

  );

}


