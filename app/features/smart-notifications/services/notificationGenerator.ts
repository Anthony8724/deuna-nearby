/**
 * Generador de notificaciones con IA (OpenAI / xAI Grok).
 * Usar solo en servidor: Route Handlers, Server Actions o scripts Node.
 */

import OpenAI from "openai";

import { formatBeneficioFromRecomendacion } from "../lib/beneficios";
import { pushConversationalMessage } from "../lib/nearbyCopy";
import type {
  NotificationContentSource,
  Recomendacion,
  SmartNotification,
  SmartNotificationContent,
} from "../types";

/** Límite de caracteres para el cuerpo de notificaciones push */
export const MAX_BODY_LENGTH = 140;

const MAX_TITLE_LENGTH = 40;
const DEFAULT_ACTION_TEXT = "Ver promo";

/** Pesos para elegir la variante fallback según el perfil de la recomendación */
const VARIANT_ALIGNMENT_WEIGHT = 0.6;
const VARIANT_GLOBAL_SCORE_WEIGHT = 0.4;

/** Mensaje de sistema para el modelo */
const SYSTEM_PROMPT = [
  "Eres copywriter de DeUna, app fintech de pagos en Ecuador.",
  "Escribes pushes cortos: cercanos, inteligentes, modernos — nunca robóticos ni genéricos.",
  "Incluye beneficio claro (descuento, cashback, 2x1) y sensación de «ahora» y cercanía.",
  "Ejemplos de tono: «Vimos que últimamente te interesan hamburguesas. Burger Factory está a 250m y tiene beneficio DeUna.»",
  "Usa «Vimos que últimamente te interesan…» + nombre del comercio + distancia compacta (250m) + beneficio DeUna.",
  "Evita «estimado usuario», «oferta exclusiva» o frases de plantilla. Máximo un emoji en el título.",
  "No inventes datos que contradigan el contexto.",
].join(" ");

type BeneficioTipo = "descuento" | "cashback" | "ahorro";

type Beneficio = {
  tipo: BeneficioTipo;
  texto: string;
};

type VarianteId = "conversacional" | "cercania" | "lealtad" | "promocion";

type VarianteNotificacion = {
  id: VarianteId;
  generar: (
    recomendacion: Recomendacion,
    beneficio: Beneficio,
    userName?: string,
    userId?: string,
  ) => SmartNotificationContent;
};

/** Códigos de error del generador */
export type NotificationGeneratorErrorCode =
  | "MISSING_API_KEY"
  | "API_ERROR"
  | "INVALID_RESPONSE"
  | "EMPTY_RESPONSE";

/**
 * Error explícito al fallar la generación con IA.
 * `generateSmartNotification` captura estos errores y usa fallback salvo `throwOnError`.
 */
export class NotificationGeneratorError extends Error {
  readonly code: NotificationGeneratorErrorCode;

  constructor(
    code: NotificationGeneratorErrorCode,
    message: string,
    options?: { cause?: unknown },
  ) {
    super(message);
    this.name = "NotificationGeneratorError";
    this.code = code;
    if (options?.cause !== undefined) {
      this.cause = options.cause;
    }
  }
}

export type GenerateSmartNotificationResult = {
  content: SmartNotificationContent;
  source: NotificationContentSource;
};

/**
 * Crea el cliente OpenAI compatible con OpenAI o xAI (Grok).
 * Prioridad: XAI_API_KEY → OPENAI_API_KEY.
 */
export function createAIClient(): OpenAI | null {
  const xaiKey = process.env.XAI_API_KEY?.trim();
  if (xaiKey) {
    return new OpenAI({
      apiKey: xaiKey,
      baseURL: process.env.XAI_BASE_URL?.trim() || "https://api.x.ai/v1",
    });
  }

  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  if (openaiKey) {
    return new OpenAI({ apiKey: openaiKey });
  }

  return null;
}

/** Modelo según el proveedor configurado en variables de entorno */
function resolveModel(): string {
  if (process.env.XAI_API_KEY?.trim()) {
    return process.env.XAI_MODEL?.trim() || "grok-2-1212";
  }
  return process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
}

function trimBody(text: string, maxLength = MAX_BODY_LENGTH): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  const slice = normalized.slice(0, maxLength - 1);
  const lastSpace = slice.lastIndexOf(" ");

  if (lastSpace > maxLength * 0.65) {
    return `${slice.slice(0, lastSpace).trim()}…`;
  }

  return `${slice.trim()}…`;
}

