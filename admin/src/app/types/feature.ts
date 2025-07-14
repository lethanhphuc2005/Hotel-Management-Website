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
  pagination: FeaturePagination;
}

export interface FeatureDetailResponse {
  message: string;
  data: Feature;
  pagination: FeaturePagination;
}

export interface FeatureRequest {
  name: string;
  description?: string;
  image?: File | null; // Có thể là File hoặc URL
  icon?: string; // Có thể là URL của icon
  status: boolean;
}

export interface FeatureParam {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  status?: string;
}

export interface FeaturePagination {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}
