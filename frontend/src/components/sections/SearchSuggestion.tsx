"use client";

import { SuggestionResponse } from "@/types/suggestion";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  suggestions: SuggestionResponse[];
  onClose?: () => void; // dùng để ẩn gợi ý sau khi click
}

const SearchSuggestions: React.FC<Props> = ({ suggestions, onClose }) => {
  const router = useRouter();

  const handleClick = (item: SuggestionResponse) => {
    const query: Record<string, string> = {};

    switch (item.type) {
      case "room":
        query.roomClass = item.label;
        router.push(`/room-class?${new URLSearchParams(query).toString()}`);
        break;
      case "feature":
        query.feature = item.id;
        router.push(`/room-class?${new URLSearchParams(query).toString()}`);
        break;
      case "service":
        query.service = item.label;
        router.push(`/service?${new URLSearchParams(query).toString()}`);
        break;
      default:
        query.q = item.label;
    }

    onClose?.();
  };
  if (suggestions.length === 0) return null;

  return (
    <ul className="tw-bg-white tw-shadow-lg tw-rounded-md tw-absolute tw-z-50 tw-w-full tw-max-h-60 tw-overflow-auto">
      {suggestions.map((item, index) => (
        <li
          key={index}
          className="tw-px-4 tw-py-2 tw-cursor-pointer hover:tw-bg-gray-100 tw-text-sm"
          onClick={() => handleClick(item)}
        >
          <span className="tw-font-medium tw-text-gray-700">{item.label}</span>
          <span className="tw-text-gray-400 tw-ml-2">({item.type})</span>
        </li>
      ))}
    </ul>
  );
};

export default SearchSuggestions;
