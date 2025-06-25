import { Image } from "./image";
import { RoomClass } from "./roomClass";

export interface MainRoomClass {
  id: string;
  name: string;
  description: string;
  status?: boolean;
  created_at?: Date;
  updated_at?: Date;
  room_class_list?: RoomClass[];
  images: Image[];
}
