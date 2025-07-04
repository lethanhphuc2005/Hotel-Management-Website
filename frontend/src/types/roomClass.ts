import { RoomClassFeature } from "./feature";
import { MainRoomClass } from "./mainRoomClass";
import { Image } from "./image";
import { Comment } from "./comment";
import { Review } from "./review";

export interface RoomClass {
  id: string;
  main_room_class_id: string;
  name: string;
  bed_amount: number;
  capacity: number;
  price: number;
  price_discount?: number;
  view: string;
  description: string;
  status?: boolean;
  created_at?: Date;
  updated_at?: Date;
  main_room_class?: MainRoomClass[];
  images?: Image[];
  features?: RoomClassFeature[];
  comments?: Comment[];
  reviews?: Review[];
  rating?: number; // Thêm rating nếu cần
}
