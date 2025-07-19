import { FilterParams, PaginationResponse } from './common';

export interface Discount {
  id: string;
  name: string;
  image: string;
  description: string;
  type: string;
  value: number;
  value_type: string;
  conditions: DiscountCondition;
  promo_code?: string;
  valid_from: Date;
  valid_to: Date;
  apply_to_room_class_ids?: string[];
  can_be_stacked: boolean;
  priority: number;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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
  image?: File | null ;
  description?: string;
  type?: string;
  value?: number;
  value_type?: string;
  conditions?: DiscountCondition;
  promo_code?: string;
  valid_from?: Date;
  valid_to?: Date;
  apply_to_room_class_ids?: string[];
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
