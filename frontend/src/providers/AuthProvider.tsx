"use client";

import React, { useState, useEffect } from "react";
import { login as loginApi, logout as logoutApi } from "@/api/authApi";
import { User } from "@/types/user";
import { AuthContext } from "@/contexts/AuthContext";
import { AuthContextType, LoginData, LoginResponse } from "@/types/auth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("login");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    setIsLoading(true);
    try {
      const response = await loginApi({ email, password });
      const data = response.data;

      const loginData: LoginData = {
        id: data.id || data._id,
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        address: data.address || "",
        email: data.email,
        phone_number: data.phone_number || "",
        level: data.level || "newbie",
        status: data.status,
        is_verified: data.is_verified,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };

      localStorage.setItem("login", JSON.stringify(loginData));
      setUser(loginData);

      return {
        success: true,
        message: "Đăng nhập thành công!",
        data: loginData,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.response?.data || "Đăng nhập thất bại. Vui lòng thử lại.",
        data: {} as LoginData,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutApi();
    setUser(null);
    window.location.href = "/login";
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
