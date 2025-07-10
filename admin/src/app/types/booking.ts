import { Discount } from "./discount";
import { Employee } from "./employee";
import { BookingMethod } from "./method";
import { Room } from "./room";
import { RoomClass } from "./room-class";
import { ServiceBooking } from "./service";
import { BookingStatus } from "./status";
import { User } from "./user";

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
  created_at: Date;
  updated_at: Date;
  booking_status: BookingStatus[];
  booking_method: BookingMethod[];
  user?: User[];
  discount: Discount[];
  payment: any[];
  employee?: Employee[];
}

export interface BookingDetail {
  id: string;
  booking_id: string;
  room_id: string;
  room_class_id: RoomClass;
  price_per_night: number;
  nights: number;
  room?: Room[];
  services: ServiceBooking[];
}
