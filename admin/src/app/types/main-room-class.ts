import { FilterParams } from './common';
import { Image } from './image';
import { RoomClass } from './room-class';

export interface MainRoomClass {
  id: string;
  name: string;
  description: string;
  status: boolean;
  room_class_list?: RoomClass[];
  images?: Image[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MainRoomClassResponse {
  message: string;
  data: MainRoomClass[];
  pagination: MainRoomClassPaginationResponse;
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

export interface MainRoomClassPaginationResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MainRoomClassFilter extends FilterParams {
  status?: string;
}
