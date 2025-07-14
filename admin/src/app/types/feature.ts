import { PaginationParams, PaginationResponse } from './common';
import { RoomClass } from './room-class';

export interface Feature {
  id: string;
  name: string;
  description: string;
  image?: string;
  icon: string;
  status: boolean;
  created_at?: Date;
  updated_at?: Date;
  room_class_used_list?: FeatureRoomClass[];
}

export interface FeatureRoomClass {
  id: string;
  room_class_id: RoomClass;
  feature_id: Feature;
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
  name: string;
  description?: string;
  image?: File | null; // Có thể là File hoặc URL
  icon?: string; // Có thể là URL của icon
  status: boolean;
}

export interface FeatureFilter extends PaginationParams {
  status?: string;
}
