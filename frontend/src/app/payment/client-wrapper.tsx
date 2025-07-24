"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const PaymentPage = dynamic(() => import("./_client"));

export default function ClientWrapper() {
  return (
    <Suspense fallback={<p>Đang tải thanh toán...</p>}>
      <PaymentPage />
    </Suspense>
  );
}
