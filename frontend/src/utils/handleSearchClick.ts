"use client";

import { SuggestionResponse } from "@/types/suggestion";
import { createSearchLog } from "@/services/SearchService";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const handleSearchClick = async (
  item: SuggestionResponse,
  router: AppRouterInstance,
  onClose?: () => void
) => {
  const query: Record<string, string> = {};

  switch (item.type) {
    case "room":
      query.roomClass = item.label;
      window.location.href = `/room-class/?${new URLSearchParams(query).toString()}`;
      break;
    case "feature":
      query.feature = item.id || item.label;
      window.location.href = `/room-class?${new URLSearchParams(query).toString()}`;
      break;
    case "service":
      query.service = item.label;
      window.location.href = `/service?${new URLSearchParams(query).toString()}`;
      break;
    default:
      query.q = item.label;
      window.location.href = `/search?${new URLSearchParams(query).toString()}`;
  }

  await createSearchLog(item.label, item.type || "keyword");
};
