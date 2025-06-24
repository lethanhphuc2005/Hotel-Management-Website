// api/authApi.ts
import api from "@/lib/axiosInstance";

export const login = async (email: string, password: string) => {
  const res = await api.post("/account/login", { email, password });
  return res.data.data; // { accessToken, refreshToken, ...user }
};

export const refreshAccessToken = async () => {
  const login = localStorage.getItem("login");
  if (!login) throw new Error("Chưa đăng nhập");

  const { refreshToken } = JSON.parse(login);
  const res = await api.post("/account/refresh", { refreshToken });

  if (res.status !== 200) {
    throw new Error("Lỗi làm mới token");
  }

  return res.data.data; // { accessToken }
};

export const logout = () => {
  localStorage.removeItem("login");
};
