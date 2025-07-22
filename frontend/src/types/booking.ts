import { PaginationResponse } from "./_common";
import { BookingMethod } from "./bookingMethod";
import { BookingStatus } from "./bookingStatus";
import { Discount } from "./discount";
import { Employee } from "./employee";
import { Payment } from "./payment";
import { Room } from "./room";
import { RoomClass } from "./roomClass";
import { ServiceBooking } from "./service";
import { User } from "./user";

export interface Booking {
  id: string;
  employee_id: string | null;
  user_id: string | null;
  discount_id?: string[];
  booking_method_id: string;
  booking_status_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  booking_date: Date;
  check_in_date: Date | string;
  check_out_date: Date | string;
  adult_amount: number;
  child_amount?: number;
  request?: string;
  extra_fee?: number;
  note?: string;
  original_price: number;
  total_price: number;
  discount_value?: number;
  cancel_reason?: string;
  cancel_date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  booking_status: BookingStatus;
  booking_method: BookingMethod;
  user?: User;
  discounts?: Discount[];
  payments?: Payment[];
  employee?: Employee;
  booking_details: BookingDetail[];
}

export interface BookingDetail {
  id: string;
  booking_id: string;
  room_id?: string;
  room_class_id: string;
  price_per_night: number;
  nights: number;
  room?: Room;
  room_class: RoomClass;
  services: ServiceBooking[];
}

export interface BookingListResponse {
  success: boolean;
  message: string;
  data: Booking[];
  pagination?: PaginationResponse;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data: Booking;
}

export interface BookingCancelResponse {
  success: boolean;
  message: string;
  data: {
    can_cancel: boolean;
    fee_percent: number;
    fee_amount: number;
  };
}

export interface CreateBookingRequest {
  user_id?: string | null;
  full_name: string;
  email: string;
  phone_number: string;
  check_in_date: Date | string;
  check_out_date: Date | string;
  adult_amount: number;
  child_amount?: number;
  request?: string;
  note?: string;
  discount_id?: string[];
  discount_value?: number;
  booking_method_id: string;
  booking_status_id: string;
  booking_details: CreateBookingDetailRequest[];
  original_price: number;
  total_price: number;
}

export interface CreateBookingDetailRequest {
  room_class_id: string;
  price_per_night: number;
  nights: number;
  services: {
    amount: number;
    service_id: string;
  }[];
}

export interface PreviewCancellationFeeRequest {
  bookingId: string;
  userId: string;
}

export interface CancelBookingRequest extends PreviewCancellationFeeRequest {
  cancelReason: string;
}