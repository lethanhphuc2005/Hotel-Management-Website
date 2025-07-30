"use client";
import { DateRange } from "react-date-range";
import { vi } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useEffect } from "react";
import { toast } from "react-toastify";

import {
  AnimatedButton,
  AnimatedButtonPrimary,
} from "@/components/common/Button";
import { formatCurrencyVN } from "@/utils/currencyUtils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/contexts/store";
import { addRoomToCart } from "@/contexts/cartSlice";
import { GuestCount, RoomSearchBarProps } from "@/types/_common";
import { RoomClass } from "@/types/roomClass";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface RoomBookingBoxProps extends RoomSearchBarProps {
  roomClass: RoomClass;
}

export default function RoomBookingBox(props: RoomBookingBoxProps) {
  const {
    roomClass,
    pendingDateRange,
    setPendingDateRange,
    dateRange,
    setDateRange,
    hasSaturdayNight = false,
    hasSundayNight = false,
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
  } = props;
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const basePrice =
    (roomClass.price_discount ?? 0) > 0
      ? roomClass.price_discount ?? 0
      : roomClass.price;

  const startDate = dateRange[0]?.startDate ?? new Date();
  const endDate = dateRange[0]?.endDate ?? new Date();
  const numberOfChildrenUnder6 = guests.children.age0to6 || 0;
  const numberOfChildrenOver6 = guests.children.age7to17 || 0;

  let total = 0;
  let current = new Date(startDate);

  while (current < endDate) {
    const day = current.getDay();
    const isWeekend = day === 0 || day === 6;
    const price = basePrice * (isWeekend ? 1.5 : 1);
    total += price;

    current.setDate(current.getDate() + 1);
  }

  const isNeedExtraBed =
    numberOfAdults + numberOfChildrenUnder6 + numberOfChildrenOver6 > capacity;

  const handleAddToCart = () => {
    dispatch(
      addRoomToCart({
        id: roomClass.id,
        name: roomClass.name,
        img: roomClass.images[0].url,
        price: basePrice,
        nights: numberOfNights,
        checkIn: startDate.toISOString(),
        checkOut: endDate.toISOString(),
        adults: numberOfAdults,
        childrenUnder6: numberOfChildrenUnder6,
        childrenOver6: numberOfChildrenOver6,
        bedAmount: roomClass.bed.quantity,
        view: roomClass.view,
        isNeedExtraBed,
        hasSaturdayNight,
        hasSundayNight,
        features: roomClass.features?.map((f) => f.feature.name) ?? [],
      })
    );
  };

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
    <>
      <div className="tw-max-w-3xl tw-mx-auto tw-bg-black/70 tw-rounded-3xl tw-p-6 tw-shadow-2xl tw-border tw-border-gray-700 tw-space-y-6">
        {/* Ngày nhận - trả + Khách */}
        <div className="md:tw-flex md:tw-gap-4 md:tw-items-stretch tw-flex-col md:tw-flex-row tw-space-y-4 md:tw-space-y-0 tw-text-center tw-align-center">
          {/* Ngày nhận - trả */}
          <div
            className="tw-bg-white/10 tw-text-white tw-p-1 tw-rounded-lg tw-cursor-pointer hover:tw-bg-white/20 tw-transition-all
            tw-border-gray-700 tw-border tw-min-h-[70px] tw-relative"
            onClick={(e: any) =>
              e.stopPropagation() || // Ngăn sự kiện click lan truyền
              setShowCalendar(!showCalendar)
            }
          >
            <label className="tw-text-white tw-font-semibold">
              Nhận phòng - Trả phòng
            </label>
            <div>
              {dateRange[0]?.startDate?.toLocaleDateString("vi-VN")} -{" "}
              {dateRange[0]?.endDate?.toLocaleDateString("vi-VN")}
            </div>
            {showCalendar && (
              <div ref={calendarRef} className="tw-absolute tw-z-50 tw-mt-2">
                <DateRange
                  editableDateInputs
                  onChange={(item: any) => {
                    setDateRange([item.selection]);
                  }}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                  locale={vi}
                  minDate={new Date()}
                />
              </div>
            )}
          </div>

          {/* Khách */}
          <div
            className="tw-flex-1 tw-relative tw-bg-white/10 tw-text-white tw-p-1 tw-rounded-lg tw-cursor-pointer hover:tw-bg-white/20 tw-transition-all tw-mt-2 tw-border tw-border-gray-700"
            onClick={() => setShowGuestBox(!showGuestBox)}
          >
            <label className="tw-text-white tw-font-semibold">Khách</label>
            <div>
              {guests.adults} khách
              {guests.children.age0to6 + guests.children.age7to17 > 0 &&
                `, ${
                  guests.children.age0to6 + guests.children.age7to17
                } trẻ em`}
            </div>
            {showGuestBox && (
              <div
                ref={guestBoxRef}
                className="tw-absolute tw-top-full tw-mt-2 tw-bg-white tw-rounded-xl tw-shadow-lg tw-p-4 tw-z-40 tw-w-full tw-text-black tw-text-left tw-w-[300px] tw-border tw-border-gray-300"
              >
                {/* Người lớn */}
                <div className="tw-flex tw-justify-between tw-items-center tw-mb-3">
                  <div>
                    <p className="tw-font-semibold tw-mb-0">Người lớn</p>
                    <p className="tw-text-sm tw-text-gray-500">
                      Từ 18 tuổi trở lên
                    </p>
                  </div>
                  <div className="tw-flex tw-items-center tw-gap-2">
                    <button
                      className="tw-btn tw-border  tw-rounded-md tw-px-2 tw-py-1 tw-border-gray-400"
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
                      className="tw-btn tw-btn-sm tw-border tw-rounded-md tw-px-2 tw-py-1 tw-border-gray-400"
                      disabled={totalGuests >= 10}
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

                {/* Trẻ 7–17 */}
                <div className="tw-flex tw-justify-between tw-items-center tw-mb-3">
                  <div>
                    <p className="tw-font-semibold tw-mb-0">Trẻ em</p>
                    <p className="tw-text-sm tw-text-gray-500">7–17 tuổi</p>
                  </div>
                  <div className="tw-flex tw-items-center tw-gap-2">
                    <button
                      className="tw-btn tw-btn-sm tw-border tw-rounded-md tw-px-2 tw-py-1 tw-border-gray-400"
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
                      className="tw-btn tw-btn-sm tw-border tw-rounded-md tw-px-2 tw-py-1 tw-border-gray-400"
                      disabled={totalGuests >= 10}
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

                {/* Trẻ 0–6 */}
                <div className="tw-flex tw-justify-between tw-items-center">
                  <div>
                    <p className="tw-font-semibold tw-mb-0">Trẻ em</p>
                    <p className="tw-text-sm tw-text-gray-500">0–6 tuổi</p>
                  </div>
                  <div className="tw-flex tw-items-center tw-gap-2">
                    <button
                      className="tw-btn tw-btn-sm tw-border tw-rounded-md tw-px-2 tw-py-1 tw-border-gray-400"
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
                      className="tw-btn tw-btn-sm tw-border tw-rounded-md tw-px-2 tw-py-1 tw-border-gray-400"
                      disabled={totalGuests >= 10}
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
        </div>
        <div className="tw-text-primary tw-text-center tw-pt-2">
          Tổng tiền: <strong>{formatCurrencyVN(total)}</strong>
        </div>
        {/* Nút hành động */}
        <div
          className="tw-flex tw-gap-3 tw-w-full"
          style={{ marginTop: "10px" }}
        >
          <AnimatedButton
            className="tw-px-4 tw-py-3 tw-flex-1"
            onClick={handleSearch}
          >
            Xác nhận
          </AnimatedButton>
          <AnimatedButtonPrimary
            className="tw-px-4 tw-py-3 tw-flex-1"
            onClick={(e) => {
              e.stopPropagation(); // Ngăn sự kiện click lan truyền
              handleAddToCart();
            }}
          >
            Thêm vào giỏ hàng
          </AnimatedButtonPrimary>
        </div>
      </div>
    </>
  );
}
