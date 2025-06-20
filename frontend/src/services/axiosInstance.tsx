// src/services/axiosInstance.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/v1",
});

// Interceptor để thêm token vào header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("login"); // hoặc Cookies.get('accessToken')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      // Gọi API refresh token nếu có
      // Sau đó lưu lại token mới
    }
    return Promise.reject(err);
  }
);

export default api;
