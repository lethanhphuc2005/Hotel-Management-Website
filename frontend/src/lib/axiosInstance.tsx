// lib/axiosInstance.ts
import axios from "axios";
import { refreshAccessToken } from "@/api/authApi";

// ========== Helpers ==========
const getAccessToken = () => {
  const loginData = localStorage.getItem("login");
  return loginData ? JSON.parse(loginData).accessToken : null;
};

const updateAccessToken = (newToken: string) => {
  const loginData = localStorage.getItem("login");
  if (loginData) {
    const updated = { ...JSON.parse(loginData), accessToken: newToken };
    localStorage.setItem("login", JSON.stringify(updated));
  }
};

// ========== Axios Instance ==========
const api = axios.create({
  baseURL: "http://localhost:8000/v1",
});

// Gắn access token vào mọi request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Tự động refresh token nếu 403
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const { accessToken } = await refreshAccessToken();
        updateAccessToken(accessToken);
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("login");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
