import { FilterParams, PaginationResponse } from './_common';
import { Image } from './image';

export interface Discount {
  id: string;
  name: string;
  image: Image | null; // Image can be null if not provided
  description: string;
  type: string;
  value: number;
  value_type: string;
  conditions: DiscountCondition;
  promo_code?: string | null; // Promo code can be null if not provided
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
  min_advance_days?: number;
  max_advance_days?: number;
  min_stay_nights?: number;
  max_stay_nights?: number;
  min_rooms?: number;
  user_levels?: [string];
}

export interface DiscountResponse {
  message: string;
  data: Discount[];
  pagination: PaginationResponse;
}

export interface DiscountDetailResponse {
  message: string;
  data: Discount;
}

export interface DiscountRequest {
  name?: string;
  image?: Image | null;
  uploadImage?: File | null;
  description?: string;
  type?: string;
  value?: number;
  value_type?: string;
  conditions: DiscountCondition;
  promo_code?: string | null;
  valid_from?: Date;
  valid_to?: Date;
  apply_to_room_class_ids: string[];
  can_be_stacked?: boolean;
  priority?: number;
  status?: boolean;
}

export interface DiscountFilter extends FilterParams {
  type?: string;
  status?: string;
  value_type?: string;
  valid_from?: string;
  valid_to?: string;
  priority?: number;
  apply_to?: string;
  min_advance_days?: Number;
  max_advance_days?: Number;
  min_stay_nights?: Number;
  max_stay_nights?: Number;
  min_rooms?: Number;
  user_level?: string;
}
