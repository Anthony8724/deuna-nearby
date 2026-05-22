import { NextResponse } from "next/server";
import { supabase } from "../../../src/lib/supabase";
import { calculateDistance } from "../../../src/lib/location-engine";

type Merchant = {
  id: string;
  name: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
};

type NearbyMerchant = Merchant & {
  distanceKm: number;
};

export async function GET() {
  const userLocation = {
    lat: 0.813,
    lng: -77.717,
  };

  const { data, error } = await supabase.rpc(
    "get_nearby_merchants_with_user_stats",
    {
      user_lat: userLocation.lat,
      user_lng: userLocation.lng,
    }
  );

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const nearbyBusinesses: NearbyMerchant[] = (data as Merchant[]).map(
    (business: Merchant) => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        business.latitude,
        business.longitude
      );

      return {
        ...business,
        distanceKm: Number(distance.toFixed(2)),
      };
    }
  );

  nearbyBusinesses.sort(
    (a: NearbyMerchant, b: NearbyMerchant) =>
      a.distanceKm - b.distanceKm
  );

  return NextResponse.json({
    source: "supabase",
    userLocation,
    totalBusinesses: nearbyBusinesses.length,
    businesses: nearbyBusinesses,
  });
}