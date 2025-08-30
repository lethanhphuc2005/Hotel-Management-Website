"use client";

import { useState, useRef, useMemo } from "react";
import { toast } from "react-toastify";
import type {
  DateRange,
  GuestCount,
  RoomSearchBarProps,
} from "@/types/_common";
import { usePathname, useRouter } from "next/navigation";

export function useRoomSearch(): RoomSearchBarProps {
  const router = useRouter();
  const pathname = usePathname();
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // 🔄 States
  const [pendingDateRange, setPendingDateRange] = useState<DateRange[]>([
    { startDate: today, endDate: today, key: "selection" },
  ]);
  const [dateRange, setDateRange] = useState<DateRange[]>([
    { startDate: today, endDate: today, key: "selection" },
  ]);
  const [pendingGuests, setPendingGuests] = useState<GuestCount>({
    adults: 1,
    children: { age0to6: 0, age7to17: 0 },
  });
  const [guests, setGuests] = useState<GuestCount>({
    adults: 1,
    children: { age0to6: 0, age7to17: 0 },
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuestBox, setShowGuestBox] = useState(false);

  // 🔗 Refs
  const guestBoxRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // 📅 Dates
  const pendingStartDate = pendingDateRange[0]?.startDate ?? today;
  const pendingEndDate = pendingDateRange[0]?.endDate ?? today;
  const startDate = dateRange[0]?.startDate ?? today;
  const endDate = dateRange[0]?.endDate ?? today;

  // 👥 Guests
  const numberOfAdults = guests.adults;
  const numberOfChildren =
    (guests.children.age0to6 ?? 0) + (guests.children.age7to17 ?? 0);
  const numberOfChildren06 = guests.children.age0to6 ?? 0;
  const numberOfChildren717 = guests.children.age7to17 ?? 0;
  const totalGuests = numberOfAdults + numberOfChildren;

  const { numberOfNights, capacity, hasSaturdayNight, hasSundayNight } =
    useMemo(() => {
      let nights = 0;
      let hasSat = false;
      let hasSun = false;

      const adjustedChildren06 = Math.max(numberOfChildren06 - 1, 0); // 1 trẻ nhỏ được miễn
      const adjustedChildren717 = Math.max(numberOfChildren717 - 1, 0); // 1 trẻ lớn được miễn nếu có người lớn

      const capacity = Math.ceil(
        numberOfAdults + adjustedChildren06 * 0.5 + adjustedChildren717 * 0.75
      );

      const current = new Date(startDate);

      while (current < endDate) {
        const day = current.getDay();
        if (day === 6) hasSat = true;
        if (day === 0) hasSun = true;
        nights++;
        current.setDate(current.getDate() + 1);
      }

      return {
        numberOfNights: nights,
        capacity,
        hasSaturdayNight: hasSat,
        hasSundayNight: hasSun,
      };
    }, [
      startDate,
      endDate,
      numberOfAdults,
      numberOfChildren06,
      numberOfChildren717,
    ]);

  // ✅ Tìm kiếm phòng
  const handleSearch = () => {
    if (!pendingStartDate || !pendingEndDate) {
      toast.info("Vui lòng chọn ngày nhận và trả phòng!");
      return;
    }
    if (pendingStartDate > pendingEndDate) {
      toast.info("Ngày nhận phòng không thể sau ngày trả phòng!");
      return;
    }
    if (totalGuests <= 0) {
      toast.info("Vui lòng chọn số lượng khách!");
      return;
    }

    const isStartToday =
      pendingStartDate instanceof Date &&
      new Date(pendingStartDate).setHours(0, 0, 0, 0) === today.getTime();
    const isEndToday =
      pendingEndDate instanceof Date &&
      new Date(pendingEndDate).setHours(0, 0, 0, 0) === today.getTime();

    if (isStartToday && isEndToday) {
      toast.info("Vui lòng chọn ngày nhận và trả phòng không phải hôm nay!");
      return;
    }

    setGuests(pendingGuests);
    setDateRange(pendingDateRange);

    setShowCalendar(false);
    setShowGuestBox(false);
    setHasSearched(true);

    const startISO = pendingStartDate.toISOString();
    const endISO = pendingEndDate.toISOString();
    // ✅ save localStorage
    localStorage.setItem(
      "lastRoomSearch",
      JSON.stringify({
        startDate: startISO,
        endDate: endISO,
        guests: pendingGuests,
      })
    );

    // ✅ build query từ pending* (đúng với localStorage)
    const query = new URLSearchParams({
      start: startISO,
      end: endISO,
      adults: pendingGuests.adults.toString(),
      children6: pendingGuests.children.age0to6.toString(),
      children17: pendingGuests.children.age7to17.toString(),
    });

    toast.success("Tìm phòng thành công!");
    if (pathname === "/") {
      router.push(`/room-class?${query.toString()}`);
    }
  };

  // 🔁 Reset
  const handleResetSearch = () => {
    setShowCalendar(false);
    setShowGuestBox(false);
    setPendingDateRange([
      { startDate: today, endDate: today, key: "selection" },
    ]);
    setDateRange([{ startDate: today, endDate: today, key: "selection" }]);
    setPendingGuests({ adults: 1, children: { age0to6: 0, age7to17: 0 } });
    setGuests({ adults: 1, children: { age0to6: 0, age7to17: 0 } });
    setHasSearched(false);
    setShowCalendar(false);
    setShowGuestBox(false);
    localStorage.removeItem("lastRoomSearch");
    toast.info("Đã đặt lại tìm kiếm phòng");
  };

  return {
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
  };
}
