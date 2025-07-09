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
import { RoomClass } from "@/types/roomClass";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/contexts/store";
import { addRoomToCart } from "@/contexts/cartSlice";

interface RoomBookingBoxProps {
  roomClass: RoomClass;
  images: any[];
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
  handleSearch?: () => void;
  price: number;
  setPrice?: React.Dispatch<React.SetStateAction<number>>;
}

export default function RoomBookingBox(props: RoomBookingBoxProps) {
  const {
    roomClass,
    images,
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
    numberOfAdults,
    numberOfChildren,
    numChildrenUnder6,
    numChildrenOver6,
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

  const dispatch = useDispatch();
  const adults = numberOfAdults ?? 1;
  const childrenUnder6 = numChildrenUnder6 ?? 0;
  const childrenOver6 = numChildrenOver6 ?? 0;
  const cartRooms = useSelector((state: RootState) => state?.cart.rooms);

  const basePrice =
    (roomClass.price_discount ?? 0) > 0
      ? roomClass.price_discount ?? 0
      : roomClass.price;

  const checkInISO = startDate?.toLocaleDateString("vi-VN") || "";
  const checkOutISO = endDate?.toLocaleDateString("vi-VN") || "";

  const handleAddToCart = () => {
    if (!hasSearched || !startDate || !endDate) {
      toast.error(
        "Vui lòng chọn ngày nhận và trả phòng trước khi thêm vào giỏ hàng!"
      );
      return;
    }

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
        img: images?.[0]?.url || "",
        desc: `${adults} người lớn${
          childrenUnder6 > 0 ? `, ${childrenUnder6} trẻ 0–6 tuổi` : ""
        }${childrenOver6 > 0 ? `, ${childrenOver6} trẻ 7–17 tuổi` : ""}, ${
          roomClass.bed_amount
        } giường đôi`,
        price: basePrice,
        nights: numberOfNights,
        checkIn: checkInISO,
        checkOut: checkOutISO,
        adults,
        childrenUnder6,
        childrenOver6,
        bedAmount: roomClass.bed_amount,
        view: roomClass.view,
        total: totalPrice,
        hasSaturdayNight: hasSaturday,
        hasSundayNight: hasSunday,
        features: roomClass?.features?.map((f) => f.feature_id.name) ?? [],
      })
    );
    toast.success("Đã thêm phòng vào giỏ hàng!");
  };

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
    };

    if (showGuestBox || showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showGuestBox, showCalendar]);

  // Lấy dữ liệu từ localStorage khi component mount
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

        // Cập nhật giá dựa trên số đêm và giá phòng
        setHasSearched(true); // ✅ Chỉ gọi khi dữ liệu hợp lệ
      }
    }
  }, []);

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
              {dateRange[0].startDate.toLocaleDateString("vi-VN")} -{" "}
              {dateRange[0].endDate.toLocaleDateString("vi-VN")}
            </div>
            {showCalendar && (
              <div ref={calendarRef} className="tw-absolute tw-z-50 tw-mt-2">
                <DateRange
                  editableDateInputs
                  onChange={(item: any) => {
                    setPendingDateRange([item.selection]);
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
              {pendingGuests.adults} khách
              {pendingGuests.children.age0to6 +
                pendingGuests.children.age7to17 >
                0 &&
                `, ${
                  pendingGuests.children.age0to6 +
                  pendingGuests.children.age7to17
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
                      disabled={pendingGuests.adults <= 1}
                      onClick={(e: any) =>
                        e.stopPropagation() ||
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
                      className="tw-btn tw-btn-sm tw-border tw-rounded-md tw-px-2 tw-py-1 tw-border-gray-400"
                      disabled={totalGuests >= maxGuests}
                      onClick={(e: any) =>
                        e.stopPropagation() ||
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

                {/* Trẻ 7–17 */}
                <div className="tw-flex tw-justify-between tw-items-center tw-mb-3">
                  <div>
                    <p className="tw-font-semibold tw-mb-0">Trẻ em</p>
                    <p className="tw-text-sm tw-text-gray-500">7–17 tuổi</p>
                  </div>
                  <div className="tw-flex tw-items-center tw-gap-2">
                    <button
                      className="tw-btn tw-btn-sm tw-border tw-rounded-md tw-px-2 tw-py-1 tw-border-gray-400"
                      disabled={pendingGuests.children.age7to17 <= 0}
                      onClick={(e: any) =>
                        e.stopPropagation() ||
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
                      className="tw-btn tw-btn-sm tw-border tw-rounded-md tw-px-2 tw-py-1 tw-border-gray-400"
                      disabled={totalGuests >= maxGuests}
                      onClick={(e: any) =>
                        e.stopPropagation() ||
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

                {/* Trẻ 0–6 */}
                <div className="tw-flex tw-justify-between tw-items-center">
                  <div>
                    <p className="tw-font-semibold tw-mb-0">Trẻ em</p>
                    <p className="tw-text-sm tw-text-gray-500">0–6 tuổi</p>
                  </div>
                  <div className="tw-flex tw-items-center tw-gap-2">
                    <button
                      className="tw-btn tw-btn-sm tw-border tw-rounded-md tw-px-2 tw-py-1 tw-border-gray-400"
                      disabled={pendingGuests.children.age0to6 <= 0}
                      onClick={(e: any) =>
                        e.stopPropagation() ||
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
                      className="tw-btn tw-btn-sm tw-border tw-rounded-md tw-px-2 tw-py-1 tw-border-gray-400"
                      disabled={totalGuests >= maxGuests}
                      onClick={(e: any) =>
                        e.stopPropagation() || // Ngăn sự kiện click lan truyền
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
              if (setPrice) setPrice(price); // Cập nhật giá nếu cần

              // ✅ Lưu vào localStorage
              const savedSearch = {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                guests: pendingGuests,
              };
              localStorage.setItem(
                "lastRoomSearch",
                JSON.stringify(savedSearch)
              );
            }}
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
