import { Booking } from "./booking";

export interface BookingMethod {
  id: string;
  name: string;
  description: string;
  status: boolean;
  bookings: Booking[];
}

export interface PaymentMethod {
  id: string;
  name: string;
  image: string;
  description: string;
  status: boolean;
  bookings: Booking[];
}
