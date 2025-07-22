import { FilterParams, PaginationResponse } from './_common';
import { Booking } from './booking';
import { PaymentMethod } from "./payment-method";

export interface Payment {
  id?: string;
  booking_id: string;
  amount: number;
  payment_method_id: string;
  status: string;
  transaction_id?: string;
  payment_date: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  booking: Booking;
  payment_method: PaymentMethod
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data: Payment[];
  pagination?: PaginationResponse;
}

export interface PaymentDetailResponse {
  success: boolean;
  message: string;
  data: Payment;
}

export interface PaymentFilter extends FilterParams {
  status?: string;
  method?: string;
  payment_date?: string;
}

export interface PaymentTransactionStatusRequest {
  method: string;
  orderId: string;
  transactionDate?: string;
}
