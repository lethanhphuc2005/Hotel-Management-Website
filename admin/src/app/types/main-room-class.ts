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

export interface MainRoomClassFilter {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  status?: string;
}
