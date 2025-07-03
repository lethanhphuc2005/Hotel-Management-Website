export interface Discount {
  id: string;
  name: string;
  image: string;
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
  conditions: {
    min_advance_days: Number;
    max_advance_days: Number;
    min_stay_nights: Number;
    max_stay_nights: Number;
    min_rooms: Number;
    user_levels: [String];
  };
  valid_from: Date;
  valid_to: Date;
  apply_to_room_class_ids: string[];
  can_be_stacked: boolean;
  priority: number;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}
