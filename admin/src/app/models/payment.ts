import { Booking } from "./booking";

interface PaymentMethod {
  _id: string;
  name: string; 
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
  bookings: Booking[];
}
