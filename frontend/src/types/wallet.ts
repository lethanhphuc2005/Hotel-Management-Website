export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  transactions: WalletTransaction[];
  created_at: Date;
  updated_at: Date;
}

export interface WalletTransaction {
  id: string;
  type: "refund" | "deposit" | "bonus" | "use";
  amount: number;
  note: string;
  created_at: Date;
}
