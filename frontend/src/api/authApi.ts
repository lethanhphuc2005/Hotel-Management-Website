// api/authApi.ts
import { publicApi, api } from "@/lib/axiosInstance";

export const register = async (
  first_name: string,
  last_name: string,
  email: string,
  password: string,
  phone_number: string,
  address: string
) => {
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

export const login = async (email: string, password: string) => {
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

export const logout = () => {
  localStorage.removeItem("login");
};

export const changePassword = async (
  userId: string,
  password: string,
  newPassword: string
) => {
  const response = await api.put("/user/change-password/" + userId, {
    password,
    newPassword,
  });
  if (response.status !== 200) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.data;
};

export const verifyEmail = async (email: string, verificationCode: string) => {
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

export const resetPassword = async (
  email: string,
  verificationCode: string,
  newPassword: string
) => {
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
