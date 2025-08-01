"use client";
import { useParams } from "next/navigation";
import { useRoomClassDetail } from "@/hooks/data/useRoomClass";
import ImageAlbum from "@/components/pages/roomClassDetail/ImageAlbum";
import InformationSection from "@/components/pages/roomClassDetail/InformationSection";
import FeatureSection from "@/components/pages/roomClassDetail/FeatureSection";
import ReviewSection from "@/components/pages/roomClassDetail/ReviewSection";
import FAQSection from "@/components/pages/roomClassDetail/FaqSection";
import ImportantInfoSection from "@/components/pages/roomClassDetail/ImportantInfoSection";
import { useRoomSearch } from "@/hooks/logic/useRoomSearch";
import { useRoomReviews } from "@/hooks/data/useReview";
import { useState } from "react";
import { useRoomComments } from "@/hooks/data/useComment";

const RoomDetailPage = () => {
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

  const params = useParams();
  const roomId = params.id as string;

  const { roomClass } = useRoomClassDetail(roomId);
  const { features, images } = roomClass || {};

  if (!roomClass || !features || !images) {
    return <div className="tw-text-center tw-mt-10">Loading...</div>;
  }
  return (
    <div className="tw-mx-[15%] tw-my-[100px]">
      <ImageAlbum images={images} />
      <InformationSection
        roomClass={roomClass}
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
      <FeatureSection features={features} />
      <ReviewSection roomId={roomId} />
      <FAQSection roomId={roomId} />
      <ImportantInfoSection />
    </div>
  );
};

export default RoomDetailPage;
