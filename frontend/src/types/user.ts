import { Booking } from "./booking";
import { Review } from "./review";
import { UserFavorite } from "./userFavorite";
import { Wallet } from "./wallet";

export interface IUser {
  id: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  email: string;
  phone_number?: string;
  request?: string;
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
  wallet?: Wallet[];
}

export interface IAuthContextType {
  user: IUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
}
