import { Booking } from './booking';
import { Comment } from './comment';
import { FilterParams, PaginationResponse } from './common';
import { Review } from './review';
import { RoomClass } from './room-class';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  address: string;
  email: string;
  phone_number: string;
  request: string;
  total_spent: number;
  total_bookings: number;
  total_nights: number;
  status: boolean;
  is_verified: boolean;
  level: string;
  verfitication_expired?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  comments?: Comment[];
  reviews?: Review[];
  bookings?: Booking[];
  favorites?: UserFavorite[];
  wallet?: UserWallet[];
}

export interface UserFavorite {
  id: string;
  user_id: string;
  room_class_id: RoomClass;
  createdAt: Date;
  updated_at: Date;
}

export interface UserWallet {
  id: string;
  user_id: string;
  balance: number;
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  type: string;
  amount: number;
  note: string;
  createdAt: Date;
}

export interface UserResponse {
  message: string;
  data: User[];
  pagination: PaginationResponse;
}

export interface UserDetailResponse {
  message: string;
  data: User;
}

export interface UserFilter extends FilterParams {
  status?: string;
  is_verified?: string;
  level?: string;
}
