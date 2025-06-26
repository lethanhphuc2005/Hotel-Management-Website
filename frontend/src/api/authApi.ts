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
  const res = await publicApi.post("/account/register", {
    first_name,
    last_name,
    email,
    password,
    phone_number,
    address,
  });

  return res.data; // { success: boolean, message: string }
};

export const login = async (email: string, password: string) => {
  const res = await publicApi.post("/account/login", { email, password });
  if (res.status !== 200) {
    throw new Error(res.data.message || "Đăng nhập thất bại");
  }

  return res.data;
};

export const refreshAccessToken = async () => {
  const login = localStorage.getItem("login");
  if (!login) throw new Error("Chưa đăng nhập");

  const { refreshToken } = JSON.parse(login);
  const res = await publicApi.post("/account/refresh", { refreshToken });
  if (res.status !== 200) {
    throw new Error(res.data.message || "Làm mới token thất bại");
  }

  return res.data; // { accessToken }
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
    throw new Error(response.data.message || "Đổi mật khẩu thất bại");
  }

  return response.data;
};

export const verifyEmail = async (email: string, verificationCode: string) => {
  const response = await publicApi.post("/user/verify", {
    email,
    verificationCode,
  });
  if (response.status !== 200) {
    throw new Error(response.data.message || "Xác thực email thất bại");
  }

  return response.data; // { success: boolean, message: string }
};

export const forgotPassword = async (email: string) => {
  const response = await publicApi.post("/user/forgot-password", { email });
  if (response.status !== 200) {
    throw new Error(response.data.message || "Quên mật khẩu thất bại");
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
    throw new Error(response.data.message || "Đặt lại mật khẩu thất bại");
  }

  return response.data; // { success: boolean, message: string }
};

export const resendVerificationEmail = async (email: string) => {
  const response = await publicApi.post("/user/resend-verification", { email });
  if (response.status !== 200) {
    throw new Error(response.data.message || "Gửi lại email xác thực thất bại");
  }

  return response.data; // { success: boolean, message: string }
};
