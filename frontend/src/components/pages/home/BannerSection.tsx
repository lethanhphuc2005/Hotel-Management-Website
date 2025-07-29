"use client";

import style from "@/styles/base/page.module.css";
import { WebsiteContent } from "@/types/websiteContent";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import RoomSearchBar from "@/components/sections/RoomSearchBar";
import Link from "next/link";
import { SearchBar } from "@/types/_common";

interface BannerProps extends SearchBar {
  banners: WebsiteContent[];
}

export default function Banner(props: BannerProps) {
  const {
    banners,
    pendingDateRange,
    setPendingDateRange,
    dateRange,
    setDateRange,
    capacity,
    pendingGuests,
    setPendingGuests,
    guests,
    setGuests,
    price,
    setPrice,
    showCalendar,
    setShowCalendar,
    showGuestBox,
    setShowGuestBox,
    guestBoxRef,
    calendarRef,
    totalGuests,
    numberOfAdults,
    numberOfChildren,
    numberOfNights,
    totalPrice,
    hasSearched,
    setHasSearched,
    handleSearch,
    handleResetSearch,
  } = props;
  if (!banners || banners.length === 0) return <p>No banner</p>;

  const images = banners.map((banner) => banner.image);
  const titles = banners.map((banner) => banner.title);

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
          pendingDateRange={pendingDateRange}
          setPendingDateRange={setPendingDateRange}
          dateRange={dateRange}
          setDateRange={setDateRange}
          capacity={capacity}
          pendingGuests={pendingGuests}
          setPendingGuests={setPendingGuests}
          guests={guests}
          setGuests={setGuests}
          price={price}
          setPrice={setPrice}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
          showGuestBox={showGuestBox}
          setShowGuestBox={setShowGuestBox}
          guestBoxRef={guestBoxRef}
          calendarRef={calendarRef}
          totalGuests={totalGuests}
          numberOfAdults={numberOfAdults}
          numberOfChildren={numberOfChildren}
          numberOfNights={numberOfNights}
          totalPrice={totalPrice}
          hasSearched={hasSearched}
          setHasSearched={setHasSearched}
          handleSearch={handleSearch}
          handleResetSearch={handleResetSearch}
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
                src={img.url}
                alt={`Banner ${index + 1}`}
                className={style.bannerImage}
              />
              <div className={style.bannerContent}>
                <h1 className={` ${style.text}`}>{titles[index]}</h1>
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
