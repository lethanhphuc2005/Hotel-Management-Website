import api from "@/services/axiosInstance";

export const refreshAccessToken = async () => {
  const loginData = JSON.parse(localStorage.getItem("login") || "{}");
  const refreshToken = loginData?.refreshToken;

  if (!refreshToken) throw new Error("No refresh token found");

  const res = await api.post("/account/refresh", { refreshToken });
  return res.data; // { accessToken, refreshToken }
};
