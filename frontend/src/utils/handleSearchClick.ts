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
      router.push(`/room-class?${new URLSearchParams(query).toString()}`);
      break;
    case "feature":
      query.feature = item.id || item.label;
      router.push(`/room-class?${new URLSearchParams(query).toString()}`);
      break;
    case "service":
      query.service = item.label;
      router.push(`/service?${new URLSearchParams(query).toString()}`);
      break;
    default:
      query.q = item.label;
      router.push(`/search?${new URLSearchParams(query).toString()}`);
  }

  await createSearchLog(item.label, item.type || "keyword");

  window.location.reload();
  onClose?.();
};
