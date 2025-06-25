export interface Feature {
  id: string;
  name: string;
  image: string;
  description: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoomClassFeature {
  id: string;
  room_class_id: string;
  feature_id: Feature;
}
