import {
  getWalletByUserId as getWalletByUserIdApi,
  useWalletByUserId as useWalletByUserIdApi,
  depositToWallet as depositToWalletApi,
} from "@/api/walletApi";
import {
  DepositToWalletResponse,
  UseWalletByUserIdRequest,
  Wallet,
  WalletResponse,
} from "@/types/wallet";
import { DepositToWalletRequest } from "../types/wallet";
import { PaymentUrl } from "@/types/payment";

export const fetchWalletByUserId = async (
  userId: string
): Promise<WalletResponse> => {
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
        createdAt: new Date(transaction.createdAt),
        updatedAt: new Date(transaction.updatedAt),
      })),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
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

export const useWalletByUserId = async ({
  userId,
  amount,
  note,
}: UseWalletByUserIdRequest): Promise<WalletResponse> => {
  try {
    const response = await useWalletByUserIdApi({ userId, amount, note });
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
        createdAt: new Date(transaction.createdAt),
        updatedAt: new Date(transaction.updatedAt),
      })),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
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

export const depositToWallet = async ({
  method,
  userId,
  amount,
}: DepositToWalletRequest): Promise<DepositToWalletResponse> => {
  try {
    const response = await depositToWalletApi({ method, userId, amount });
    const data = response.data;
    const payment: PaymentUrl = {
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
      data: {} as PaymentUrl,
    };
  }
};
