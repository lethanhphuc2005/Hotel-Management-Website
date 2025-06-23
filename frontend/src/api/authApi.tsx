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
  const res = await fetch("http://localhost:8000/v1/account/refresh-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) throw new Error("Refresh token không hợp lệ");
  const { data } = await res.json();
  return data; // { accessToken, refreshToken }
};

export const logout = () => {
  localStorage.removeItem("login");
};
