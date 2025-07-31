"use client";
import React, { useEffect, useMemo, useState } from "react";
import RoomSearchBar from "@/components/sections/RoomSearchBar";
import FilterSidebar from "@/components/pages/roomClass/FilterSidebar";
import RoomListDisplay from "@/components/pages/roomClass/ListDisplay";
import { useRoomSearch } from "@/hooks/useRoomSearch";
import { useRoomClass } from "@/hooks/useRoomClass";
import { useSearchParams } from "next/navigation";

export default function RoomClassesPage() {
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
  const views = ["biển", "thành phố", "núi", "vườn", "hồ bơi", "sông", "hồ"];
  const [selectedViews, setSelectedViews] = useState<string[]>([]);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);
  const [selectedMainRoomClassIds, setSelectedMainRoomClassIds] = useState<
    string[]
  >([]);
  const [showViewFilter, setShowViewFilter] = useState<boolean>(false);
  const [showFeatureFilter, setShowFeatureFilter] = useState<boolean>(false);
  const [showMainRoomClassFilter, setShowMainRoomClassFilter] =
    useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10_000_000]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("price");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // số phòng mỗi trang
  const params = useSearchParams();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to midnight for comparison
  const startDate = dateRange[0].startDate || new Date();
  const endDate = dateRange[0].endDate || new Date();

  const memoizedParams = useMemo(() => {
    const isStartToday =
      startDate instanceof Date &&
      new Date(startDate).setHours(0, 0, 0, 0) === today.getTime();

    const isEndToday =
      endDate instanceof Date &&
      new Date(endDate).setHours(0, 0, 0, 0) === today.getTime();

    const baseParams: Record<string, any> = {
      search: searchTerm,
      sort: sortOption,
      order: sortOrder,
      page: currentPage,
      limit: pageSize,
      minCapacity: capacity,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    };

    if (!isStartToday || !isEndToday) {
      baseParams.check_in_date =
        dateRange[0].startDate instanceof Date
          ? dateRange[0].startDate.toISOString().split("T")[0]
          : "";
      baseParams.check_out_date =
        dateRange[0].endDate instanceof Date
          ? dateRange[0].endDate.toISOString().split("T")[0]
          : "";
    }

    // Thêm từng giá trị array vào params
    if (Array.isArray(selectedViews)) {
      selectedViews.forEach((v) => {
        if (v) baseParams.view = [...(baseParams.view || []), v];
      });
    }

    if (Array.isArray(selectedFeatureIds)) {
      selectedFeatureIds.forEach((f) => {
        if (f) baseParams.feature = [...(baseParams.feature || []), f];
      });
    }

    if (Array.isArray(selectedMainRoomClassIds)) {
      selectedMainRoomClassIds.forEach((t) => {
        if (t) baseParams.type = [...(baseParams.type || []), t];
      });
    }

    return baseParams;
  }, [
    searchTerm,
    dateRange,
    guests,
    priceRange,
    selectedMainRoomClassIds,
    selectedViews,
    selectedFeatureIds,
    currentPage,
  ]);

  const { roomClasses, features, mainRoomClasses, totalRoomClasses } =
    useRoomClass(memoizedParams);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

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
    setCurrentPage(1);
  };

  return (
    <div
      className="container text-white"
      style={{ marginTop: "7%", marginBottom: "10%" }}
    >
      <div className="row">
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
      </div>

      <div className="row">
        <div className="col-3 border-top h-auto">
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
            setCurrentPage={setCurrentPage}
          />
        </div>

        <div className="col-9 border-top">
            <RoomListDisplay
              hasSearched={hasSearched}
              displayRoomClasses={roomClasses}
              numberOfNights={numberOfNights}
              numberOfAdults={numberOfAdults}
              numberOfChildrenUnder6={guests.children.age0to6}
              numberOfChildrenOver6={guests.children.age7to17}
              startDate={startDate}
              endDate={endDate}
              capacity={capacity}
              hasSaturdayNight={hasSaturdayNight}
              hasSundayNight={hasSundayNight}
              totalRoomClasses={totalRoomClasses}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
        </div>
      </div>
    </div>
  );
}
