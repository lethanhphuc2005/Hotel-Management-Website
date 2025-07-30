"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGoogle } = useContext(AuthContext);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");

    if (accessToken && loginWithGoogle) {
      loginWithGoogle(accessToken);
      router.push("/"); // chuyển về trang chủ
    } else {
      router.push("/login");
    }
  }, [searchParams]);

  return <p>Đang xử lý đăng nhập...</p>;
}
