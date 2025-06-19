export interface Booking {
  _id: string;
  full_name: string;
  payment_status: string;
}

export interface PaymentMethod {
  _id: string;
  name: string;
  status: boolean;
  bookings?: Booking[];
  createdAt?: string;
  updatedAt?: string;
}
