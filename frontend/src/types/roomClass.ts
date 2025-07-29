import { RoomClassFeature } from "./feature";
import { MainRoomClass } from "./mainRoomClass";
import { Image } from "./image";
import { Comment } from "./comment";
import { Review } from "./review";
import { PaginationResponse } from "./_common";

export interface RoomClass {
  id: string;
  main_room_class_id: string;
  name: string;
  bed: {
    type: string;
    quantity: number;
  }
  capacity: number;
  price: number;
  price_discount?: number;
  view: string;
  description: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  main_room_class: MainRoomClass;
  images: Image[];
  features?: RoomClassFeature[];
  comments?: Comment[];
  reviews?: Review[];
  rating?: number; // Thêm rating nếu cần
}

export interface RoomClassResponse {
  success: boolean;
  message?: string;
  data: RoomClass;
}

export interface RoomClassListResponse {
  success: boolean;
  message: string;
  data: RoomClass[];
  pagination?: PaginationResponse;
}