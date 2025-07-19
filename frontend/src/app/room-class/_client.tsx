"use client";
import React, { useEffect, useState } from "react";
import RoomSearchBar from "@/components/sections/RoomSearchBar";
import FilterSidebar from "@/components/pages/roomClass/FilterSidebar";
import RoomListDisplay from "@/components/pages/roomClass/ListDisplay";
import { useRoomSearch } from "@/hooks/useRoomSearch";
import { useRoomFilterLogic } from "@/hooks/useRoomFilterLogic";
import { useRoomClass } from "@/hooks/useRoomClass";
import { useSearchParams } from "next/navigation";

export default function RoomClassesPage() {
  const {
    price,
    setPrice,
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
    numberOfAdults,
    numberOfChildren,
    pendingGuests,
    setPendingGuests,
    pendingDateRange,
    setPendingDateRange,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useRoomSearch();

  const { roomClasses, features, mainRoomClasses } = useRoomClass();

  const views = ["biển", "thành phố", "núi", "vườn", "hồ bơi", "sông", "hồ"];
  const [selectedViews, setSelectedViews] = useState<string[]>([]);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);
  const [selectedMainRoomClassIds, setSelectedMainRoomClassIds] = useState<
    string[]
  >([]);
  const [showViewFilter, setShowViewFilter] = useState(false);
  const [showFeatureFilter, setShowFeatureFilter] = useState(false);
  const [showMainRoomClassFilter, setShowMainRoomClassFilter] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("price_asc");
  const params = useSearchParams();
  useEffect(() => {
    const mainRoomClassId = params.get("mainRoomClassId");
    if (mainRoomClassId) {
      setSelectedMainRoomClassIds([mainRoomClassId]);
    }
    const roomClassParam = params.get("roomClass");
    if (roomClassParam) {
      setSearchTerm(roomClassParam);
    }
  }, [params]);

  const {
    filteredRoomClass,
    displayRoomClass,
    isOverCapacity,
    numChildrenUnder6,
    numChildrenOver6,
    numAdults,
  } = useRoomFilterLogic({
    roomClasses,
    searchTerm,
    sortOption,
    selectedViews,
    selectedFeatureIds,
    selectedMainRoomClassIds,
    priceRange,
    guests,
    dateRange,
  });

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const value = e.target.value;
    setState((prev) =>
      e.target.checked
        ? [...prev, value]
        : prev.filter((item) => item !== value)
    );
  };

  return (
    <div
      className="container text-white"
      style={{ marginTop: "7%", marginBottom: "10%" }}
    >
      <div className="row">
        <RoomSearchBar
          {...{
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
            numberOfAdults,
            numberOfChildren,
            pendingGuests,
            setPendingGuests,
            pendingDateRange,
            setPendingDateRange,
            startDate,
            setStartDate,
            endDate,
            setEndDate,
            numAdults,
            numChildrenUnder6,
            numChildrenOver6,
            price,
            setPrice,
          }}
        />
      </div>

      <div className="row">
        <div className="col-3 border-end border-top h-auto">
          <FilterSidebar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortOption={sortOption}
            setSortOption={setSortOption}
            views={views}
            selectedViews={selectedViews}
            setSelectedViews={setSelectedViews}
            features={features}
            selectedFeatureIds={selectedFeatureIds}
            setSelectedFeatureIds={setSelectedFeatureIds}
            mainRoomClasses={mainRoomClasses}
            selectedMainRoomClassIds={selectedMainRoomClassIds}
            setSelectedMainRoomClassIds={setSelectedMainRoomClassIds}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            showViewFilter={showViewFilter}
            setShowViewFilter={setShowViewFilter}
            showFeatureFilter={showFeatureFilter}
            setShowFeatureFilter={setShowFeatureFilter}
            showMainRoomClassFilter={showMainRoomClassFilter}
            setShowMainRoomClassFilter={setShowMainRoomClassFilter}
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>

        <div className="col-9 border-top">
          <div className="row p-3 gap-3">
            <RoomListDisplay
              hasSearched={hasSearched}
              isOverCapacity={isOverCapacity}
              filteredRoomClass={filteredRoomClass}
              displayRoomClass={displayRoomClass}
              numberOfNights={numberOfNights}
              totalGuests={totalGuests}
              numberOfAdults={numberOfAdults}
              numberOfChildren={numberOfChildren}
              startDate={startDate}
              endDate={endDate}
              numChildrenUnder6={numChildrenUnder6}
              numchildrenOver6={numChildrenOver6}
              numAdults={numAdults}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
