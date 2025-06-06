import { RoomClass } from "./room-class";
import { Status } from "./status";

export interface Room {
  _id: string;
  name: string;
  floor: number;
  room_class_id: string;
  room_status_id: string;
  room_class: RoomClass[]; // API trả về mảng
  status: Status[];        // API trả về mảng
}
