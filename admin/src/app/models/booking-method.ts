import { Booking } from "./booking";

export interface BookingMethod {
  booking_method?: { _id: string; name: string };
  name: string;
  description: string;
  status: boolean;
  bookings: Booking[];
}
