import { Booking } from "./booking";
import { Employee } from "./employee";
import { User } from "./user";

export interface Review {
  id: string;
  booking_id: Booking;
  room_class_id: string;
  parent_id?: string;
  user_id: User;
  employee_id?: Employee;
  content: string;
  rating: number;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}
