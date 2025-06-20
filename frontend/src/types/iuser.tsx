// frontend/model/iuser.ts
export interface IUser {
  id: number | string | undefined;
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