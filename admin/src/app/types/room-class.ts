import { Comment } from "./comment";
import { FeatureRoomClass } from "./feature";
import { Image } from "./image";
import { MainRoomClass } from "./main-room-class";
import { Review } from "./review";
import { Room } from "./room";

export interface RoomClass {
  id: string;
  main_room_class_id: string;
  name: string;
  description: string;
  bed_amount: number;
  capacity: number;
  price: number;
  price_discount: number;
  view: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
  main_room_class: MainRoomClass[];
  rooms?: Room[];
  features?: FeatureRoomClass[];
  images?: Image[];
  reviews: Review[];
  comments: Comment[];
}
