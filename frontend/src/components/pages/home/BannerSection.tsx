"use client";

import style from "@/app/page.module.css";
import { WebsiteContent } from "@/types/websiteContent";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import RoomSearchBar from "@/components/sections/RoomSearchBar";
import { useRoomSearch } from "@/hooks/useRoomSearch";
import Link from "next/link";

export default function Banner({ banners }: { banners: WebsiteContent[] }) {
  if (!banners || banners.length === 0) return <p>No banner</p>;

  const banner = banners[2];
  const mongoImage = banner.image;
  const titles = [banner.title, "Experience Luxury", "Relax and Enjoy"];

  const defaultImages = ["banner2.jpg", "banner4.jpg"];
  // Tạo danh sách ảnh: ảnh từ Mongo + ảnh mặc định
  const images = [mongoImage, ...defaultImages];
  const {
    dateRange,
    setDateRange,
    guests,
    setGuests,
    showCalendar,
    setShowCalendar,
    showGuestBox,
    setShowGuestBox,
    guestBoxRef,
    calendarRef,
    maxGuests,
    setMaxGuests,
    totalGuests,
    numberOfNights,
    setNumberOfNights,
    totalPrice,
    setTotalPrice,
    hasSearched,
    setHasSearched,
    pendingGuests,
    setPendingGuests,
    pendingDateRange,
    setPendingDateRange,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useRoomSearch();
  return (
    <section className={style.banner}>
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 999,
          width: "100%",
        }}
      >
        <RoomSearchBar
          dateRange={dateRange}
          setDateRange={setDateRange}
          guests={guests}
          setGuests={setGuests}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
          showGuestBox={showGuestBox}
          setShowGuestBox={setShowGuestBox}
          guestBoxRef={guestBoxRef}
          calendarRef={calendarRef}
          maxGuests={maxGuests}
          setMaxGuests={setMaxGuests}
          totalGuests={totalGuests}
          numberOfNights={numberOfNights}
          setNumberOfNights={setNumberOfNights}
          totalPrice={totalPrice}
          setTotalPrice={setTotalPrice}
          hasSearched={hasSearched}
          setHasSearched={setHasSearched}
          pendingGuests={pendingGuests}
          setPendingGuests={setPendingGuests}
          pendingDateRange={pendingDateRange}
          setPendingDateRange={setPendingDateRange}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      </div>
      <Swiper
        loop={true}
        autoplay={{ delay: 5000 }}
        modules={[Autoplay, Navigation]}
        navigation={true}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <section className={style.banner}>
              <img
                src={`/img/${img}`}
                alt={`Banner ${index + 1}`}
                className={style.bannerImage}
              />
              <div className={style.bannerContent}>
                <h2 className={`fw-bold ${style.text}`}>{titles[index]}</h2>
                <Link
                  href={"/room-class"}
                  className="tw-text-decoration-none tw-text-white"
                >
                  <button
                    className={`bg-transparent p-2 mt-3 ${style.btnBooking} fw-bold border-1`}
                  >
                    BOOKING
                  </button>
                </Link>
              </div>
            </section>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
