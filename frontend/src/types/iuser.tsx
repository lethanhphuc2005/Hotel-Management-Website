export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  address?: string;
  phone_number?: string;
}
export interface IUser {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  address?: string;
  phone_number?: string;
  request?: string;
  accessToken: string;
  refreshToken: string;
}

export interface IAuthContextType {
  user: IUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}
