import { Booking } from "./booking";
import { Comment } from "./comment";
import { Review } from "./review";
import { RoomClass } from "./room-class";

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
  created_at: Date;
  updated_at: Date;
  comments: Comment[];
  reviews: Review[];
  bookings: Booking[];
  favorites: UserFavorite[];
  wallet: any[];
}

export interface UserFavorite {
  id: string;
  user_id: string;
  room_class_id: RoomClass;
  created_at: Date;
  updated_at: Date;
}

export interface UserWallet {
  id: string;
  user_id: string;
  balance: number;
  transactions: any[]
}

export interface WalletTransaction {
  id: string;
  type: string;
  amount: number;
  note: string;
  created_at: Date;
}
