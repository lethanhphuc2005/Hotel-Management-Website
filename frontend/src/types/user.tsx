export interface IUser {
  id: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  email: string;
  phone_number?: string;
  request?: string;
  status: Boolean;
  is_verified: Boolean;
  createdAt: Date;
  updatedAt: Date;
  accessToken?: string;
  refreshToken?: string;
}

export interface IAuthContextType {
  user: IUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}
