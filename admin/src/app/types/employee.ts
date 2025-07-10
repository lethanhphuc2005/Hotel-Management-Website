import { Booking } from "./booking";
import { Comment } from "./comment";
import { Review } from "./review";

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  position: string;
  department: string;
  address: string;
  email: string;
  phone_number: string;
  role: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
  comments: Comment[];
  reviews: Review[];
  bookings: Booking[];
}
