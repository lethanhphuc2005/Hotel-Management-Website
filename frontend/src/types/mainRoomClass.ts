import { PaginationResponse } from "./_common";
import { Image } from "./image";
import { RoomClass } from "./roomClass";

export interface MainRoomClass {
  id: string;
  name: string;
  description: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  room_class_list?: RoomClass[];
  image: Image;
}

export interface MainRoomClassResponse {
  success: boolean;
  message: string;
  data: MainRoomClass;
}

export interface MainRoomClassListResponse {
  success: boolean;
  message: string;
  data: MainRoomClass[];
  pagination?: PaginationResponse;
}