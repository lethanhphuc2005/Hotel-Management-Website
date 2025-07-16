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
  createdAt?: Date;
  updatedAt?: Date;
  comments: Comment[];
  reviews: Review[];
  bookings: Booking[];
}
