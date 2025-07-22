import { PaymentUrl } from "./payment";

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  transactions: WalletTransaction[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WalletTransaction {
  id: string;
  type: "refund" | "deposit" | "bonus" | "use";
  amount: number;
  note: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WalletResponse {
  success: boolean;
  message: string;
  data: Wallet;
}

export interface DepositToWalletRequest {
  method: string;
  userId: string;
  amount: number;
}

export interface DepositToWalletResponse {
  success: boolean;
  message: string;
  data: PaymentUrl;
}

export interface UseWalletByUserIdRequest {
  userId: string;
  amount: number;
  note: string;
}
