"use client";

import React, { useState, useEffect } from "react";
import {
  facebookLogin as facebookLoginApi,
  googleLogin as googleLoginApi,
  login as loginApi,
  logout as logoutApi,
} from "@/api/authApi";
import { User } from "@/types/user";
import { AuthContext } from "@/contexts/AuthContext";
import { AuthContextType, LoginResponse } from "@/types/auth";
import { fetchProfile } from "@/services/ProfileService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refetchProfile = async () => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      try {
        const res = await fetchProfile();
        setUser(res?.data || null);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    refetchProfile();
  }, []);

  const loginWithGoogle = async (accessToken: string) => {
    localStorage.setItem("accessToken", JSON.stringify(accessToken));
    const userData = await fetchProfile();
    setUser(userData.data);
  };

  const login = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    setIsLoading(true);
    try {
      const response = await loginApi({ email, password });
      const data = response.data;

      const accessToken: string = data.accessToken;

      localStorage.setItem("accessToken", JSON.stringify(accessToken));

      const userData = await fetchProfile();
      setUser(userData.data);

      return {
        success: true,
        message: "Đăng nhập thành công!",
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.response?.data || "Đăng nhập thất bại. Vui lòng thử lại.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    try {
      logoutApi();
      toast.success("Đăng xuất thành công!");
      router.push("/login");
    } catch (error) {
      toast.error("Đăng xuất không thành công. Vui lòng thử lại.");
    }
  };

  const googleLogin = async () => {
    try {
      await googleLoginApi();
      // The redirect will be handled in the callback page
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(
        "Đã xảy ra lỗi khi đăng nhập bằng Google. Vui lòng thử lại sau."
      );
    }
  };

  const facebookLogin = async () => {
    try {
      await facebookLoginApi();
    } catch (error) {
      console.error("Facebook login error:", error);
      toast.error(
        "Đã xảy ra lỗi khi đăng nhập bằng Facebook. Vui lòng thử lại sau."
      );
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    googleLogin,
    facebookLogin,
    loginWithGoogle,
    logout,
    refetchProfile,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
