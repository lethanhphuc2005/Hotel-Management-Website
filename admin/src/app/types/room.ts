import { RoomClass } from './room-class';
import { RoomStatus } from './status';

export interface Room {
  id: string;
  name: string;
  floor: number;
  room_class_id: string;
  room_status_id?: string;
  created_at: Date;
  updated_at: Date;
  room_class: RoomClass[];
  room_status?: RoomStatus[];
}
