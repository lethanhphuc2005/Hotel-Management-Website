import { Booking } from "./booking";
import { PaginationResponse } from "./common";

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

export interface BookingMethodResponse {
  message: string;
  data: BookingMethod[];
  pagination: PaginationResponse;
}
