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
  startDate?: Date;
  endDate?: Date;
  numberOfChildrenUnder6: number;
  numberOfChildrenOver6: number;
  totalRoomClasses?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (selectedItem: { selected: number }) => void;
}

export default function RoomClassListDisplay({
  hasSearched,
  displayRoomClasses,
  numberOfNights,
  numberOfAdults,
  startDate,
  endDate,
  numberOfChildrenUnder6,
  numberOfChildrenOver6,
  totalRoomClasses = 0,
  currentPage = 1,
  pageSize = 3,
  onPageChange = () => {},
}: RoomClassListDisplayProps) {

  return (
    <>
      <RoomClassList
        roomClasses={displayRoomClasses}
        numberOfNights={numberOfNights}
        hasSearched={hasSearched}
        numberOfAdults={numberOfAdults}
        startDate={startDate}
        endDate={endDate}
        numberOfChildrenUnder6={numberOfChildrenUnder6}
        numberOfChildrenOver6={numberOfChildrenOver6}
      />

      {totalRoomClasses > 0 && (
        <Pagination
          pageCount={Math.ceil(totalRoomClasses / pageSize)}
          onPageChange={onPageChange}
          forcePage={currentPage - 1}
        />
      )}
    </>
  );
}
