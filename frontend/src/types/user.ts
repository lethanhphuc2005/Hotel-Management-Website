import { Booking } from "./booking";
import { Review } from "./review";
import { UserFavorite } from "./userFavorite";
import { Wallet } from "./wallet";

export interface IUser {
  id: string;
  first_name: string | ""; // First name can be null if not provided
  last_name: string | ""; // Last name can be null if not provided
  address?: string;
  email: string;
  phone_number?: string;
  request?: string;
  level?: string; // e.g., "user", "admin", etc.
  total_spent?: number; // Total amount spent by the user
  total_nights?: number; // Total nights booked by the user
  total_bookings?: number; // Total bookings made by the user
  status?: Boolean;
  is_verified?: Boolean;
  createdAt?: Date;
  updatedAt?: Date;
  accessToken?: string;
  refreshToken?: string;
  bookings?: Booking[]; // Assuming bookings is an array of booking objects
  comments?: Comment[]; // Assuming comments is an array of comment objects
  reviews?: Review[]; // Assuming review is an object
  favorites?: UserFavorite[]; // Assuming favorites is an array of favorite objects
  wallet?: Wallet;
}

export interface IAuthContextType {
  user: IUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
}
