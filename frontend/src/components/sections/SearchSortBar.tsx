"use client";
import React, { useEffect, useState } from "react";

type SortOption = {
  value: string;
  label: string;
};

interface SearchSortBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortOption: string;
  setSortOption: (value: string) => void;
  sortOptions: SortOption[];
  placeholder?: string;
  className?: string;
}

export default function SearchSortBar({
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
  sortOptions,
  placeholder = "Tìm kiếm...",
  className = "",
}: SearchSortBarProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Debounce logic: sau 500ms không gõ thì mới cập nhật searchTerm thật sự
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchTerm(localSearchTerm);
    }, 500); // 500ms

    return () => clearTimeout(timeout);
  }, [localSearchTerm]);

  return (
    <div
      className={`tw-flex tw-flex-col sm:tw-flex-row tw-items-center tw-gap-4 tw-mb-6 ${className}`}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={localSearchTerm}
        onChange={(e) => setLocalSearchTerm(e.target.value)}
        className="tw-w-full sm:tw-w-1/2 tw-px-4 tw-py-2 tw-rounded-md tw-bg-[#1d1d1d] tw-text-primary tw-placeholder-gray-400 tw-border tw-border-primary focus:tw-outline-none tw-flex-1"
      />
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="tw-w-full sm:tw-w-1/4 tw-px-4 tw-py-2 tw-rounded-md tw-bg-[#1d1d1d] tw-text-primary tw-border tw-border-primary focus:tw-outline-none"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
