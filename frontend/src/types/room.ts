import { RoomClass } from "./roomClass";
import { RoomStatus } from "./roomStatus";

export interface Room {
  id: string;
  name: string;
  floor: number;
  room_class_id: string;
  room_status_id: string;
  createdAt?: Date;
  updatedAt?: Date;
  room_class: RoomClass;
  room_status: RoomStatus
}