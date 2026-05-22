export type PaymentMethod = "QR Deuna" | "NFC" | "Wallet";

export type Merchant = {
  id: string;
  name: string;
  category: string;
  distance: string;
  rating: number;
  accepts: PaymentMethod;
  isOpen?: boolean;
  cashback?: string;
  imageUrl?: string;
};
