"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { IAuthContextType, IUser } from "@/types/iuser";

export const AuthContext = createContext<IAuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);

  // Load user từ localStorage khi reload
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Đăng nhập với email & password
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:8000/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      const userData: IUser = data.user; // giả sử API trả về { user: { ... } }

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (err) {
      console.error("Lỗi khi đăng nhập:", err);
      return false;
    }
  };

  // Đăng xuất
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const value: IAuthContextType = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook để sử dụng Auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }
  return context;
};
