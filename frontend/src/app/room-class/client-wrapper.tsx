"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const RoomClassesPage = dynamic(() => import("./_client"));

export default function ClientWrapper() {
  return (
    <Suspense fallback={<p>Đang tải loại phòng...</p>}>
      <RoomClassesPage />
    </Suspense>
  );
}
