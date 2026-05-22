/**
 * Sistema visual DeUna — referencia app oficial (tema claro in-app).
 * Push / lock screen usa variantes push* (oscuro glass).
 */

export const DEUNA_PURPLE = "#5D2A8E";

export const deuna = {
  app: "deuna-app bg-[#F5F5F7] text-[#171717]",
  page: "bg-[#F5F5F7]",
  screen: "bg-white",

  surface: "bg-white border border-[#EBEBEF] shadow-[0_1px_3px_rgba(0,0,0,0.06)]",
  surfaceMuted: "bg-[#F5F5F7] border border-[#EBEBEF]",
  surfaceElevated:
    "bg-white border border-[#E8E8ED] shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)]",
  surfaceGlass: "bg-white/95 border border-[#EBEBEF] backdrop-blur-xl",

  brand: "bg-[#5D2A8E]",
  brandHover: "hover:bg-[#4A2270] active:bg-[#3D1C5C]",
  brandText: "text-[#5D2A8E]",
  brandTextOn: "text-white",
  brandRing: "ring-[#5D2A8E]/25",
  brandBorder: "border-[#5D2A8E]/30",
  brandSurface: "bg-[#F3EBFA]",
  brandGlow: "shadow-[0_6px_20px_-4px_rgba(93,42,142,0.35)]",

  textPrimary: "text-[#171717]",
  textSecondary: "text-[#6B6B7B]",
  textMuted: "text-[#9B9BA8]",
  textLabel: "text-[11px] font-semibold text-[#6B6B7B]",

  benefitText: "text-[#5D2A8E] font-semibold",

  nearbyText: "text-[#6B6B7B]",
  nearbyBorder: "border-[#EBEBEF]",
  nearbySurface: "bg-[#F5F5F7]",

  promoText: "text-[#B45309]",
  promoSurface: "bg-[#FFF8ED] border border-[#FDE68A]",

  btnPrimary:
    "rounded-2xl bg-[#5D2A8E] font-semibold text-white shadow-[0_4px_14px_-2px_rgba(93,42,142,0.4)] active:scale-[0.98] transition-transform",
  btnSecondary:
    "rounded-2xl border-2 border-[#5D2A8E] bg-white font-semibold text-[#5D2A8E] active:scale-[0.98] transition-transform",
  btnGhost:
    "rounded-full bg-[#F0F0F4] text-[#171717] active:scale-95 transition-transform",
  btnSoft: "rounded-xl bg-[#F0F0F4] text-[#171717] font-medium",

  card: "rounded-2xl bg-white border border-[#EBEBEF] shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)]",
  cardHero:
    "rounded-[20px] bg-white border border-[#EBEBEF] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] overflow-hidden",

  badgeBase: "inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold",
  badgeBrand: "bg-[#5D2A8E] text-white",
  badgeBrandSoft: "bg-[#F3EBFA] text-[#5D2A8E]",
  badgeNearby: "text-[#6B6B7B] font-semibold text-[11px]",
  badgePromo: "bg-[#5D2A8E] text-white rounded-full px-2.5",
  badgeNuevo: "bg-[#5D2A8E] text-white rounded-full px-2.5 py-0.5 text-[10px] font-bold",

  header: "border-b border-[#EBEBEF] bg-white",
  tabBar:
    "border-t border-[#EBEBEF] bg-white shadow-[0_-4px_16px_-8px_rgba(0,0,0,0.06)]",
  tabActive: "bg-[#5D2A8E] text-white",
  tabInactive: "text-[#9B9BA8]",

  pushCard:
    "rounded-[18px] border border-white/15 bg-[#1C1C1E]/90 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl",
  pushText: "text-white",
  pushTextMuted: "text-white/65",
  pushBrand: "bg-[#5D2A8E]",

  logoMark: "rounded-xl bg-[#5D2A8E] flex items-center justify-center shrink-0",
  logoMarkRound: "rounded-full bg-[#5D2A8E] flex items-center justify-center",
  merchantBanner: "bg-gradient-to-br from-[#F3EBFA] via-[#EDE6F7] to-[#E8E0F5]",
  merchantIcon: "rounded-2xl bg-[#F5F5F7] border border-[#EBEBEF] text-2xl",

  sectionTitle: "text-[17px] font-bold text-[#171717] tracking-tight",
} as const;
