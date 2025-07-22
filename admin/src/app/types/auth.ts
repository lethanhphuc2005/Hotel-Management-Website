import { Employee } from "./employee";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  secret_key: string;
}

export interface LoginData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  position: string;
  department: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  status: boolean;
}

export interface LoginResponse {
  message: string;
  data: LoginData;
}

export interface RegisterResponse {
  message: string;
  data: Employee;
}
