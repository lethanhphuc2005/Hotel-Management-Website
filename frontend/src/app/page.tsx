"use client";
import { Container } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import style from "@/styles/base/page.module.css";
import Banner from "@/components/pages/home/BannerSection";
import MainRoomClassList from "@/components/pages/home/MainRoomClassSection";
import ServiceList from "@/components/pages/home/ServiceSection";
import DiscountList from "@/components/pages/home/DiscountSection";
import { useHome } from "@/hooks/useHome";
import { useRoomSearch } from "@/hooks/useRoomSearch";
import InformationSection from "@/components/pages/home/InfomationSection";
import GeminiSuggestionsSection from "@/components/pages/home/RecommendSection";
import { useAISuggestions } from "@/hooks/useAISuggestion";

export default function Home() {
  const {
    pendingDateRange,
    setPendingDateRange,
    dateRange,
    setDateRange,
    hasSaturdayNight,
    hasSundayNight,
    capacity,
    pendingGuests,
    setPendingGuests,
    guests,
    setGuests,
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
    hasSearched,
    setHasSearched,
    handleSearch,
    handleResetSearch,
  } = useRoomSearch();
  const { mainRoomClasses, websiteContents, services, discounts } = useHome();
  // const suggestions = useAISuggestions();
  return (
    <>
      <Banner
        banners={websiteContents}
        pendingDateRange={pendingDateRange}
        setPendingDateRange={setPendingDateRange}
        dateRange={dateRange}
        setDateRange={setDateRange}
        capacity={capacity}
        pendingGuests={pendingGuests}
        setPendingGuests={setPendingGuests}
        guests={guests}
        setGuests={setGuests}
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
        hasSearched={hasSearched}
        setHasSearched={setHasSearched}
        handleSearch={handleSearch}
        handleResetSearch={handleResetSearch}
      />

      <Container fluid className={`${style.customContainer} container`}>
        {/* {suggestions && <GeminiSuggestionsSection roomClasses={suggestions} />} */}

        <MainRoomClassList title="Loại phòng" mrcl={mainRoomClasses} />

        <ServiceList title="Dịch vụ khách sạn" svl={services} />

        <DiscountList title="Ưu đãi đặc biệt" dcl={discounts.slice(0, 3)} />

        <InformationSection title="Thông tin" />
      </Container>
    </>
  );
}
