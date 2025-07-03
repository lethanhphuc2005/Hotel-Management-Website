"use client";
import { useState, useRef, useEffect } from "react";

type DateRange = {
  startDate: Date;
  endDate: Date;
  key: string;
};

export function useRoomSearch() {
  const [maxGuests, setMaxGuests] = useState(20);
  const [price, setPrice] = useState(500000);
  const [dateRange, setDateRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const [guests, setGuests] = useState({
    adults: 1,
    children: { age0to6: 0, age7to17: 0 },
  });

  const [pendingGuests, setPendingGuests] = useState(guests);
  const [pendingDateRange, setPendingDateRange] = useState<DateRange | null>(
    null
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuestBox, setShowGuestBox] = useState(false);
  const guestBoxRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const numberOfAdults = guests.adults;
  const numberOfChildren = guests.children.age0to6 + guests.children.age7to17;
  const totalGuests = numberOfAdults + numberOfChildren;
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showDateError, setShowDateError] = useState(false);

  function saveSearchToLocalStorage() {
    const searchData = {
      dateRange,
      guests,
      price,
      maxGuests,
    };
    localStorage.setItem("lastRoomSearch", JSON.stringify(searchData));
  }

  function handleSearch() {
    setHasSearched(true);
    saveSearchToLocalStorage();
  }
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      let totalNights = 0;
      let totalBasePrice = 0;
      const current = new Date(start);

      while (current < end) {
        totalBasePrice +=
          current.getDay() === 0 || current.getDay() === 6
            ? price * 1.5
            : price;
        totalNights++;
        current.setDate(current.getDate() + 1);
      }

      const extraFee = guests?.children?.age7to17
        ? guests.children.age7to17 * totalNights * 100000
        : 0;

      setNumberOfNights(totalNights);
      setTotalPrice(totalBasePrice + extraFee);
    } else {
      setNumberOfNights(0);
      setTotalPrice(0);
    }
  }, [startDate, endDate, guests, price]);

  return {
    price,
    setPrice,
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
    setMaxGuests,
    totalGuests,
    numberOfNights,
    setNumberOfNights,
    totalPrice,
    setTotalPrice,
    hasSearched,
    setHasSearched,
    numberOfAdults,
    numberOfChildren,
    pendingGuests,
    setPendingGuests,
    pendingDateRange,
    setPendingDateRange,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    showDateError,
    setShowDateError,
    handleSearch,
  };
}
