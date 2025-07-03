import { createPayment as createPaymentApi } from "@/api/paymentApi";
import { Payment, PaymentRequest, PaymentResponse } from "@/types/payment";

export const createPayment = async (
  method: string,
  orderId: string,
  orderInfo: string,
  amount: number
): Promise<{
  success: boolean;
  message: string;
  data: PaymentResponse;
}> => {
  try {
    const response = await createPaymentApi(method, orderId, orderInfo, amount);
    const data = response.data;
    const payment: PaymentResponse = {
      payUrl: data.payUrl || data.order_url,
    };
    return {
      success: true,
      message: "Payment created successfully",
      data: payment,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.message || 
      "Failed to create payment";
    return {
      success: false,
      message,
      data: {} as PaymentResponse, // Return an empty object for data
    };
  }
};
