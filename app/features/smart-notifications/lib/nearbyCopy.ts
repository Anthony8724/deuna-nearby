/**
 * Copy unificado — tono DeUna: cercano, inteligente, rápido, natural.
 */

import { formatBeneficioFromRecomendacion } from "./beneficios";
import { formatCategoria, formatDistancia } from "./format";
import { buildUserAffinityProfile } from "./userAffinity";
import type { Recomendacion } from "../types";

function getEcuadorHour(): number {
  return Number(
    new Date().toLocaleString("es-EC", {
      timeZone: "America/Guayaquil",
      hour: "numeric",
      hour12: false,
    }),
  );
}

export function saludoPersonalizado(nombre: string): string {
  const n = nombre.trim();
  return n ? `Hola, ${n}` : "Hola";
}

/** Distancia compacta para push conversacional (ej. 250m) */
export function formatDistanciaCompacta(metros: number): string {
  if (metros < 1000) return `${metros}m`;
  return `${(metros / 1000).toFixed(1)}km`;
}

/** Interés en plural según categoría y perfil del usuario */
export function categoriaInteresLabel(
  categoria: Recomendacion["categoria"],
  userId = "guest",
): string {
  const affinity = buildUserAffinityProfile(userId);
  const preferida = affinity.categoriasPreferidas[0];

  const labels: Record<Recomendacion["categoria"], string> = {
    restaurante: "hamburguesas y comida rápida",
    cafe_brunch: "cafés y brunch",
    farmacia: "farmacias y cuidado personal",
    supermercado: "supermercados",
    fitness: "gimnasios y wellness",
    belleza: "belleza y cuidado",
    retail: "tiendas cerca de ti",
    combustible: "estaciones de servicio",
    panaderia: "panaderías y postres",
  };

  if (categoria === preferida) {
    return labels[categoria] ?? "lugares que te gustan";
  }
  return labels[categoria] ?? "promos en tu zona";
}

/** Beneficio para frase conversacional del push */
export function pushBeneficioDeUnaPhrase(rec: Recomendacion): string {
  const promo = rec.promocion;
  if (promo?.tipo === "descuento") return `${promo.valor}% beneficio DeUna`;
  if (promo?.tipo === "cashback") return `${promo.valor}% cashback DeUna`;
  if (promo?.tipo === "2x1") return "2x1 beneficio DeUna";
  if (promo) return "beneficio DeUna";
  const b = formatBeneficioFromRecomendacion(rec);
  if (b.texto.toLowerCase().includes("cashback")) return "cashback DeUna";
  if (b.texto.toLowerCase().includes("descuento")) return b.texto.replace(/ de descuento/i, " beneficio DeUna");
  return "beneficio DeUna";
}

/**
 * Mensaje push conversacional — tono DeUna personalizado.
 * Ej: "Vimos que últimamente te interesan hamburguesas. Burger Factory está a 250m y tiene beneficio DeUna."
 */
export function pushConversationalMessage(
  rec: Recomendacion,
  userId = "guest",
): string {
  const interes = categoriaInteresLabel(rec.categoria, userId);
  const nombre = rec.nombreComercial;
  const dist = formatDistanciaCompacta(rec.distanciaMetros);
  const beneficio = pushBeneficioDeUnaPhrase(rec);
  return `Vimos que últimamente te interesan ${interes}. ${nombre} está a ${dist} y tiene ${beneficio}.`;
}

/** Una sola línea para el push — alias del estilo conversacional */
export function pushAlertLine(rec: Recomendacion, userId = "guest"): string {
  return pushConversationalMessage(rec, userId);
}

function pushCategoryEmoji(categoria: Recomendacion["categoria"]): string {
  const map: Record<Recomendacion["categoria"], string> = {
    cafe_brunch: "☕",
    farmacia: "💊",
    supermercado: "🛒",
    restaurante: "🍽️",
    fitness: "💪",
    belleza: "✨",
    retail: "🛍️",
    combustible: "⛽",
    panaderia: "🥐",
  };
  return map[categoria] ?? "🏪";
}

function pushBeneficioCorto(rec: Recomendacion): string {
  const promo = rec.promocion;
  if (promo?.tipo === "descuento") return `${promo.valor}% OFF`;
  if (promo?.tipo === "cashback") return `${promo.valor}% cashback`;
  if (promo?.tipo === "2x1") return promo.titulo;
  const b = formatBeneficioFromRecomendacion(rec);
  if (b.tipo === "cashback") return "cashback extra";
  if (b.tipo === "descuento") return b.texto.replace(/ de descuento/i, "");
  return b.texto;
}

/** Línea principal del push (descuento destacado) — uso en card/feed */
export function pushBeneficioLine(rec: Recomendacion): string {
  const promo = rec.promocion;
  if (promo?.tipo === "descuento") {
    return `${promo.valor}% OFF pagando con DeUna`;
  }
  if (promo?.tipo === "cashback") {
    return `Cashback ${promo.valor}% — solo hoy`;
  }
  if (promo?.tipo === "2x1") {
    return promo.titulo;
  }
  const b = formatBeneficioFromRecomendacion(rec);
  if (b.tipo === "cashback") return "Cashback extra disponible";
  return b.texto;
}

