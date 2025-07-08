"use client";
import RoomClassItem from "./roomClassItem";
import "swiper/css";
import "swiper/css/navigation";
import { RoomClass } from "@/types/roomClass";
import { useEffect, useState } from "react";
import { getUserFavorites } from "@/services/UserFavoriteService";
import { UserFavorite } from "@/types/userFavorite";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

interface RoomClassListForSearchProps {
  roomClasses: RoomClass[];
}

export const RoomClassListForSearch = ({ roomClasses }: RoomClassListForSearchProps) => {
  console.log("Room classes for search:", roomClasses);
  if (roomClasses.length === 0) {
    return (
      <p className="tw-text-white tw-opacity-70 tw-mt-4">
        Không tìm thấy loại phòng phù hợp.
      </p>
    );
  }

  return (
    <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
      {roomClasses.map((room) => (
        <div
          key={room.id}
          className="tw-bg-neutral-800 tw-rounded-2xl tw-shadow-lg tw-overflow-hidden tw-transition hover:tw-scale-[1.02] tw-duration-300"
        >
          {/* Ảnh loại phòng */}
          <div className="tw-aspect-[4/3] tw-overflow-hidden">
            <img
              src={`http://localhost:8000/images/${room.images?.[0]?.url}` || "/images/room-default.jpg"}
              alt={room.name}
              className="tw-w-full tw-h-full tw-object-cover tw-transition-transform hover:tw-scale-110 tw-duration-300"
            />
          </div>

          {/* Thông tin */}
          <div className="tw-p-4">
            <h3 className="tw-text-lg tw-font-semibold tw-text-white">
              {room.name}
            </h3>
            <p className="tw-text-sm tw-text-gray-300 tw-mt-1 tw-line-clamp-2">
              {room.description}
            </p>
            <p className="tw-mt-2 tw-font-bold tw-text-yellow-400">
              {room.price?.toLocaleString()}đ / đêm
            </p>
            <Link
              href={`/room/${room.id}`}
              className="tw-inline-block tw-mt-3 tw-text-yellow-400 hover:tw-underline tw-text-sm"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
