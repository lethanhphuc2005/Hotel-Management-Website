import { RoomClass } from "./room-class";

export interface Feature {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
  room_class_used_list: RoomClass[];
}

export interface FeatureRoomClass {
  id: string;
  room_class_id: string;
  feature_id: Feature;
}
