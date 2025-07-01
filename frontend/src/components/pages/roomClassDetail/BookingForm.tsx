"use client";
import { useState, useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import { vi } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { AnimatedButtonPrimary, AnimatedButton } from "@/components/common/Button";

export default function RoomBookingBox() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [guests, setGuests] = useState({
    adults: 1,
    children17: 0,
    children6: 0,
  });

  // Auto-close calendar & guest box
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        setShowCalendar(false);
      }
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) {
        setShowGuests(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalGuests = guests.adults + guests.children17 + guests.children6;
  const totalChildren = guests.children17 + guests.children6;

  return (
    <div className="tw-border tw-rounded-xl tw-p-4 tw-bg-black tw-text-white tw-w-full md:tw-w-[340px] tw-relative tw-text-center">
      {/* Form */}
      <div className="tw-bg-[#0a0a0a] tw-rounded-xl tw-p-4 tw-mb-4 tw-border tw-border-white/30">
        {/* Date Inputs */}
        <div className="tw-grid tw-grid-cols-2 tw-gap-2 tw-mb-2">
          <div
            onClick={() => setShowCalendar(!showCalendar)}
            className="tw-cursor-pointer hover:tw-text-primary tw-transition"
          >
            <label className="tw-text-sm tw-font-bold">NHẬN PHÒNG</label>
            <div className="tw-text-sm tw-mt-1">
              {dateRange[0].startDate.toLocaleDateString("vi-VN")}
            </div>
          </div>
          <div
            onClick={() => setShowCalendar(!showCalendar)}
            className="tw-cursor-pointer hover:tw-text-primary tw-transition"
          >
            <label className="tw-text-sm tw-font-bold">TRẢ PHÒNG</label>
            <div className="tw-text-sm tw-mt-1">
              {dateRange[0].endDate.toLocaleDateString("vi-VN")}
            </div>
          </div>
        </div>

        {/* Calendar */}
        {showCalendar && (
          <div
            ref={calendarRef}
            className="tw-absolute tw-z-50 tw-top-[160px] tw-left-0"
          >
            <DateRange
              ranges={dateRange}
              onChange={(item: any) => setDateRange([item.selection])}
              locale={vi}
              moveRangeOnFirstSelection={false}
              minDate={new Date()}
            />
          </div>
        )}

        {/* Guest */}
        <div
          className="tw-mt-2 tw-border-t tw-pt-2 tw-cursor-pointer tw-flex tw-flex-col tw-items-center tw-gap-1 hover:tw-text-primary tw-transition"
          onClick={() => setShowGuests(!showGuests)}
        >
          <label className="tw-text-sm tw-font-bold">KHÁCH</label>
          <div className="tw-text-sm tw-mt-1">
            {totalGuests} khách
            {totalGuests > 0 && (
              <span className="tw-text-gray-400 tw-ml-1">
                ({guests.adults} người lớn, {totalChildren} trẻ em)
              </span>
            )}
          </div>
        </div>

        {/* Guest Box */}
        {showGuests && (
          <div
            ref={guestRef}
            className="tw-absolute tw-z-50 tw-left-0 tw-w-full tw-bg-white tw-text-black tw-rounded-xl tw-shadow-md tw-mt-2 tw-p-4"
          >
            {[
              { label: "Người lớn", desc: "Từ 18 tuổi", key: "adults" },
              { label: "Trẻ em", desc: "7 – 17 tuổi", key: "children17" },
              { label: "Trẻ em", desc: "0 – 6 tuổi", key: "children6" },
            ].map((item) => (
              <div
                key={item.key}
                className="tw-flex tw-justify-between tw-items-center tw-mb-2"
              >
                <div>
                  <div className="tw-font-semibold">{item.label}</div>
                  <div className="tw-text-sm tw-text-gray-500">{item.desc}</div>
                </div>
                <div className="tw-flex tw-items-center tw-gap-2">
                  <button
                    className="tw-border tw-rounded-full tw-px-2 tw-py-1"
                    onClick={() =>
                      setGuests((g) => ({
                        ...g,
                        [item.key]: Math.max(
                          0,
                          g[item.key as keyof typeof g] - 1
                        ),
                      }))
                    }
                  >
                    −
                  </button>
                  <span>{guests[item.key as keyof typeof guests]}</span>
                  <button
                    className="tw-border tw-rounded-full tw-px-2 tw-py-1"
                    onClick={() =>
                      setGuests((g) => ({
                        ...g,
                        [item.key]: g[item.key as keyof typeof g] + 1,
                      }))
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Button */}
      <div className="tw-flex tw-justify-between tw-gap-2">
        <AnimatedButtonPrimary
          className="tw-px-5 tw-py-2"
          onClick={() => alert("Đặt phòng")}
        >
          Đặt ngay
        </AnimatedButtonPrimary>
        <AnimatedButton
          className="tw-px-5 tw-py-2"
          onClick={() => alert("Thêm vào giỏ hàng")}
        >
          Thêm vào giỏ hàng
        </AnimatedButton>
      </div>
    </div>
  );
}
