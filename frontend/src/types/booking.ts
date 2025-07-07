import { RoomClass } from "./roomClass";

export interface Booking {
  id?: string;
  employee_id?: string;
  user_id?: string | null;
  discount_id?: string[];
  booking_method_id: string;
  booking_status_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  booking_date?: Date;
  check_in_date: Date | string;
  check_out_date: Date | string;
  adult_amount: number;
  child_amount?: number;
  request?: string;
  extra_fee?: number;
  note?: string;
  original_price: number; // Giá gốc trước khi áp dụng khuyến mãi
  total_price: number;
  discount_value?: number;
  cancel_reason?: string;
  cancel_date?: Date;
  created_at?: Date;
  updated_at?: Date;
  booking_status?: {
    id: string;
    name: string;
  }[];
  booking_method?: {
    id: string;
    name: string;
  }[];
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    address?: string;
    request?: string;
  }[];
  discount?: {
    id: string;
    name: string;
    value: number;
    type: string; // e.g., 'percentage' or 'fixed'
    value_type: string; // e.g., 'percent' or 'fixed'
    status?: boolean;
    created_at?: Date;
    updated_at?: Date;
  }[];
  payment?: {
    id: string;
    booking_id: string;
    payment_method_id: string;
    amount: number;
    status?: string;
    created_at?: Date;
    updated_at?: Date;
    payment_method?: {
      id: string;
      name: string;
    };
  }[];
  employee?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
  };
  booking_details: {
    id?: string;
    booking_id?: string;
    room_class_id: string | RoomClass;
    room_id?: string;
    price_per_night: number;
    nights: number;
    room?: {
      id: string;
      floor: number;
      room_class_id: string;
      name: string;
    }[];
    services?: {
      id?: string;
      amount: number;
      service_id?: {
        id: string;
        name: string;
        price: number;
      } | string;
      used_at?: Date;
    }[];
  }[];
}
