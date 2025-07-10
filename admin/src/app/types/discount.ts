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
  appy_to_room_class_ids?: string[];
  can_be_stacked: boolean;
  priority: number;
  status: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface DiscountCondition {
  min_advance_days: Number;
  max_advance_days: Number;
  min_stay_nights: Number;
  max_stay_nights: Number;
  min_rooms: Number;
  user_levels: [String];
}
