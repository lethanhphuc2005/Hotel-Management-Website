import { publicApi } from "@/lib/axiosInstance";
import { CreatePaymentResquest } from "@/types/payment";

export const createPayment = async ({
  method,
  orderId,
  orderInfo,
  amount,
}: CreatePaymentResquest) => {
  const response = await publicApi.post(`/payment/${method}/create`, {
    orderId,
    orderInfo,
    amount,
  });
  if (response.status !== 200 && response.status !== 201) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.data;
};
