"use client";

import React, { useState, useEffect } from "react";
import { login as loginApi, logout as logoutApi } from "@/api/authApi";
import { IUser, IAuthContextType } from "@/types/iuser";
import { AuthContext } from "@/contexts/AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("login");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Lỗi khi parse localStorage:", error);
      localStorage.removeItem("login");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await loginApi(email, password);

      const userToStore: IUser = data;

      localStorage.setItem("login", JSON.stringify(userToStore));
      setUser(userToStore);
      return true;
    } catch (err) {
      console.error("Đăng nhập thất bại:", err);
      return false;
    }
  };

  const logout = () => {
    logoutApi();
    setUser(null);
  };

  const value: IAuthContextType = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
