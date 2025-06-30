// hooks/useLocalSearch.ts
import { useEffect, useState } from "react";

const STORAGE_KEY = "roomSearch";

export const useLocalSearch = <T>(initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialValue;
    }
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  }, [value]);

  return [value, setValue] as const;
};