function trimTitle(title: string): string {
  const normalized = title.replace(/\s+/g, " ").trim();
  if (normalized.length <= MAX_TITLE_LENGTH) return normalized;
  return `${normalized.slice(0, MAX_TITLE_LENGTH - 1).trim()}…`;
}

function buildSaludo(userName?: string): string {
  if (!userName?.trim()) return "Oye,";
  const nombre = userName.trim().split(/\s+/)[0];
  return `${nombre},`;
}

function describeDistancia(distanciaMetros: number): string {
  if (distanciaMetros < 150) return "tienes a la vuelta";
  if (distanciaMetros < 400) return "tienes cerca";
  if (distanciaMetros < 1000) return "está a un paso";
  return "está en tu zona:";
}

export function inferBeneficio(recomendacion: Recomendacion): Beneficio {
  const resumen = formatBeneficioFromRecomendacion(recomendacion);
  const tipoMap: Record<typeof resumen.tipo, BeneficioTipo> = {
    descuento: "descuento",
    cashback: "cashback",
    ahorro: "ahorro",
    "2x1": "descuento",
    envio: "ahorro",
  };
  return { tipo: tipoMap[resumen.tipo], texto: resumen.texto };
}

const FALLBACK_TEMPLATES: Record<
  VarianteId,
  (ctx: {
    saludo: string;
    comercio: string;
    beneficio: string;
    distanciaTexto: string;
    conversacional?: string;
  }) => SmartNotificationContent
> = {
  conversacional: ({ conversacional }) => ({
    title: "👀 Para ti",
    body: trimBody(conversacional ?? ""),
    actionText: "Ver oferta",
  }),
  cercania: ({ saludo, comercio, beneficio, distanciaTexto }) => ({
    title: "👀 Cerca de ti",
    body: trimBody(
      `${saludo} ${distanciaTexto} ${comercio} — ${beneficio}. Aprovecha mientras estás cerca.`,
    ),
    actionText: "Ver promo",
  }),
  lealtad: ({ saludo, comercio, beneficio }) => ({
    title: "💜 Te conocemos",
    body: trimBody(
      `${saludo} Vuelves a ${comercio} y hoy tienes ${beneficio}. Vale la pena pasar.`,
    ),
    actionText: "Usar ahora",
  }),
  promocion: ({ saludo, comercio, beneficio }) => ({
    title: "✨ Promo activa",
    body: trimBody(
      `${saludo} En ${comercio}: ${beneficio}. Perfecto para esta hora del día.`,
    ),
    actionText: "Ver promo",
  }),
};

const varianteConversacional: VarianteNotificacion = {
  id: "conversacional",
  generar: (recomendacion, _beneficio, _userName, userId = "guest") =>
    FALLBACK_TEMPLATES.conversacional({
      saludo: "",
      comercio: recomendacion.nombreComercial,
      beneficio: "",
      distanciaTexto: "",
      conversacional: pushConversationalMessage(recomendacion, userId),
    }),
};

const varianteCercania: VarianteNotificacion = {
  id: "cercania",
  generar: (recomendacion, beneficio, userName) => {
    const saludo = buildSaludo(userName);
    const distanciaTexto = describeDistancia(recomendacion.distanciaMetros);
    return FALLBACK_TEMPLATES.cercania({
      saludo,
      comercio: recomendacion.nombre,
      beneficio: beneficio.texto,
      distanciaTexto,
    });
  },
};

const varianteLealtad: VarianteNotificacion = {
  id: "lealtad",
  generar: (recomendacion, beneficio, userName) => {
    const saludo = buildSaludo(userName);
    return FALLBACK_TEMPLATES.lealtad({
      saludo,
      comercio: recomendacion.nombre,
      beneficio: beneficio.texto,
      distanciaTexto: "",
    });
  },
};

const variantePromocion: VarianteNotificacion = {
  id: "promocion",
  generar: (recomendacion, beneficio, userName) => {
    const saludo = buildSaludo(userName);
    return FALLBACK_TEMPLATES.promocion({
      saludo,
      comercio: recomendacion.nombre,
      beneficio: beneficio.texto,
      distanciaTexto: "",
    });
  },
};

const VARIANTES: VarianteNotificacion[] = [
  varianteConversacional,
  varianteCercania,
  varianteLealtad,
  variantePromocion,
];

