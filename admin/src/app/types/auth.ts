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
  accessToken: string;
}

export interface LoginResponse {
  message: string;
  data: LoginData;
}

export interface RegisterResponse {
  message: string;
  data: Employee;
}
