import { Booking } from './booking';
import { PaymentMethod } from "./method";

export interface Payment {
  id?: string;
  booking_id: string;
  amount: number;
  payment_method_id: string;
  status: string;
  transaction_id?: string;
  payment_date: Date;
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
  booking: Booking[];
  payment_method: PaymentMethod
}
