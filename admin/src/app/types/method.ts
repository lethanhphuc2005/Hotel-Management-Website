import { Booking } from "./booking";

export interface PaymentMethod {
  id: string;
  name: string;
  image: string;
  description: string;
  status: boolean;
  bookings: Booking[];
}
