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
  const response = await publicApi.post("/auth/refresh-token");
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.data; // { accessToken }
};

export const logout = async () => {
  await publicApi.post("/auth/logout");
};

export const changePassword = async ({
  userId,
  password,
  newPassword,
}: ChangePasswordRequest) => {
  const response = await api.patch("/user/change-password/" + userId, {
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

export const googleLogin = () => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
};
