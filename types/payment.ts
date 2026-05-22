export type PaymentPhase = "idle" | "processing" | "success";

export type CompletedPayment = {
  id: string;
  momentId: string;
  merchantId: string;
  merchantName: string;
  amount: number;
  benefitAmount: number;
  benefitLabel: string;
  aiInsight?: string;
  completedAt: number;
};
