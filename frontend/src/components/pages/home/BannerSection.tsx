"use client";

import style from "@/styles/base/page.module.css";
import { WebsiteContent } from "@/types/websiteContent";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import RoomSearchBar from "@/components/sections/RoomSearchBar";
import Link from "next/link";

interface BannerProps {
  banners: WebsiteContent[];
  dateRange: any;
  setDateRange: (range: any) => void;
  guests: {
    adults: number;
    children: {
      age0to6: number;
      age7to17: number;
    };
  };
  setGuests: React.Dispatch<
    React.SetStateAction<{
      adults: number;
      children: {
        age0to6: number;
        age7to17: number;
      };
    }>
  >;
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
  showGuestBox: boolean;
  setShowGuestBox: (show: boolean) => void;
  guestBoxRef: React.RefObject<HTMLDivElement | null>;
  calendarRef: React.RefObject<HTMLDivElement | null>;
  maxGuests: number;
  setMaxGuests: React.Dispatch<React.SetStateAction<number>>;
  totalGuests: number;
  numberOfNights: number;
  setNumberOfNights: React.Dispatch<React.SetStateAction<number>>;
  totalPrice: number;
  setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
  hasSearched: boolean;
  setHasSearched: React.Dispatch<React.SetStateAction<boolean>>;
  numberOfAdults?: number;
  numberOfChildren?: number;
  pendingGuests: any;
  setPendingGuests: React.Dispatch<React.SetStateAction<any>>;
  pendingDateRange: any;
  setPendingDateRange: React.Dispatch<React.SetStateAction<any>>;
  startDate: Date;
  setStartDate: React.Dispatch<React.SetStateAction<Date>>;
  endDate: Date;
  setEndDate: React.Dispatch<React.SetStateAction<Date>>;
  numAdults?: number;
  numChildrenUnder6?: number;
  numChildrenOver6?: number;
  totalEffectiveGuests?: number;
  showExtraBedOver6?: boolean;
  handleSearch?: () => void;
  price: number;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
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

  const banner = banners[1];
  const mongoImage = banner.image;
  const titles = ["Experience Luxury", "Relax and Enjoy", banner.title];

  const defaultImages = ["banner2.jpg", "banner4.jpg"];
  // Tạo danh sách ảnh: ảnh từ Mongo + ảnh mặc định
  const images = [...defaultImages, mongoImage];

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
