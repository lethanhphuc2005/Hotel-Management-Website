export interface Feature {
  id: string;
  name: string;
  image: string;
  description: string;
  status?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RoomClassFeature {
  id: string;
  room_class_id: string;
  feature_id: Feature;
}
