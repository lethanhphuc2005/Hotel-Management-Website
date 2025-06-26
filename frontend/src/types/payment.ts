import { Booking } from "./booking";

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
  payment_date: Date | string;
  metadata?: {};
  created_at: Date | string;
  updated_at: Date | string;
  booking?: Booking[];
  payment_method?: {
    id: string;
    name: string;
  };
}

export interface PaymentResponse {
  payUrl: string;
}
