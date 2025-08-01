"use client";
import { RoomClass } from "@/types/roomClass";
import { RoomClassList } from "./RoomClassList";
import React from "react";
import Pagination from "@/components/sections/Pagination";

interface RoomClassListDisplayProps {
  hasSearched: boolean;
  displayRoomClasses: RoomClass[];
  numberOfNights: number;
  numberOfAdults: number;
  startDate: Date;
  endDate: Date;
  hasSaturdayNight?: boolean;
  hasSundayNight?: boolean;
  capacity: number;
  numberOfChildrenUnder6: number;
  numberOfChildrenOver6: number;
  totalRoomClasses?: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

export default function RoomClassListDisplay({
  hasSearched,
  displayRoomClasses,
  numberOfNights,
  numberOfAdults,
  startDate,
  endDate,
  hasSaturdayNight = false,
  hasSundayNight = false,
  capacity,
  numberOfChildrenUnder6,
  numberOfChildrenOver6,
  totalRoomClasses = 0,
  currentPage,
  pageSize = 3,
  onPageChange = () => {},
}: RoomClassListDisplayProps) {
  const totalPages = Math.ceil(totalRoomClasses / pageSize);
  return (
    <>
      <RoomClassList
        roomClasses={displayRoomClasses}
        numberOfNights={numberOfNights}
        hasSearched={hasSearched}
        numberOfAdults={numberOfAdults}
        startDate={startDate}
        endDate={endDate}
        capacity={capacity}
        hasSaturdayNight={hasSaturdayNight}
        hasSundayNight={hasSundayNight}
        numberOfChildrenUnder6={numberOfChildrenUnder6}
        numberOfChildrenOver6={numberOfChildrenOver6}
      />

      {totalPages > 1 && (
        <Pagination
          pageCount={totalPages}
          onPageChange={onPageChange}
          forcePage={currentPage - 1}
        />
      )}
    </>
  );
}
