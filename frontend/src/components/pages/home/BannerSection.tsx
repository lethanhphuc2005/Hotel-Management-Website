"use client";

import style from "@/styles/base/page.module.css";
import { WebsiteContent } from "@/types/websiteContent";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import RoomSearchBar from "@/components/sections/RoomSearchBar";
import Link from "next/link";
import getImageUrl from "@/utils/getImageUrl";
import { SearchBar } from "@/types/_common";

interface BannerProps extends SearchBar {
  banners: WebsiteContent[];
}

export default function Banner(props: BannerProps) {
  const {
    banners,
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
    price,
    setPrice,
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
          price={price}
          setPrice={setPrice}
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
                src={getImageUrl(img)}
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
