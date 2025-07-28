"use client";
import { DateRange } from "react-date-range";
import { vi } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import style from "@/styles/components/searchBar.module.css";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import type { RoomSearchBarProps, GuestCount } from "@/types/_common";

export default function RoomSearchBar(props: RoomSearchBarProps) {
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
    totalGuests,
    numberOfNights,
    totalPrice,
    hasSearched,
    setHasSearched,
    handleSearch,
    price,
    setPrice,
  } = props;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 🧠 Đồng bộ giá trị từ localStorage hoặc URL Params
  const initSearchData = (source: any) => {
    const { startDate, endDate, guests } = source;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      const nights = Math.ceil((+end - +start) / (1000 * 60 * 60 * 24));

      setDateRange([{ startDate: start, endDate: end, key: "selection" }]);
    }

    const { adults = 1, children = {} } = guests;
    setGuests({ adults, children });
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

  const handleResetSearch = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const resetRange = [{ startDate: now, endDate: now, key: "selection" }];

    setDateRange(resetRange);
    setGuests({ adults: 1, children: { age0to6: 0, age7to17: 0 } });
    setHasSearched(false);
    localStorage.removeItem("lastRoomSearch");
    toast.success("Đã xóa tìm kiếm phòng.");
  };

  const handleSearchClick = () => {
    const range = dateRange[0];
    const start = range?.startDate;
    const end = range?.endDate;
    const { adults, children } = guests;
    const totalGuestsCount =
      adults + (children.age0to6 || 0) + (children.age7to17 || 0);

    if (!start || !end) {
      return toast.warning("Vui lòng chọn ngày đến và ngày đi.");
    }
    if (+end <= +start) {
      return toast.warning("Ngày đi phải sau ngày đến.");
    }

    const nights = Math.ceil((+end - +start) / (1000 * 60 * 60 * 24));
    setGuests({
      adults,
      children: {
        age0to6: children.age0to6 || 0,
        age7to17: children.age7to17 || 0,
      },
    });
    setDateRange([range]);
    setHasSearched(true);
    localStorage.setItem(
      "lastRoomSearch",
      JSON.stringify({
        startDate: start,
        endDate: end,
        guests: { adults, children },
      })
    );

    const query = new URLSearchParams({
      start: start.toISOString(),
      end: end.toISOString(),
      adults: adults.toString(),
      children6: children.age0to6.toString(),
      children17: children.age7to17.toString(),
    });

    router.push(
      pathname === "/" ? `/room-class?${query.toString()}` : "/room-class"
    );
    if (pathname !== "/") toast.success("Tìm phòng thành công!");
  };

  return (
    <div
      className="border mx-auto rounded-4 d-flex align-items-center justify-content-center mb-4 tw-px-5"
      style={{
        position: "relative",
        width: "630px",
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
                setDateRange([item.selection]); // Đồng thời cập nhật hiển thị chính
              }}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
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
                  disabled={guests.adults <= 1}
                  onClick={() =>
                    setGuests((guest: GuestCount) => ({
                      ...guest,
                      adults: Math.max(1, guest.adults - 1),
                    }))
                  }
                >
                  -
                </button>
                <span>{guests.adults}</span>
                <button
                  disabled={totalGuests >= 10}
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() =>
                    setGuests((guest: GuestCount) => ({
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
                  disabled={guests.children.age7to17 <= 0}
                  onClick={() =>
                    setGuests((guest: GuestCount) => ({
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
                <span>{guests.children.age7to17}</span>
                <button
                  disabled={totalGuests >= 10}
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() =>
                    setGuests((guest: GuestCount) => ({
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
                  disabled={guests.children.age0to6 <= 0}
                  onClick={() =>
                    setGuests((guest: GuestCount) => ({
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
                <span>{guests.children.age0to6}</span>
                <button
                  disabled={totalGuests >= 10}
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() =>
                    setGuests((guest: GuestCount) => ({
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
      <div className="tw-flex tw-flex-1 tw-justify-end tw-items-center tw-gap-2 tw-h-[40px] tw-px-2">
        <button
          className="tw-btn tw-btn-primary tw-flex tw-items-center tw-gap-2 tw-bg-primary tw-text-black tw-p-2 tw-rounded-lg hover:tw-bg-primaryHover hover:tw-shadow-glow"
          onClick={handleSearchClick}
        >
          <FontAwesomeIcon icon={faSearch} />
          Tìm kiếm
        </button>
        <button
          className="tw-btn tw-btn-primary tw-flex tw-items-center tw-gap-2 tw-bg-primary tw-text-black tw-p-2 tw-rounded-lg hover:tw-bg-primaryHover hover:tw-shadow-glow"
          onClick={handleResetSearch}
        >
          <FontAwesomeIcon icon={faTrash} />
          Xóa
        </button>
      </div>
    </div>
  );
}
