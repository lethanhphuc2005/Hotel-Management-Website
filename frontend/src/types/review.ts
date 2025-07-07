import { IUser } from "./user";

export interface Review {
  id: string;
  booking_id: string;
  room_class_id: string;
  parent_id: string | null;
  employee_id: {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    address?: string;
    is_verified?: boolean; // Optional field for employee verification status
  } | null;
  user_id: {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    address?: string;
    is_verified?: boolean; // Optional field for user verification status
  } | null; // User can be null if the review is anonymous
  rating: number | null; // Rating can be null if not provided
  content: string;
  status?: boolean;
  created_at?: Date;
  updated_at?: Date;
  parent_review?: Review[]; // Optional field for parent comment
}
