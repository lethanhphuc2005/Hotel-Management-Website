import { publicApi } from "@/lib/axiosInstance";

export const createPayment = async (
  method: string,
  orderId: string,
  orderInfo: string,
  amount: number
) => {
  try {
    const response = await publicApi.post(`/payment/${method}/create`, {
      orderId: orderId,
      orderInfo: orderInfo,
      amount: amount,
    });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};
