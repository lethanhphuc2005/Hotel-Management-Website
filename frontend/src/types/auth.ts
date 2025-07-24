import { User } from "./user";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: (accessToken: string) => Promise<void>;
  logout: () => void;
}

export interface AuthResponse {
  success: boolean;
  message: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  address: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
  verificationCode: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  userId: string;
  password: string;
  newPassword: string;
}

export interface verifyEmailRequest {
  email: string;
  verificationCode: string;
}

export interface LoginData {
  accessToken: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
}
