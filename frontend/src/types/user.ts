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
  bookings?: any[]; // Assuming bookings is an array of booking objects
  comments?: any[]; // Assuming comments is an array of comment objects
  reviews?: any[]; // Assuming review is an object
  favorites?: any[]; // Assuming favorites is an array of favorite objects
}

export interface IAuthContextType {
  user: IUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
}
