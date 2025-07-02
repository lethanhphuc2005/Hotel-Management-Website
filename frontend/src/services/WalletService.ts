import {
  getWalletByUserId as getWalletByUserIdApi,
  useWalletByUserId as useWalletByUserIdApi,
  depositToWallet as depositToWalletApi,
} from "@/api/walletApi";
import { Wallet } from "@/types/wallet";
import { PaymentResponse } from "@/types/payment";

export const fetchWalletByUserId = async (
  userId: string
): Promise<{
  success: boolean;
  message: string;
  data: Wallet;
}> => {
  try {
    const response = await getWalletByUserIdApi(userId);
    const data = response.data;
    const wallet: Wallet = {
      id: data.id,
      user_id: data.user_id,
      balance: data.balance,
      transactions: data.transactions.map((transaction: any) => ({
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        note: transaction.note,
        created_at: new Date(transaction.created_at),
      })),
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
    };
    return {
      success: true,
      message: response.message || "Wallet fetched successfully",
      data: wallet,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.message ||
      "Failed to fetch wallet";
    return {
      success: false,
      message,
      data: {} as Wallet,
    };
  }
};

export const useWalletByUserId = async (
  userId: string,
  amount: number,
  note: string
): Promise<{
  success: boolean;
  message: string;
  data: Wallet;
}> => {
  try {
    const response = await useWalletByUserIdApi(userId, amount, note);
    const data = response.data;
    const wallet: Wallet = {
      id: data.id,
      user_id: data.user_id,
      balance: data.balance,
      transactions: data.transactions.map((transaction: any) => ({
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        note: transaction.note,
        created_at: new Date(transaction.created_at),
      })),
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
    };
    return {
      success: true,
      message: response.message || "Wallet used successfully",
      data: wallet,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.message ||
      "Failed to use wallet";
    return {
      success: false,
      message,
      data: {} as Wallet,
    };
  }
};

export const depositToWallet = async (
  method: string,
  userId: string,
  amount: number
): Promise<{
  success: boolean;
  message: string;
  data: PaymentResponse;
}> => {
  try {
    const response = await depositToWalletApi(method, userId, amount);
    const data = response.data;
    const payment: PaymentResponse = {
      payUrl: data.payUrl || data.order_url,
    };
    return {
      success: true,
      message: response.message || "Deposit successful",
      data: payment,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.message ||
      "Failed to deposit to wallet";
    return {
      success: false,
      message,
      data: {} as PaymentResponse,
    };
  }
};
