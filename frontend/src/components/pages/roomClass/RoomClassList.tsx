"use client";
import RoomClassItem from "./roomClassItem";
import "swiper/css";
import "swiper/css/navigation";
import { RoomClass } from "@/types/roomClass";
import { useEffect, useState } from "react";
import { getUserFavorites } from "@/services/UserFavoriteService";
import { UserFavorite } from "@/types/userFavorite";

export function RoomClassList({
  rcl,
  numberOfNights,
  totalGuests,
  hasSearched,
  numberOfAdults,
  numberOfChildren,
  startDate,
  endDate,
  numChildrenUnder6,
  numchildrenOver6,
  numAdults,
  showExtraBedOver6,
}: {
  rcl: RoomClass[];
  numberOfNights: number;
  totalGuests: number;
  hasSearched?: boolean;
  numberOfAdults?: number;
  numberOfChildren?: number;
  startDate?: Date;
  endDate?: Date;
  numChildrenUnder6?: number;
  numchildrenOver6?: number;
  numAdults?: number;
  showExtraBedOver6?: boolean;
}) {
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("login");
    const userId = data ? JSON.parse(data).id : null;
    if (!userId) return;
    getUserFavorites(userId).then((res) => {
      if (res.success) setFavorites(res.data);
    });
  }, []);
  return (
    <>
      {rcl.map((rc) => (
        <RoomClassItem
          rci={rc}
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
          key={rc.id}
          favorites={favorites}
        />
      ))}
    </>
  );
}
