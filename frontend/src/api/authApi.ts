// api/authApi.ts
import { publicApi, api } from "@/lib/axiosInstance";
import {
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  verifyEmailRequest,
} from "@/types/auth";

export const register = async ({
  first_name,
  last_name,
  email,
  password,
  phone_number,
  address,
}: RegisterRequest) => {
  const response = await publicApi.post("/account/register", {
    first_name,
    last_name,
    email,
    password,
    phone_number,
    address,
  });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.data; // { success: boolean, message: string }
};

export const login = async ({ email, password }: LoginRequest) => {
  const response = await publicApi.post("/account/login", { email, password });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.data;
};

export const refreshAccessToken = async () => {
  const login = localStorage.getItem("login");
  if (!login) throw new Error("Chưa đăng nhập");

  const { refreshToken } = JSON.parse(login);
  const response = await publicApi.post("/account/refresh", { refreshToken });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.data; // { accessToken }
};

export const logout = async () => {
  // Xoá refresh token khỏi cookie
  await api.post("/account/logout");
  // Xoá thông tin đăng nhập khỏi localStorage
  localStorage.removeItem("login");
};

export const changePassword = async ({
  userId,
  password,
  newPassword,
}: ChangePasswordRequest) => {
  const response = await api.put("/user/change-password/" + userId, {
    password,
    newPassword,
  });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.data;
};

export const verifyEmail = async ({
  email,
  verificationCode,
}: verifyEmailRequest) => {
  const response = await publicApi.post("/user/verify", {
    email,
    verificationCode,
  });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.data; // { success: boolean, message: string }
};

export const forgotPassword = async (email: string) => {
  const response = await publicApi.post("/user/forgot-password", { email });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.data; // { success: boolean, message: string }
};

export const resetPassword = async ({
  email,
  verificationCode,
  newPassword,
}: ResetPasswordRequest) => {
  const response = await publicApi.post("/user/reset-password", {
    email,
    verificationCode,
    newPassword,
  });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.data; // { success: boolean, message: string }
};

export const resendVerificationEmail = async (email: string) => {
  const response = await publicApi.post("/user/resend-verification", { email });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.data; // { success: boolean, message: string }
};
