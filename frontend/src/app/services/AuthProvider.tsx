"use client";

import { ReactNode, useState, useEffect } from "react";
import { IUser, IAuthContextType } from "../model/iuser";
import { AuthContext } from "../context/AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);

  // Khôi phục user từ localStorage nếu có
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:8000/v1/account/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      // Trường hợp lỗi đăng nhập
      if (!res.ok || !result.data) {
        console.error("Đăng nhập thất bại:", result.message || result);
        return false;
      }

      const userData = result.data;

      // Tạo đối tượng user phù hợp với interface
    const userToStore: IUser = {
  id: userData._id || userData.id,
  first_name: userData.first_name || "",
  last_name: userData.last_name || "",
  email: userData.email,
  address: userData.address || "",
  phone_number: userData.phone_number || "", // ✅ sửa chỗ này
  request: userData.request || "",
  status: userData.status ?? true,
  role: userData.role || "user",
};


      setUser(userToStore);
      localStorage.setItem("user", JSON.stringify(userToStore));

      return true;
    } catch (error) {
      console.error("Lỗi trong quá trình đăng nhập:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
