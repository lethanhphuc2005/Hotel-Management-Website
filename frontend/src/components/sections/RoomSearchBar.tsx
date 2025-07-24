"use client";
import { DateRange } from "react-date-range";
import { vi } from "date-fns/locale";
import style from "@/styles/components/searchBar.module.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GuestCount, SearchBar } from "@/types/_common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";

interface RoomSearchBarProps extends SearchBar {}

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
    maxGuests,
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
    handleSearch,
    price,
    setPrice,
  } = props;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showGuestBox &&
        guestBoxRef.current &&
        !guestBoxRef.current.contains(event.target as Node)
      ) {
        setShowGuestBox(false);
      }
      if (
        showCalendar &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    }
    if (showGuestBox || showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showGuestBox, showCalendar]);

  useEffect(() => {
    const searchHistory = localStorage.getItem("lastRoomSearch");
    if (!searchHistory) return;
    const { startDate, endDate, guests } = searchHistory
      ? JSON.parse(searchHistory)
      : {
          startDate: new Date(),
          endDate: new Date(),
          guests: { adults: 1, children: { age0to6: 0, age7to17: 0 } },
        };

    const start = startDate;
    const end = endDate;

    const adults = Number(guests.adults || 1);
    const children6 = Number(guests.children.age0to6 || 0);
    const children17 = Number(guests.children.age7to17 || 0);

    // Luôn set guests (nếu muốn)
    setGuests({
      adults,
      children: {
        age0to6: children6,
        age7to17: children17,
      },
    });

    setPendingGuests({
      adults,
      children: {
        age0to6: children6,
        age7to17: children17,
      },
    });

    // ✅ Chỉ khi có ngày thì mới set các giá trị liên quan đến tìm kiếm
    if (start && end) {
      const startD = new Date(start);
      const endD = new Date(end);

      if (!isNaN(startD.getTime()) && !isNaN(endD.getTime())) {
        setStartDate(startD);
        setEndDate(endD);
        setDateRange([{ startDate: startD, endDate: endD, key: "selection" }]);
        setPendingDateRange([
          { startDate: startD, endDate: endD, key: "selection" },
        ]);

        const nights = Math.ceil(
          (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
        );
        setNumberOfNights(nights);
        if (setPrice) setPrice(price);
      }
    }
  }, []);
  useEffect(() => {
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    if (!start || !end) return;

    const adults = Number(searchParams.get("adults") || 1);
    const children6 = Number(searchParams.get("children6") || 0);
    const children17 = Number(searchParams.get("children17") || 0);

    // Luôn set guests (nếu muốn)
    setGuests({
      adults,
      children: {
        age0to6: children6,
        age7to17: children17,
      },
    });

    setPendingGuests({
      adults,
      children: {
        age0to6: children6,
        age7to17: children17,
      },
    });

    // ✅ Chỉ khi có ngày thì mới set các giá trị liên quan đến tìm kiếm
    if (start && end) {
      const startD = new Date(start);
      const endD = new Date(end);

      if (!isNaN(startD.getTime()) && !isNaN(endD.getTime())) {
        setStartDate(startD);
        setEndDate(endD);
        setDateRange([{ startDate: startD, endDate: endD, key: "selection" }]);
        setPendingDateRange([
          { startDate: startD, endDate: endD, key: "selection" },
        ]);

        const nights = Math.ceil(
          (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
        );
        setNumberOfNights(nights);
      }
    }
  }, []);

  const handleResetSearch = () => {
    setDateRange([
      { startDate: new Date(), endDate: new Date(), key: "selection" },
    ]);
    setPendingDateRange([
      { startDate: new Date(), endDate: new Date(), key: "selection" },
    ]);
    setGuests({ adults: 1, children: { age0to6: 0, age7to17: 0 } });
    setPendingGuests({ adults: 1, children: { age0to6: 0, age7to17: 0 } });
    setStartDate(new Date());
    setEndDate(new Date());
    setNumberOfNights(0);
    setHasSearched(false);
    setPrice(500000);
    localStorage.removeItem("lastRoomSearch");
    if (pathname === "/") {
      router.push("/room-class");
    } else {
      toast.success("Đã xóa tìm kiếm phòng.");
    }
  };

  const handleSearchClick = () => {
    if (!Array.isArray(pendingDateRange) || !pendingDateRange[0]) {
      toast.warning("Vui lòng chọn ngày đến và ngày đi.");
      return;
    }

    const startDate = pendingDateRange[0]?.startDate;
    const endDate = pendingDateRange[0]?.endDate;

    if (!startDate || !endDate) {
      toast.warning("Vui lòng chọn ngày đến và ngày đi.");
      return;
    }

    if (new Date(endDate).getTime() <= new Date(startDate).getTime()) {
      toast.error("Ngày đi phải sau ngày đến ít nhất 1 ngày.");
      return;
    }

    const pendingAdults = pendingGuests.adults ?? 0;
    const pendingChildren0to6 = pendingGuests.children?.age0to6 ?? 0;
    const pendingChildren7to17 = pendingGuests.children?.age7to17 ?? 0;
    const pendingTotalGuests =
      pendingAdults + pendingChildren0to6 + pendingChildren7to17;

    if (pendingTotalGuests > maxGuests) {
      toast.error(
        `Số khách (${pendingTotalGuests}) vượt quá sức chứa tối đa (${maxGuests}).`
      );
      return;
    }

    // Cập nhật giá trị thực tế từ tạm thời
    setGuests(pendingGuests);
    setDateRange(pendingDateRange);

    const nights = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    setStartDate(startDate);
    setEndDate(endDate);
    setNumberOfNights(nights);
    setHasSearched(true);

    // ✅ Lưu vào localStorage
    const savedSearch = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      guests: pendingGuests,
    };
    localStorage.setItem("lastRoomSearch", JSON.stringify(savedSearch));

    // ✅ Điều hướng nếu ở trang chủ
    if (pathname === "/") {
      const query = new URLSearchParams({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        adults: pendingAdults.toString(),
        children6: pendingChildren0to6.toString(),
        children17: pendingChildren7to17.toString(),
      });

      router.push(`/room-class?${query.toString()}`);
    } else {
      router.push("/room-class");
      toast.success("Tìm phòng thành công!");
    }
  };

  return (
    <div
      className="border mx-auto rounded-4 d-flex align-items-center justify-content-center mb-4 tw-px-5"
      style={{
        position: "relative",
        width: "630px",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // đen, 60% opacity
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
                setPendingDateRange([item.selection]); // Cập nhật pending trước
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
            {pendingGuests.adults} khách
            {pendingGuests.children.age0to6 + pendingGuests.children.age7to17 >
              0 &&
              `, ${
                pendingGuests.children.age0to6 + pendingGuests.children.age7to17
              } trẻ em`}
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
                  disabled={totalGuests >= maxGuests}
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
                  disabled={totalGuests >= maxGuests}
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
                  disabled={totalGuests >= maxGuests}
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
      <div
        style={{ width: 1, height: 48, background: "white", opacity: 0.7 }}
      />
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
