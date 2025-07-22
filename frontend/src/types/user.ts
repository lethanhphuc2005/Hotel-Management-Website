import { Booking } from "./booking";
import { Review } from "./review";
import { UserFavorite } from "./userFavorite";
import { Wallet } from "./wallet";
import { Comment } from "./comment";

export interface User {
  id: string;
  first_name: string | "";
  last_name: string | "";
  address?: string;
  email: string;
  phone_number?: string;
  request?: string;
  level?: string;
  total_spent?: number;
  total_nights?: number;
  total_bookings?: number;
  status: Boolean;
  is_verified: Boolean;
  createdAt?: Date;
  updatedAt?: Date;
  bookings?: Booking[];
  comments?: Comment[];
  reviews?: Review[];
  favorites?: UserFavorite[];
  wallet?: Wallet;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface UpdateUserProfileRequest {
  first_name?: string;
  last_name?: string;
  address?: string;
  email?: string;
  phone_number?: string;
  request?: string;
}

export interface UpdateUserProfileResponse {
  success: boolean;
  message: string;
  data: UpdateUserProfileRequest;
}
