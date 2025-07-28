import { FilterParams, PaginationResponse } from './_common';
import { Image } from './image';
import { RoomClass } from './room-class';

export interface Feature {
  id: string;
  name: string;
  description: string;
  image?: Image | null; // Image can be null if not provided
  icon: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  room_class_used_list?: FeatureRoomClass[];
}

export interface FeatureRoomClass {
  id: string;
  room_class_id: string;
  feature_id: string;
  room_class: RoomClass;
  feature: Feature;
}

export interface FeatureResponse {
  message: string;
  data: Feature[];
  pagination: PaginationResponse;
}

export interface FeatureDetailResponse {
  message: string;
  data: Feature;
}

export interface FeatureRequest {
  name?: string;
  description?: string;
  image?: File | null; // Có thể là File hoặc null nếu không có ảnh
  icon?: string; // Có thể là URL của icon
  status?: boolean;
}

export interface FeatureFilter extends FilterParams {
  status?: string;
}
