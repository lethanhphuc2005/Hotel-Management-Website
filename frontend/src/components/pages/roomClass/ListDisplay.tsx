"use client";

import { RoomClass } from "@/types/roomClass";
import { RoomClassList } from "./RoomClassList";
import React from "react";
import Pagination from "@/components/sections/Pagination";

interface RoomClassListDisplayProps {
  hasSearched: boolean;
  isOverCapacity: boolean;
  filteredRoomClass: RoomClass[];
  displayRoomClass: RoomClass[];
  numberOfNights: number;
  totalGuests: number;
  numberOfAdults: number;
  numberOfChildren: number;
  startDate: Date;
  endDate: Date;
  numChildrenUnder6: number;
  numchildrenOver6: number;
  numAdults: number;
  totalRoomClasses?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (selectedItem: { selected: number }) => void;
}

export default function RoomClassListDisplay({
  hasSearched,
  isOverCapacity,
  filteredRoomClass,
  displayRoomClass,
  numberOfNights,
  totalGuests,
  numberOfAdults,
  numberOfChildren,
  startDate,
  endDate,
  numChildrenUnder6,
  numchildrenOver6,
  numAdults,
  totalRoomClasses = 0,
  currentPage = 1,
  pageSize = 3,
  onPageChange = () => {},
}: RoomClassListDisplayProps) {
  if (hasSearched && isOverCapacity && filteredRoomClass.length > 0) {
    return (
      <div className="alert alert-danger w-100 text-center">
        Số khách bạn chọn vượt quá sức chứa tối đa của các phòng.
      </div>
    );
  }

  if (hasSearched && filteredRoomClass.length === 0) {
    return (
      <div className="alert alert-warning w-100 text-center">
        Không tìm thấy phòng nào phù hợp.
      </div>
    );
  }

  return (
    <>
      <RoomClassList
        rcl={displayRoomClass}
        numberOfNights={numberOfNights}
        totalGuests={totalGuests}
        hasSearched={hasSearched}
        numberOfAdults={numberOfAdults}
        numberOfChildren={numberOfChildren}
        startDate={startDate}
        endDate={endDate}
        numChildrenUnder6={numChildrenUnder6}
        numchildrenOver6={numchildrenOver6}
        numAdults={numAdults}
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
