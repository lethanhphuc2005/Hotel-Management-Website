// lib/axiosInstance.ts
import axios from "axios";
import { refreshAccessToken } from "@/api/authApi";
import { toast } from "react-toastify";
// ========== Helpers ==========
const updateAccessToken = (newToken: string) => {
  localStorage.setItem("accessToken", JSON.stringify(newToken));
};

const getAccessToken = () => {
  try {
    return JSON.parse(localStorage.getItem("accessToken") || "null");
  } catch (err) {
    return null;
  }
};

// ========== Axios Instance ==========
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // Để gửi cookie
});

const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // Để gửi cookie
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
        updateAccessToken(accessToken);

        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        console.log(JSON.stringify(originalRequest.headers, null, 2));

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export { api, publicApi };