function alignmentScoreForVariant(
  variantId: VarianteId,
  recomendacion: Recomendacion,
): number {
  const { proximidad, frecuencia, promocion } = recomendacion.desgloseScore;

  switch (variantId) {
    case "conversacional":
      return (
        recomendacion.score * 0.5 +
        proximidad * 0.25 +
        (recomendacion.tienePromocionActiva ? 0.2 : 0)
      );
    case "cercania":
      return proximidad;
    case "lealtad":
      return frecuencia;
    case "promocion":
      return promocion + (recomendacion.tienePromocionActiva ? 0.15 : 0);
    default:
      return 0;
  }
}

function scoreVariantContent(
  content: SmartNotificationContent,
  variantId: VarianteId,
  recomendacion: Recomendacion,
): number {
  let puntaje =
    alignmentScoreForVariant(variantId, recomendacion) *
      VARIANT_ALIGNMENT_WEIGHT +
    recomendacion.score * VARIANT_GLOBAL_SCORE_WEIGHT;

  if (content.body.length > MAX_BODY_LENGTH) puntaje -= 0.5;
  if (content.title.length > 0 && content.title.length <= MAX_TITLE_LENGTH) {
    puntaje += 0.05;
  }
  if (content.actionText) puntaje += 0.03;

  return puntaje;
}

/**
 * Genera notificación con plantillas estáticas (3 variantes, mejor según score).
 */
export function generateFallbackNotification(
  recomendacion: Recomendacion,
  userName?: string,
  userId = "guest",
): SmartNotificationContent {
  const beneficio = inferBeneficio(recomendacion);
  let mejor: SmartNotificationContent | null = null;
  let mejorPuntaje = -1;

  for (const variante of VARIANTES) {
    const contenido = variante.generar(
      recomendacion,
      beneficio,
      userName,
      userId,
    );
    const puntaje = scoreVariantContent(
      contenido,
      variante.id,
      recomendacion,
    );
    if (puntaje > mejorPuntaje) {
      mejorPuntaje = puntaje;
      mejor = contenido;
    }
  }

  return mejor ?? varianteCercania.generar(recomendacion, beneficio, userName);
}

/**
 * Construye el prompt de usuario para el LLM (exportado para depuración o UI admin).
 */
export function generatePromptForAI(
  recomendacion: Recomendacion,
  userName?: string,
): string {
  const beneficio = inferBeneficio(recomendacion);
  const nombreUsuario = userName?.trim() || "usuario";
  const distancia =
    recomendacion.distanciaMetros < 1000
      ? `${recomendacion.distanciaMetros} m`
      : `${(recomendacion.distanciaMetros / 1000).toFixed(1)} km`;

  return [
    "Genera UNA notificación push en JSON con exactamente estos campos:",
    '{ "title": string, "body": string, "actionText": string }',
    "",
    "REGLAS:",
    `- "body": máximo ${MAX_BODY_LENGTH} caracteres (cuenta espacios).`,
    `- "title": máximo ${MAX_TITLE_LENGTH} caracteres; un emoji al inicio está bien.`,
    '- "actionText": CTA corto (ej. "Ver promo", "Usar ahora").',
    "- Beneficio obligatorio en el body: descuento, cashback o ahorro.",
    "- Tono fintech cercano, contextual, personalizado — sin clichés de marketing.",
    "- Responde SOLO con el JSON, sin markdown ni texto extra.",
    "",
    "CONTEXTO:",
    `- Usuario: ${nombreUsuario}`,
    `- Comercio: ${recomendacion.nombreComercial}`,
    `- Categoría: ${recomendacion.categoria}`,
    `- Dirección: ${recomendacion.direccionCorta}`,
    `- Distancia: ${distancia}`,
    `- Score (0-1): ${recomendacion.score}`,
    `- Ticket promedio: $${recomendacion.ticketPromedioUsd}`,
    `- Partner DeUna: ${recomendacion.partnerDeuna ? "sí" : "no"}`,
    `- Promoción: ${recomendacion.promocion?.titulo ?? "ninguna"}`,
    `- Visitas últimos 30 días: ${recomendacion.transaccionesUltimos30Dias}`,
    `- Transacciones históricas: ${recomendacion.transaccionesUsuario}`,
    `- Beneficio sugerido: ${beneficio.texto} (${beneficio.tipo})`,
    `- Insight: ${recomendacion.razonDestacada}`,
    `- Desglose — proximidad: ${recomendacion.desgloseScore.proximidad}, frecuencia: ${recomendacion.desgloseScore.frecuencia}, promoción: ${recomendacion.desgloseScore.promocion}`,
  ].join("\n");
}

