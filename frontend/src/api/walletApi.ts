import { api } from "@/lib/axiosInstance";

export const getWalletByUserId = async (userId: string) => {
  try {
    const response = await api.get(`/wallet/${userId}`);
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching wallet by user ID:", error);
    throw error;
  }
};

export const useWalletByUserId = async (
  userId: string,
  amount: number,
  note: string
) => {
  try {
    const response = await api.get(`/wallet/use/${userId}`, {
      data: { amount, note },
    });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching wallet by user ID:", error);
    throw error;
  }
};

export const depositToWallet = async (
  method: string,
  userId: string,
  amount: number
) => {
  try {
    const response = await api.post(`/wallet/deposit/${method}`, {
      user_id: userId,
      amount,
    });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error depositing to wallet:", error);
    throw error;
  }
};
