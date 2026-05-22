import type { Merchant } from "@/types/merchant";

export const nearbyMerchants: Merchant[] = [
  {
    id: "cafe-aurora",
    name: "Café Aurora",
    category: "Gastronomía",
    distance: "120 m",
    rating: 4.9,
    accepts: "QR Deuna",
    isOpen: true,
    cashback: "3%",
  },
  {
    id: "farmacia-vida",
    name: "Farmacia Vida",
    category: "Salud",
    distance: "340 m",
    rating: 4.8,
    accepts: "NFC",
    isOpen: true,
  },
  {
    id: "techstore-pro",
    name: "TechStore Pro",
    category: "Electrónica",
    distance: "580 m",
    rating: 5.0,
    accepts: "QR Deuna",
    isOpen: false,
    cashback: "5%",
  },
];
