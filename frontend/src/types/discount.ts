import { PaginationResponse } from "./_common";
import { Image } from "./image";

export interface Discount {
  id: string;
  name: string;
  image: Image;
  description: string;
  type:
    | "early_bird"
    | "last_minute"
    | "length_of_stay"
    | "promo_code"
    | "seasonal"
    | "multi_room"
    | "user_level";
  value: number;
  value_type: "percent" | "fixed";
  promo_code?: string;
  conditions: DiscountCondition;
  valid_from: Date;
  valid_to: Date;
  apply_to_room_class_ids?: string[];
  can_be_stacked: boolean;
  priority: number;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  booking_count?: number;
}

export interface DiscountCondition {
  min_advance_days?: Number;
  max_advance_days?: Number;
  min_stay_nights?: Number;
  max_stay_nights?: Number;
  min_rooms?: Number;
  user_levels?: [String];
}

export interface DiscountResponse {
  success: boolean;
  message: string;
  data: Discount;
}

export interface DiscountListResponse {
  success: boolean;
  message: string;
  data: Discount[];
  pagination?: PaginationResponse;
}

export interface PreviewDiscountBookingPriceRequest {
  baseTotal: number;
  checkInDate: string;
  checkOutDate: string;
  roomClassId: string;
  totalRooms: number;
}

export interface PreviewDiscountBookingPriceResponse {
  success: boolean;
  message: string;
  data: {
    originalPrice: number;
    finalPrice: number;
    appliedDiscounts: AppliedDiscount[];
    isPromo?: boolean;
  };
}

export interface AppliedDiscount {
  discountId: string;
  name: string;
  amount: number;
  reason: string;
}
