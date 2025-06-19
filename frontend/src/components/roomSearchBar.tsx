"use client";
import { DateRange } from "react-date-range";
import { vi } from "date-fns/locale";
import style from "@/app/roomtype/[parentSlug]/rcChild.module.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useEffect } from "react";
import { useData } from "@/hooks/useData";
import { toast, ToastContainer } from "react-toastify";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface RoomSearchBarProps {
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
}

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
  } = props;
  const { roomclass } = useData();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Đóng popup khi click ra ngoài
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

  // Lấy dữ liệu từ URL
  useEffect(() => {
    const start = searchParams.get("start");
    const end = searchParams.get("end");

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

        setHasSearched(true); // ✅ Chỉ gọi khi dữ liệu hợp lệ
      }
    }
  }, []);

  return (
    <>
      {/* ToastContainer phải luôn ở trong JSX và nằm ngoài hàm onClick */}
      <ToastContainer position="top-right" autoClose={3000} />
      <div>
        <div
          className="border mx-auto rounded-4 d-flex align-items-center justify-content-center mb-4"
          style={{
            position: "relative",
            width: "630px",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // đen, 60% opacity
          }}
        >
          <div
            className={`px-5 ${style.calendarHover}`}
            style={{ position: "relative" }}
          >
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
                {dateRange[0].startDate.toLocaleDateString("vi-VN")} -{" "}
                {dateRange[0].endDate.toLocaleDateString("vi-VN")}
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
            className={`${style.calendarHover}`}
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
                {pendingGuests.children.age0to6 +
                  pendingGuests.children.age7to17 >
                  0 &&
                  `, ${
                    pendingGuests.children.age0to6 +
                    pendingGuests.children.age7to17
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
                    <div className="small text-secondary">
                      Từ 18 tuổi trở lên
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      disabled={pendingGuests.adults <= 1}
                      onClick={() =>
                        setPendingGuests((g: any) => ({
                          ...g,
                          adults: Math.max(1, g.adults - 1),
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
                        setPendingGuests((g: any) => ({
                          ...g,
                          adults: g.adults + 1,
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
                        setPendingGuests((g: any) => ({
                          ...g,
                          children: {
                            ...g.children,
                            age7to17: Math.max(0, g.children.age7to17 - 1),
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
                        setPendingGuests((g: any) => ({
                          ...g,
                          children: {
                            ...g.children,
                            age7to17: g.children.age7to17 + 1,
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
                        setPendingGuests((g: any) => ({
                          ...g,
                          children: {
                            ...g.children,
                            age0to6: Math.max(0, g.children.age0to6 - 1),
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
                        setPendingGuests((g: any) => ({
                          ...g,
                          children: {
                            ...g.children,
                            age0to6: g.children.age0to6 + 1,
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
          <button
            className="rounded-pill px-4 ms-auto me-4 border-0 text-black"
            style={{ backgroundColor: "#FAB320", height: "40px" }}
            type="button"
            onClick={() => {
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

              if (
                new Date(endDate).getTime() <= new Date(startDate).getTime()
              ) {
                toast.error("Ngày đi phải sau ngày đến ít nhất 1 ngày.");
                return;
              }

              const pendingAdults = pendingGuests.adults ?? 0;
              const pendingChildren0to6 = pendingGuests.children?.age0to6 ?? 0;
              const pendingChildren7to17 =
                pendingGuests.children?.age7to17 ?? 0;
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

              // ✅ Chỉ chuyển hướng nếu đang ở trang chủ
              if (pathname === "/") {
                const query = new URLSearchParams({
                  start: startDate.toISOString(),
                  end: endDate.toISOString(),
                  adults: pendingAdults.toString(),
                  children6: pendingChildren0to6.toString(),
                  children17: pendingChildren7to17.toString(),
                });

                router.push(`/roomtype?${query.toString()}`);
              } else {
                toast.success("Tìm phòng thành công!");
              }
            }}
          >
            <i className="bi bi-search"></i> Tìm kiếm
          </button>
        </div>
      </div>
    </>
  );
}
