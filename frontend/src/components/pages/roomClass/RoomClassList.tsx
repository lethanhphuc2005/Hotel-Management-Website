"use client";
import RoomClassItem from "./roomClassItem";
import "swiper/css";
import "swiper/css/navigation";
import { RoomClass } from "@/types/roomClass";
import { useEffect, useState } from "react";
import { getUserFavorites } from "@/services/UserFavoriteService";
import { UserFavorite } from "@/types/userFavorite";
import Link from "next/link";
import { AnimatedButtonPrimary } from "@/components/common/Button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
import Image from "next/image";
import style from "@/styles/base/page.module.css";
import { formatCurrencyVN } from "@/utils/currencyUtils";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import getImageUrl from "@/utils/getImageUrl";
import Pagination from "@/components/sections/Pagination";

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
    const data = localStorage.getItem("accessToken");
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
  title: string;
  roomClasses: RoomClass[];
}

export const RoomClassListForSearch = ({
  title,
  roomClasses,
}: RoomClassListForSearchProps) => {
  if (roomClasses.length === 0) {
    return (
      <p className="tw-text-white tw-opacity-70 tw-mt-4">
        Không tìm thấy loại phòng phù hợp.
      </p>
    );
  }

  const [ref, controls] = useScrollAnimation(0.2, false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={controls}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="tw-w-full"
    >
      <h2 className={style.sectionTitle}>{title}</h2>

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={3}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="tw-mt-4"
      >
        {roomClasses.map((room) => (
          <SwiperSlide key={room.id}>
            <div className="tw-bg-neutral-800 tw-rounded-2xl tw-shadow-lg tw-overflow-hidden tw-transition hover:tw-scale-[1.02] tw-duration-300 tw-flex tw-flex-col tw-h-[500px] tw-text-center">
              {/* Ảnh */}
              <div className="tw-aspect-[4/3] tw-overflow-hidden">
                <Image
                  src={getImageUrl(room.images?.[0]?.url)}
                  alt={room.name}
                  width={400}
                  height={260}
                  className="tw-w-full tw-h-full tw-object-cover tw-transition-transform hover:tw-scale-110 tw-duration-300"
                />
              </div>

              {/* Nội dung */}
              <div className="tw-p-4 tw-text-left tw-flex-1">
                <h3 className="tw-text-lg tw-font-semibold tw-text-white">
                  {room.name}
                </h3>
                <p className="tw-text-sm tw-text-gray-300 tw-mt-1 tw-line-clamp-1">
                  {room.description}
                </p>

                {room.features && room.features.length > 0 && (
                  <p className="tw-mt-2">
                    Tiện nghi:
                    {room.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="badge bg-secondary ms-1">
                        {feature.feature.name}
                      </span>
                    ))}
                    {room.features.length > 3 && (
                      <span className="badge bg-secondary ms-1">
                        +{room.features.length - 3}
                      </span>
                    )}
                  </p>
                )}

                <p className="tw-mt-2 tw-font-bold tw-text-yellow-400">
                  Chỉ từ: {formatCurrencyVN(room.price)}/ đêm
                </p>
              </div>
              <Link
                href={`/room-class/${room.id}`}
                className="tw-mt-4 tw-flex-1 tw-w-full"
              >
                <AnimatedButtonPrimary className="tw-py-2 tw-px-20 tw-m-4">
                  Xem chi tiết
                </AnimatedButtonPrimary>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
};
