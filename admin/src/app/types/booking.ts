import { FilterParams, PaginationResponse } from './_common';
import { Discount } from './discount';
import { Employee } from './employee';
import { BookingMethod } from './booking-method';
import { Payment } from './payment';
import { Room } from './room';
import { RoomClass } from './room-class';
import { ServiceBooking } from './service';
import { BookingStatus } from './booking-status';
import { User } from './user';

export interface Booking {
  id: string;
  user_id?: string;
  full_name: string;
  email: string;
  phone_number: string;
  booking_date: Date;
  check_in_date: Date;
  check_out_date: Date;
  adult_amount: number;
  child_amount: number;
  booking_status_id: string;
  booking_method_id: string;
  request: string;
  note: string;
  original_price: number;
  discount_value: number;
  total_price: number;
  payment_status: string;
  discount_id?: string[];
  employee_id?: string;
  cancel_date?: Date;
  cancel_reason?: string;
  cancellation_fee?: number;
  actual_check_in_date?: Date;
  check_in_identity?: BookingIndentity;
  actual_check_out_date?: Date;
  check_out_note?: string;
  booking_status: BookingStatus;
  booking_method: BookingMethod;
  user?: User;
  discounts: Discount[];
  payments: Payment[];
  employee?: Employee;
  booking_details: BookingDetail[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BookingDetail {
  id: string;
  booking_id: string;
  room_id: string;
  room_class_id: string;
  price_per_night: number;
  nights: number;
  room?: Room;
  room_class: RoomClass;
  services: ServiceBooking[];
}

export interface BookingResponse {
  message: string;
  data: Booking[];
  pagination: PaginationResponse;
}

export interface BookingFilter extends FilterParams {
  status?: string;
  user?: string;
  method?: string;
  payment_status?: string;
  check_in_date?: string;
  check_out_date?: string;
  booking_date?: string;
}

export interface BookingCancel {
  id: string;
  reason: string;
}

export interface BookingConfirm {
  id: string;
  roomAssignments: {
    room_id: string;
    detail_id: string;
  }[];
}

export interface BookingCheckIn {
  id: string;
  identity: BookingIndentity;
}

export interface BookingCheckOut {
  id: string;
  note: string;
}

export interface BookingStatusUpdateResponse {
  message: string;
  data: Booking;
}

export interface BookingIndentity {
  type: 'CMND' | 'CCCD' | 'Passport';
  number: string;
  representative_name: string;
}
