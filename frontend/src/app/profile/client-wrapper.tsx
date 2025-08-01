"use client";
import GlobalLoading from "@/components/layout/GlobalLoading";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const ProfilePage = dynamic(() => import("./_client"));

export default function ClientWrapper() {
  return (
    <Suspense fallback={<GlobalLoading />}>
      <ProfilePage />
    </Suspense>
  );
}
