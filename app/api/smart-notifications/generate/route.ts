import { NextResponse } from "next/server";

import { generateSmartNotification } from "@/app/features/smart-notifications/services/notificationGenerator";
import type { Recomendacion } from "@/app/features/smart-notifications/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      recomendacion?: Recomendacion;
      userName?: string;
      userId?: string;
    };

    if (!body.recomendacion?.id) {
      return NextResponse.json(
        { error: "Falta el campo recomendacion válido (id)." },
        { status: 400 },
      );
    }

    const resultado = await generateSmartNotification(
      body.recomendacion,
      body.userName,
      { userId: body.userId },
    );

    return NextResponse.json(resultado);
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "Error al generar notificación.";
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}
