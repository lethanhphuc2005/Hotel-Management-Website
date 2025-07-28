import { useMemo } from "react";

interface FilterParams {
  guests: {
    adults: number;
    children: {
      age0to6: number;
      age7to17: number;
    };
  };
}

export function useRoomFilterLogic({ guests }: FilterParams) {
  return useMemo(() => {
    // thuật toán tính số giường cần
    function calculateMinBedsNeeded(
      adults: number,
      teens: number,
      kidsUnder6: number
    ) {
      return {};
    }
  }, [guests.adults, guests.children.age0to6, guests.children.age7to17]);
}
