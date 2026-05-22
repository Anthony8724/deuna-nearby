import { NextResponse } from "next/server";
import { generateNearbyMoment } from "../../../src/lib/notification-engine";

export async function GET() {

const notification =
generateNearbyMoment(
"Hamburguesas",
"Burger Factory",
250,
15
);

return NextResponse.json({
title:"DeUna Nearby",
message:notification
});

}