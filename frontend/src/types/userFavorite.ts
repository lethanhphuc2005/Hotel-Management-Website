import { PaginationResponse } from "./_common";
import { RoomClass } from "./roomClass";
import { User } from "./user";

export interface UserFavorite {
  id: string;
  user_id: string;
  room_class_id: string;
  createdAt?: Date;
  updatedAt?: Date;
  room_class: RoomClass;
  user: User;
}

export interface UserFavoriteListResponse {
  success: boolean;
  message?: string;
  data: UserFavorite[];
  pagination?: PaginationResponse
}

export interface UserFavoriteResponse {
  success: boolean;
  message?: string;
  data: UserFavorite;
}

export interface CreateUserFavoriteRequest {
  userId: string;
  roomClassId: string;
}

export interface DeleteUserFavoriteRequest {
  userId: string;
  favoriteId: string;
}