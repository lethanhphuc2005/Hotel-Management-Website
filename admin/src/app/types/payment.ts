import { Booking } from "./booking";

interface PaymentMethod {
  _id: string;
  name: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
  bookings: Booking[];
}
export interface Payment {
  _id: string;
  booking_id: string;
  note?: string;
  amount: number;
  payment_method_id: string;
  status: 'pending' | 'completed' | 'failed';
  transaction_id: string;
  payment_date: string;
  metadata?: {
    resultCode: number;
    message: string;
  };
  createdAt: string;
  updatedAt: string;
  booking: Booking[];
  payment_method: PaymentMethod[];
}
