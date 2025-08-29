"use client";
import { DateRange } from "react-date-range";
import { vi } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import style from "@/styles/components/searchBar.module.css";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import type { RoomSearchBarProps, GuestCount } from "@/types/_common";

export default function RoomSearchBar(props: RoomSearchBarProps) {
  const {
    pendingDateRange,
    setPendingDateRange,
    dateRange,
    setDateRange,
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
    numberOfNights,
    hasSearched,
    setHasSearched,
    handleSearch,
    handleResetSearch,
  } = props;
  const searchParams = useSearchParams();

  // 🧠 Đồng bộ giá trị từ localStorage hoặc URL Params
  const initSearchData = (source: any) => {
    const { startDate, endDate, guests } = source;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      setPendingDateRange([
        { startDate: start, endDate: end, key: "selection" },
      ]);
      setDateRange([{ startDate: start, endDate: end, key: "selection" }]);
    }
    const { adults = 1, children = {} } = guests;
    setPendingGuests({ adults, children });
    setGuests({ adults, children });
    setHasSearched(true);
  };

  useEffect(() => {
    const history = localStorage.getItem("lastRoomSearch");
    if (history) initSearchData(JSON.parse(history));
  }, []);

  useEffect(() => {
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    if (start && end) {
      const guests = {
        adults: Number(searchParams.get("adults") || 1),
        children: {
          age0to6: Number(searchParams.get("children6") || 0),
          age7to17: Number(searchParams.get("children17") || 0),
        },
      };
      initSearchData({ startDate: start, endDate: end, guests });
    }
  }, [searchParams]);

  // 🔒 Ẩn box khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        showGuestBox &&
        guestBoxRef.current &&
        !guestBoxRef.current.contains(t)
      ) {
        setShowGuestBox(false);
      }
      if (
        showCalendar &&
        calendarRef.current &&
        !calendarRef.current.contains(t)
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showGuestBox, showCalendar]);

  return (
    <div
      className="border mx-auto rounded-4 d-flex align-items-center justify-content-center mb-4 tw-px-5 flex-wrap"
      style={{
        position: "relative",
        maxWidth: "100%", // thay vì width cố định
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className={`px-2 ${style.calendarHover} tw-flex-1`}>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => setShowCalendar(!showCalendar)}
        >
          <label
            className="small mb-1 text-white fw-bold"
            style={{ cursor: "pointer" }}
          >
            Nhận phòng - Trả phòng
          </label>
          <div>
            {dateRange[0]?.startDate?.toLocaleDateString("vi-VN")} -{" "}
            {dateRange[0]?.endDate?.toLocaleDateString("vi-VN")}
          </div>
        </div>
        {showCalendar && (
          <div
            ref={calendarRef}
            style={{
              position: "absolute",
              zIndex: 1050,
              top: "80px",
              left: 0,
            }}
          >
            <DateRange
              editableDateInputs={true}
              onChange={(item: any) => {
                setPendingDateRange([item.selection]); // Đồng thời cập nhật hiển thị chính
              }}
              moveRangeOnFirstSelection={false}
              ranges={pendingDateRange}
              locale={vi}
              minDate={new Date()}
            />
          </div>
        )}
      </div>
      <div
        style={{ width: 1, height: 48, background: "white", opacity: 0.7 }}
      />
      {/* Khách */}
      <div
        className={`${style.calendarHover} tw-flex-2`}
        style={{ position: "relative" }}
      >
        <div
          className="form-control border-0 p-0 bg-transparent text-center text-white"
          style={{
            minWidth: 150,
            cursor: "pointer",
            background: "transparent",
          }}
          onClick={() => setShowGuestBox(!showGuestBox)}
        >
          <label className="small mb-1 fw-bold">Khách</label>
          <div>
            {guests.adults} khách
            {guests.children.age0to6 + guests.children.age7to17 > 0 &&
              `, ${guests.children.age0to6 + guests.children.age7to17} trẻ em`}
          </div>
        </div>
        {showGuestBox && (
          <div
            ref={guestBoxRef}
            className="bg-white text-dark rounded-4 shadow p-3"
            style={{
              position: "absolute",
              zIndex: 20,
              top: "110%",
              left: 0,
              minWidth: 300,
              minHeight: 120,
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <div className="fw-bold">Người lớn</div>
                <div className="small text-secondary">Từ 18 tuổi trở lên</div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={pendingGuests.adults <= 1}
                  onClick={() =>
                    setPendingGuests((guest: GuestCount) => ({
                      ...guest,
                      adults: Math.max(1, guest.adults - 1),
                    }))
                  }
                >
                  -
                </button>
                <span>{pendingGuests.adults}</span>
                <button
                  disabled={totalGuests >= 10}
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() =>
                    setPendingGuests((guest: GuestCount) => ({
                      ...guest,
                      adults: guest.adults + 1,
                    }))
                  }
                >
                  +
                </button>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <div className="fw-bold">Trẻ em</div>
                <div className="small text-secondary">7 – 17 tuổi</div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={pendingGuests.children.age7to17 <= 0}
                  onClick={() =>
                    setPendingGuests((guest: GuestCount) => ({
                      ...guest,
                      children: {
                        ...guest.children,
                        age7to17: Math.max(0, guest.children.age7to17 - 1),
                      },
                    }))
                  }
                >
                  -
                </button>
                <span>{pendingGuests.children.age7to17}</span>
                <button
                  disabled={totalGuests >= 10}
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() =>
                    setPendingGuests((guest: GuestCount) => ({
                      ...guest,
                      children: {
                        ...guest.children,
                        age7to17: guest.children.age7to17 + 1,
                      },
                    }))
                  }
                >
                  +
                </button>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <div className="fw-bold">Trẻ em</div>
                <div className="small text-secondary">0 – 6 tuổi</div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={pendingGuests.children.age0to6 <= 0}
                  onClick={() =>
                    setPendingGuests((guest: GuestCount) => ({
                      ...guest,
                      children: {
                        ...guest.children,
                        age0to6: Math.max(0, guest.children.age0to6 - 1),
                      },
                    }))
                  }
                >
                  -
                </button>
                <span>{pendingGuests.children.age0to6}</span>
                <button
                  disabled={totalGuests >= 10}
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() =>
                    setPendingGuests((guest: GuestCount) => ({
                      ...guest,
                      children: {
                        ...guest.children,
                        age0to6: guest.children.age0to6 + 1,
                      },
                    }))
                  }
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="tw-flex tw-flex-wrap tw-flex-1 tw-justify-end tw-items-center tw-gap-2 tw-h-auto tw-px-2 tw-py-5">
        <button
          className="tw-btn tw-btn-primary tw-flex-1 sm:tw-flex-none tw-flex tw-items-center tw-justify-center tw-gap-2 tw-bg-primary tw-text-black tw-p-2 tw-rounded-lg hover:tw-bg-primaryHover hover:tw-shadow-glow"
          onClick={handleSearch}
        >
          <FontAwesomeIcon icon={faSearch} />
          Tìm kiếm
        </button>
        <button
          className="tw-btn tw-btn-primary tw-flex-1 sm:tw-flex-none tw-flex tw-items-center tw-justify-center tw-gap-2 tw-bg-primary tw-text-black tw-p-2 tw-rounded-lg hover:tw-bg-primaryHover hover:tw-shadow-glow"
          onClick={handleResetSearch}
        >
          <FontAwesomeIcon icon={faTrash} />
          Xóa
        </button>
      </div>
    </div>
  );
}
