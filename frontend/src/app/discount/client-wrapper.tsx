"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import GlobalLoading from "@/components/layout/GlobalLoading";

const DiscountsPage = dynamic(() => import("./_client"));

export default function ClientWrapper() {
  return (
    <Suspense fallback={<GlobalLoading />}>
      <DiscountsPage />
    </Suspense>
  );
}
