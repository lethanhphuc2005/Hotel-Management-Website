// lib/axiosInstance.ts
import axios from "axios";
import { refreshAccessToken } from "@/api/authApi";
import { toast } from "react-toastify";
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
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Gắn access token vào mọi request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    toast.error(
      "Chưa đăng nhập hoặc token không hợp lệ. Vui lòng đăng nhập lại."
    );
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
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;
      try {
        const response = await refreshAccessToken();
        const data = response.data;
        const accessToken = data.accessToken;
        const loginData = JSON.parse(localStorage.getItem("login") || "{}");
        localStorage.setItem(
          "login",
          JSON.stringify({ ...loginData, accessToken })
        );

        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        originalRequest.headers = originalRequest.headers || {};
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

export { api, publicApi };
