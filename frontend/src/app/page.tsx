"use client";
import { Container } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import style from "./page.module.css";
import Banner from "@/components/pages/home/BannerSection";
import MainRoomClassList from "@/components/pages/home/MainRoomClassSection";
import ServiceList from "@/components/pages/home/ServiceSection";
import DiscountList from "@/components/pages/home/DiscountSection";
import { useHome } from "@/hooks/useHome";
import { useRoomSearch } from "@/hooks/useRoomSearch";
import InformationSection from "@/components/pages/home/InfomationSection";

export default function Home() {
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
  const { mainRoomClasses, websiteContents, services, discounts } = useHome();
  return (
    <>
      <Banner
        banners={websiteContents}
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

      <Container fluid className={`${style.customContainer} container`}>
        <MainRoomClassList title="Loại phòng" mrcl={mainRoomClasses} />

        <ServiceList title="Dịch vụ khách sạn" svl={services} />

        <DiscountList title="Ưu đãi đặc biệt" dcl={discounts.slice(0, 3)} />

        <InformationSection title="Thông tin" />
      </Container>
    </>
  );
}
