import { PaginationResponse } from "./_common";

export interface Feature {
  id: string;
  name: string;
  image: string;
  icon: string;
  description: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoomClassFeature {
  id: string;
  room_class_id: string;
  feature_id: string;
  feature: Feature;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FeatureResponse {
  success: boolean;
  message: string;
  data: Feature;
}

export interface FeatureListResponse {
  success: boolean;
  message: string;
  data: Feature[];
  pagination?: PaginationResponse;
}
