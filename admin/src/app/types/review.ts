import { Booking } from "./booking";
import { FilterParams, PaginationResponse } from "./_common";
import { Employee } from "./employee";
import { RoomClass } from "./room-class";
import { User } from "./user";

export interface Review {
  id: string;
  booking_id: Booking;
  room_class_id: RoomClass;
  parent_id?: string;
  user_id: User;
  employee_id?: Employee;
  content: string;
  rating: number;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  children: Review[];
}

export interface ReviewResponse {
  message: string;
  data: Review[];
  pagination: PaginationResponse
}

export interface ReviewDetailResponse {
  message: string;
  data: Review;
}

export interface ReviewRequest {
  booking_id: string;
  room_class_id: string;
  parent_id?: string;
  user_id: string;
  employee_id?: string;
  content: string;
  rating: number;
}

export interface ReviewFilter extends FilterParams {
  booking_id?: string;
  employee_id?: string;
  user_id?: string;
  status?: string;
  rating?: number;
}
