"use client";

import { useState, useRef, useMemo } from "react";
import { DateRange, GuestCount, RoomSearchBarProps } from "@/types/_common";

export function useRoomSearch(): RoomSearchBarProps {
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const [dateRange, setDateRange] = useState<DateRange[]>([
    { startDate: today, endDate: today, key: "selection" },
  ]);

  const [guests, setGuests] = useState<GuestCount>({
    adults: 1,
    children: { age0to6: 0, age7to17: 0 },
  });

  const [price, setPrice] = useState<number>(10000000);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showGuestBox, setShowGuestBox] = useState<boolean>(false);

  const guestBoxRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const startDate = dateRange[0]?.startDate ?? today;
  const endDate = dateRange[0]?.endDate ?? today;

  const numberOfAdults = guests.adults;
  const numberOfChildren = guests.children.age0to6 + guests.children.age7to17;
  const totalGuests = numberOfAdults + numberOfChildren;

  const { numberOfNights, totalPrice } = useMemo(() => {
    let nights = 0;
    let total = 0;
    const current = new Date(startDate);
    while (current < endDate) {
      total +=
        current.getDay() === 0 || current.getDay() === 6 ? price * 1.5 : price;
      nights++;
      current.setDate(current.getDate() + 1);
    }

    const extraFee = guests.children.age7to17 * nights * 100000;

    return {
      numberOfNights: nights,
      totalPrice: total + extraFee,
    };
  }, [startDate, endDate, guests, price]);

  const handleSearch = () => {
    setHasSearched(true);
    const searchData = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      guests,
    };
    localStorage.setItem("lastRoomSearch", JSON.stringify(searchData));
  };

  return {
    dateRange,
    setDateRange,
    guests,
    setGuests,
    price,
    setPrice,
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
    totalPrice,
    hasSearched,
    setHasSearched,
    handleSearch,
  };
}
