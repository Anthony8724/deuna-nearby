import { NextResponse } from "next/server";
import { supabase } from "../../../src/lib/supabase";
import { calculateDistance } from "../../../src/lib/location-engine";

export async function GET() {

  const { data, error } = await supabase
    .from("businesses")
    .select("*");

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  // Ubicación simulada del usuario (Tulcán)
  const userLocation = {
    lat: 0.813,
    lng: -77.717
  };

  const nearbyBusinesses = data?.map((business) => {

    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      business.latitude,
      business.longitude
    );

    return {
      ...business,
      distanceKm: Number(distance.toFixed(2))
    };

  })
  .sort((a, b) => a.distanceKm - b.distanceKm);

  return NextResponse.json({

    userLocation,

    totalBusinesses:
      nearbyBusinesses?.length || 0,

    businesses:
      nearbyBusinesses

  });

}