/** Cuerpo del push — contextual y conversacional */
export function pushBodyLine(
  rec: Recomendacion,
  userName: string,
  userId = "guest",
): string {
  void userName;
  return pushConversationalMessage(rec, userId);
}

/** Feed card — una línea con personalidad */
export function momentContextLine(rec: Recomendacion): string {
  const hour = getEcuadorHour();
  const beneficio = formatBeneficioFromRecomendacion(rec);

  if (beneficio.tipo === "cashback") return "⚡ Cashback extra disponible";
  if (rec.categoria === "cafe_brunch" && hour >= 6 && hour < 12) {
    return "☕ Perfecto para esta hora del día";
  }
  if (rec.categoria === "restaurante" && hour >= 12 && hour < 15) {
    return "🍔 Promo ideal cerca de ti";
  }
  if (rec.categoria === "restaurante" && hour >= 19 && hour < 22) {
    return "🌙 Cena con beneficio incluido";
  }
  if (rec.distanciaMetros < 120) return "👀 A la vuelta de la esquina";
  if (rec.distanciaMetros < 250) return "📍 Promo activa a pocos pasos";
  if (rec.tienePromocionActiva) return "✨ Aprovecha mientras estás cerca";
  if (rec.score >= 0.78) return "💜 Hecho a tu medida";
  return "🔥 Vale la pena pasar hoy";
}

/** Bottom sheet — frase principal “por qué” */
export function contextualReasonShort(
  rec: Recomendacion,
  userId = "guest",
): string {
  const hour = getEcuadorHour();
  const affinity = buildUserAffinityProfile(userId);

  if (hour >= 6 && hour < 12 && rec.categoria === "cafe_brunch") {
    return "Sueles tomar café por la mañana y este local encaja perfecto";
  }
  if (hour >= 12 && hour < 15 && rec.categoria === "restaurante") {
    return "Es buena hora para almorzar cerca — ya lo haces seguido";
  }
  if (rec.distanciaMetros < 180) {
    return "Estás muy cerca; es el momento de usar el beneficio";
  }
  if (rec.transaccionesUltimos30Dias >= 4) {
    return `Ya conoces este lugar — ${rec.transaccionesUltimos30Dias} visitas con DeUna`;
  }
  if (affinity.categoriasPreferidas.includes(rec.categoria)) {
    return `Te gusta ${formatCategoria(rec.categoria).toLowerCase()} y hoy hay promo`;
  }
  return "Perfecto para esta hora del día según tus hábitos";
}

/** Razón larga para sheet (sin prefijo robótico) */
export function contextualReasonSheet(rec: Recomendacion): string {
  const cat = formatCategoria(rec.categoria).toLowerCase();

  if (rec.desgloseScore.frecuencia >= 0.65) {
    return `vienes seguido a ${cat} por aquí y tu historial en DeUna lo respalda.`;
  }
  if (rec.desgloseScore.proximidad >= 0.75) {
    return "estás a un paso — ideal para canjear ahora.";
  }
  if (rec.tienePromocionActiva && rec.promocion) {
    return `hay promo activa (${rec.promocion.titulo.toLowerCase()}) que encaja contigo.`;
  }
  return "combina cercanía, tu perfil y una oferta que vale la pena.";
}

export const WHY_BULLET_LABELS = {
  cerca: "Estás a pocos pasos — buen momento para pasar",
  frecuencia: "Sueles comprar aquí con DeUna",
  promo: "Promo activa que encaja contigo",
  hora: "Es la hora en la que más gastas",
} as const;

export function cashbackExtraLine(rec: Recomendacion): string {
  const beneficio = formatBeneficioFromRecomendacion(rec);
  if (beneficio.tipo === "cashback") {
    const extra = Math.min(5, (rec.promocion?.valor ?? 3) + 1);
    return `+${extra}% extra si pagas con DeUna`;
  }
  return "Cashback +3% al pagar con DeUna";
}

export function tiempoPromoLabel(promo?: Recomendacion["promocion"]): string {
  if (!promo?.vigenteHasta) return "Válido hoy · no lo dejes pasar";

  const fin = new Date(promo.vigenteHasta).getTime();
  const diffH = Math.max(0, Math.floor((fin - Date.now()) / 3_600_000));

  if (diffH < 2) return "Quedan menos de 2 horas";
  if (diffH < 24) return `Te quedan ${diffH}h — aprovecha hoy`;
  if (diffH < 48) return "Termina mañana";
  if (diffH < 168) return `Vigente ${Math.floor(diffH / 24)} días más`;
  return "Tienes tiempo, pero no dormirte";
}

export function horaActividadAmigable(hour = getEcuadorHour()): string {
  if (hour >= 6 && hour < 12) return "Mañana · 7:00 – 11:30";
  if (hour >= 12 && hour < 15) return "Almuerzo · 12:00 – 14:30";
  if (hour >= 15 && hour < 19) return "Tarde · 15:00 – 18:30";
  if (hour >= 19 && hour < 23) return "Noche · 19:00 – 22:00";
  return "Fuera de tu hora pico";
}
