import { Booking } from "./booking";
import { Comment } from "./comment";
import { FilterParams, PaginationResponse } from "./_common";
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

export interface EmployeeResponse {
  message: string;
  data: Employee[];
  pagination: PaginationResponse;
}

export interface EmployeeDetailResponse {
  message: string;
  data: Employee;
}

export interface EmployeeFilter extends FilterParams {
  role?: string;
  status?: string;
  position?: string;
  department?: string;
}

export interface EmployeeRequest {
  first_name: string;
  last_name: string;
  position: string;
  department: string;
  address: string;
  email: string;
  phone_number: string;
  role: string;
  status: boolean;
  password?: string; // Optional for registration
  secret_key?: string; // Optional for registration
}
