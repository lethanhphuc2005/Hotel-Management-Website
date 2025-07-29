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
    extraFee = 0, // Default value for extra fee
  } = props;

  const dispatch = useDispatch();
  const cartRooms = useSelector((state: RootState) => state?.cart.rooms);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const basePrice =
    (roomClass.price_discount ?? 0) > 0
      ? roomClass.price_discount ?? 0
      : roomClass.price;

  const startDate = dateRange[0]?.startDate;
  const endDate = dateRange[0]?.endDate;

  const handleAddToCart = () => {
    if (!hasSearched || !startDate || !endDate) {
      toast.error(
        "Vui lòng chọn ngày nhận và trả phòng trước khi thêm vào giỏ hàng!"
      );
      return;
    }

    const checkInISO = startDate.toISOString();
    const checkOutISO = endDate.toISOString();

    const isDuplicate = cartRooms.some(
      (room) =>
        room.name.includes(roomClass.name) &&
        room.view === roomClass.view &&
        room.checkIn === checkInISO &&
        room.checkOut === checkOutISO
    );

    if (isDuplicate) {
      toast.error("Phòng này bạn đã thêm vào giỏ hàng rồi!");
      return;
    }

    if (cartRooms.length > 0) {
      const firstRoom = cartRooms[0];
      if (
        firstRoom.checkIn !== checkInISO ||
        firstRoom.checkOut !== checkOutISO
      ) {
        toast.error(
          "Bạn chỉ có thể thêm phòng có cùng ngày nhận và trả phòng!"
        );
        return;
      }
    }

    const current = new Date(startDate!);
    let hasSaturday = false;
    let hasSunday = false;
    while (current < endDate!) {
      if (current.getDay() === 6) hasSaturday = true;
      if (current.getDay() === 0) hasSunday = true;
      current.setDate(current.getDate() + 1);
    }
    dispatch(
      addRoomToCart({
        id: roomClass.id,
        name: roomClass.name,
        img: roomClass.images[0].url,
        desc: `${guests.adults} người lớn${
          guests.children.age0to6 > 0
            ? `, ${guests.children.age0to6} trẻ 0–6 tuổi`
            : ""
        }${
          guests.children.age7to17 > 0
            ? `, ${guests.children.age7to17} trẻ 7–17 tuổi`
            : ""
        }, ${roomClass.bed_amount} giường đôi`,
        extra_fee: extraFee,
        price: basePrice,
        nights: numberOfNights,
        checkIn: checkInISO,
        checkOut: checkOutISO,
        adults: guests.adults,
        childrenUnder6: guests.children.age0to6,
        childrenOver6: guests.children.age7to17,
        bedAmount: roomClass.bed_amount,
        view: roomClass.view,
        total: totalPrice,
        hasSaturdayNight: hasSaturday,
        hasSundayNight: hasSunday,
        features: roomClass?.features?.map((f) => f.feature.name) ?? [],
      })
    );
    toast.success("Đã thêm phòng vào giỏ hàng!");
  };

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
          Tổng tiền: <strong>{formatCurrencyVN(totalPrice)}</strong>
        </div>
        {/* Nút hành động */}
        <div
          className="tw-flex tw-gap-3 tw-w-full"
          style={{ marginTop: "10px" }}
        >
          <AnimatedButton
            className="tw-px-4 tw-py-3 tw-flex-1"
            onClick={handleSearchClick}
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
