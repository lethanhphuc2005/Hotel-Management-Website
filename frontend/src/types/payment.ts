import { PaginationResponse } from "./_common";
import { Booking } from "./booking";
import { PaymentMethod } from "./paymentMethod";

export interface PaymentRequest {
  orderId: string;
  orderInfo: string;
  amount: number;
}

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  payment_method_id: string;
  status: string;
  transaction_id: string;
  payment_date: Date;
  metadata: {};
  createdAt?: Date;
  updatedAt?: Date;
  booking: Booking[];
  payment_method: PaymentMethod;
}
export interface PaymentUrl {
  payUrl: string;
}

export interface CreatePaymentResquest {
  method: string;
  orderId: string;
  orderInfo: string;
  amount: number;
}

export interface CreatePaymentResponse {
  success: boolean;
  message: string;
  data: PaymentUrl;
}
