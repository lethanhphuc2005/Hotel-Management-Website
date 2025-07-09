"use client";
import React from "react";
import { RoomClass } from "@/types/roomClass";
import { RoomClassListForSearch } from "@/components/pages/roomClass/RoomClassList";

interface GeminiSuggestionsResponse {
  roomClasses: RoomClass[];
}

export default function GeminiSuggestionsSection({
  roomClasses = [],
}: GeminiSuggestionsResponse) {
  if (!roomClasses.length) return null;

  return (
    <section className="tw-my-12 tw-text-white">
      {roomClasses.length > 0 && (
        <>
          <div className="tw-flex tw-flex-wrap tw-gap-6">
            <RoomClassListForSearch
              title="Gợi ý dành cho bạn"
              roomClasses={roomClasses}
            />
          </div>
        </>
      )}
    </section>
  );
}
