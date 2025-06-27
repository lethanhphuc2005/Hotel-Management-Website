"use client";

import { RoomClass } from "@/types/roomClass";
import { RoomClassList } from "./RoomClassList";
import React from "react";

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
  showExtraBedOver6: boolean;
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
  showExtraBedOver6,
}: RoomClassListDisplayProps) {
  if (hasSearched && isOverCapacity) {
    return (
      <div className="alert alert-danger w-100 text-center">
        Số khách bạn chọn vượt quá sức chứa tối đa của các phòng.
      </div>
    );
  }

  if (hasSearched && filteredRoomClass.length === 0) {
    return (
      <div className="alert alert-warning w-100 text-center">
        Không tìm thấy phòng nào phù hợp với số khách bạn chọn.
      </div>
    );
  }

  return (
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
      showExtraBedOver6={showExtraBedOver6}
    />
  );
}