function extractJsonFromText(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new NotificationGeneratorError(
        "INVALID_RESPONSE",
        "La respuesta de IA no contiene JSON válido.",
      );
    }
    return JSON.parse(match[0]) as unknown;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Valida y normaliza la respuesta del modelo al formato de push.
 */
export function normalizeNotificationContent(
  raw: unknown,
): SmartNotificationContent {
  if (!isRecord(raw)) {
    throw new NotificationGeneratorError(
      "INVALID_RESPONSE",
      "La respuesta de IA no es un objeto JSON.",
    );
  }

  const title = typeof raw.title === "string" ? raw.title : "";
  const body = typeof raw.body === "string" ? raw.body : "";
  const actionText =
    typeof raw.actionText === "string" ? raw.actionText : DEFAULT_ACTION_TEXT;

  if (!title.trim() || !body.trim()) {
    throw new NotificationGeneratorError(
      "INVALID_RESPONSE",
      'La IA debe devolver "title" y "body" no vacíos.',
    );
  }

  return {
    title: trimTitle(title),
    body: trimBody(body),
    actionText: actionText.trim().slice(0, 24) || DEFAULT_ACTION_TEXT,
  };
}

/**
 * Llama al proveedor de IA y devuelve el contenido parseado.
 */
export async function generateWithAI(
  recomendacion: Recomendacion,
  userName?: string,
  client?: OpenAI | null,
): Promise<SmartNotificationContent> {
  const aiClient = client ?? createAIClient();

  if (!aiClient) {
    throw new NotificationGeneratorError(
      "MISSING_API_KEY",
      "Configura XAI_API_KEY o OPENAI_API_KEY en las variables de entorno.",
    );
  }

  const userPrompt = generatePromptForAI(recomendacion, userName);

  try {
    const completion = await aiClient.chat.completions.create({
      model: resolveModel(),
      temperature: 0.85,
      max_tokens: 280,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });

    const rawContent = completion.choices[0]?.message?.content?.trim();

    if (!rawContent) {
      throw new NotificationGeneratorError(
        "EMPTY_RESPONSE",
        "El modelo devolvió una respuesta vacía.",
      );
    }

    const parsed = extractJsonFromText(rawContent);
    return normalizeNotificationContent(parsed);
  } catch (error) {
    if (error instanceof NotificationGeneratorError) throw error;

    throw new NotificationGeneratorError(
      "API_ERROR",
      "Error al comunicarse con el proveedor de IA.",
      { cause: error },
    );
  }
}

export type GenerateSmartNotificationOptions = {
  /** Si es true, no usa fallback y relanza el error de IA */
  throwOnError?: boolean;
  /** Cliente OpenAI inyectado (útil en tests) */
  client?: OpenAI | null;
  /** ID de usuario para copy personalizado */
  userId?: string;
};

/**
 * Genera una notificación push con IA; si falla, usa plantillas estáticas.
 */
export async function generateSmartNotification(
  recomendacion: Recomendacion,
  userName?: string,
  options: GenerateSmartNotificationOptions = {},
): Promise<GenerateSmartNotificationResult> {
  try {
    const content = await generateWithAI(
      recomendacion,
      userName,
      options.client,
    );
    return { content, source: "ai" };
  } catch (error) {
    if (options.throwOnError) throw error;

    if (process.env.NODE_ENV === "development") {
      const mensaje =
        error instanceof Error ? error.message : "Error desconocido";
      console.warn(
        `[notificationGenerator] Fallback activado: ${mensaje}`,
      );
    }

    return {
      content: generateFallbackNotification(
        recomendacion,
        userName,
        options.userId ?? "guest",
      ),
      source: "fallback",
    };
  }
}

/**
 * Genera notificaciones para varias recomendaciones en paralelo.
 */
export async function generateNotifications(
  recommendations: readonly Recomendacion[],
  userName?: string,
  options?: GenerateSmartNotificationOptions,
): Promise<SmartNotification[]> {
  const resultados = await Promise.all(
    recommendations.map((recomendacion) =>
      generateSmartNotification(recomendacion, userName, options),
    ),
  );

  return resultados.map(({ content }, index) => ({
    id: `notif-${recommendations[index].id}-${Date.now()}`,
    ...content,
  }));
}

export const notificationGenerator = {
  createAIClient,
  generatePromptForAI,
  generateWithAI,
  generateFallbackNotification,
  generateSmartNotification,
  generateNotifications,
};
