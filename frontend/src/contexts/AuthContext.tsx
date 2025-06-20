"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { IAuthContextType, IUser } from "../model/iuser";

export const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserData = async (userId: string, authToken: string) => {
    try {
      const response = await fetch(`http://localhost:8000/v1/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const userData = await response.json();
        console.log("Refresh user data response:", userData); // Debug
        const newUserData: IUser = {
          _id: userData.data._id || userData.data.id || "",
          first_name: userData.data.first_name || "",
          last_name: userData.data.last_name || "",
          email: userData.data.email || "",
          address: userData.data.address || "",
          phone_number: userData.data.phone_number || "",
          request: userData.data.request || "",
          status: userData.data.status ?? true,
          role: userData.data.role || "user",
          subscribed: userData.data.subscribed ?? false, // Đảm bảo subscribed có giá trị mặc định
        };
        setUser(newUserData);
        localStorage.setItem("user", JSON.stringify(newUserData));
        return newUserData;
      } else {
        console.error("Lỗi khi làm mới dữ liệu người dùng:", response.status, await response.json());
      }
    } catch (err) {
      console.error("Lỗi khi gọi API làm mới dữ liệu người dùng:", err);
    }
    return null;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (!parsedUser._id && parsedUser.id) {
            parsedUser._id = parsedUser.id;
          }
          setUser(parsedUser);
          setToken(storedToken);
          // Làm mới dữ liệu người dùng từ API
          if (parsedUser._id) {
            await refreshUserData(parsedUser._id, storedToken);
          } else {
            console.warn("User ID không hợp lệ, không thể làm mới dữ liệu:", parsedUser);
          }
        } catch (err) {
          console.error("Lỗi khi parse user/token từ localStorage:", err);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:8000/v1/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok || !data.data) {
        console.error("Login failed:", data.message || "Không rõ lỗi");
        return false;
      }

      const userData: IUser = {
        _id: data.data._id || data.data.id || "",
        first_name: data.data.first_name || "",
        last_name: data.data.last_name || "",
        email: data.data.email || "",
        address: data.data.address || "",
        phone_number: data.data.phone_number || "",
        request: data.data.request || "",
        status: data.data.status ?? true,
        role: data.data.role || "user",
        subscribed: data.data.subscribed ?? false,
      };
      const authToken: string = data.data.accessToken;

      if (!authToken || !userData) {
        console.error("Token hoặc user không tồn tại trong response:", data);
        return false;
      }

      localStorage.setItem("login", JSON.stringify(userData));
      setUser(userData);
      setToken(authToken);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", authToken);

      await refreshUserData(userData._id, authToken);

      return true;
    } catch (err) {
      console.error("Lỗi khi đăng nhập:", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  const value: IAuthContextType = { user, token, login, logout, loading, setUser };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }
  return context;
};