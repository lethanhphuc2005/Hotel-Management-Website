import { createPayment as createPaymentApi } from "@/api/paymentApi";
import {
  CreatePaymentResponse,
  CreatePaymentResquest,
  PaymentUrl,
} from "@/types/payment";

export const createPayment = async ({
  method,
  orderId,
  orderInfo,
  amount,
}: CreatePaymentResquest): Promise<CreatePaymentResponse> => {
  try {
    const response = await createPaymentApi({
      method,
      orderId,
      orderInfo,
      amount,
    });
    const data = response.data;
    const payment: PaymentUrl = {
      payUrl: data.payUrl,
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
      data: {
        payUrl: "",
      },
    };
  }
};
