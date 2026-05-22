export type UserLocation = {
  latitude: number;
  longitude: number;
};

export type UserLocationErrorCode =
  | "PERMISSION_DENIED"
  | "POSITION_UNAVAILABLE"
  | "TIMEOUT"
  | "NOT_SUPPORTED"
  | "UNKNOWN";

export type UserLocationError = {
  code: UserLocationErrorCode;
  message: string;
};

export type SmartNotification = {
  id: string;
  title: string;
  body: string;
  actionText: string;
};

export type SmartNotificationContent = {
  title: string;
  body: string;
  actionText: string;
};

export type NotificationContentSource = "ai" | "fallback";

export type ComercioCategoria =
  | "cafe_brunch"
  | "farmacia"
  | "supermercado"
  | "restaurante"
  | "fitness"
  | "belleza"
  | "retail"
  | "combustible"
  | "panaderia";

export type PromocionTipo = "descuento" | "cashback" | "2x1" | "envio_gratis";

export type PromocionActiva = {
  id: string;
  titulo: string;
  tipo: PromocionTipo;
  /** Porcentaje o monto según tipo (ej. 15 = 15%) */
  valor: number;
  vigenteHasta: string;
  canal: "push" | "in_app";
};

export type RecomendacionScoreBreakdown = {
  proximidad: number;
  frecuencia: number;
  promocion: number;
};

/**
 * Comercio enriquecido — forma alineada al esquema futuro en Supabase.
 */
export type ComercioCandidato = {
  id: string;
  slug: string;
  nombre: string;
  nombreComercial: string;
  categoria: ComercioCategoria;
  direccionCorta: string;
  latitude: number;
  longitude: number;
  tienePromocionActiva: boolean;
  promocion?: PromocionActiva;
  transaccionesUsuario: number;
  transaccionesUltimos30Dias: number;
  ticketPromedioUsd: number;
  rating: number;
  partnerDeuna: boolean;
};

export type Recomendacion = ComercioCandidato & {
  distanciaMetros: number;
  score: number;
  desgloseScore: RecomendacionScoreBreakdown;
  /** Texto corto para UI de explicabilidad */
  razonDestacada: string;
};
