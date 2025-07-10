import { Image } from "./image";
import { RoomClass } from "./room-class";

export interface MainRoomClass {
  id: string;
  name: string;
  description: string;
  status: boolean;
  room_class_list?: RoomClass[];
  images?: Image[]
  created_at: Date;
  updated_at: Date;
}
