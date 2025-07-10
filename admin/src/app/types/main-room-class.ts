import { Image } from './image';
import { RoomClass } from './room-class';

export interface MainRoomClass {
  id: string;
  name: string;
  description: string;
  status: boolean;
  room_class_list?: RoomClass[];
  images?: Image[];
  created_at?: Date;
  updated_at?: Date;
}

export interface MainRoomClassResponse {
  message: string;
  data: MainRoomClass[];
}

export interface MainRoomClassDetailResponse {
  message: string;
  data: MainRoomClass;
}

export interface MainRoomClassRequest {
  name?: string;
  description?: string;
  image?: File | null;
  status?: boolean;
}
