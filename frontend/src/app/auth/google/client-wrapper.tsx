"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const GoogleAuthPage = dynamic(() => import("./_client"));

export default function ClientWrapper() {
  return (
    <Suspense fallback={<p>Đang xử lý đăng nhập... </p>}>
      <GoogleAuthPage />
    </Suspense>
  );
}
