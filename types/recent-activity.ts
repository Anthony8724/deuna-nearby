export type RecentActivityItem = {
  id: string;
  merchant: string;
  description: string;
  amount: number;
  time: string;
  emoji: string;
  type: "debit" | "credit";
};
