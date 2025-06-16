'use client';
import { useState, useRef } from "react";

export function useRoomSearch() {
    const [maxGuests, setMaxGuests] = useState(8);
    const [price, setPrice] = useState(500000);
    const [views, setViews] = useState<string[]>([]);
    const [amenities, setAmenities] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState([{ startDate: new Date(), endDate: new Date(), key: 'selection' }]);
    const [guests, setGuests] = useState({ adults: 1, children: { age0to6: 0, age7to17: 0, } });
    const [pendingGuests, setPendingGuests] = useState(guests);
    const [pendingDateRange, setPendingDateRange] = useState<DateRange | null>(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showGuestBox, setShowGuestBox] = useState(false);
    const guestBoxRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const [numberOfNights, setNumberOfNights] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [hasSearched, setHasSearched] = useState(false);
    const numberOfAdults = guests.adults;
    const numberOfChildren = guests.children.age0to6 + guests.children.age7to17;
    const totalGuests = guests.adults + guests.children.age0to6 + guests.children.age7to17;
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    // Tính số khách thực tế
    // const numAdults = numberOfAdults;
    // const numChildrenUnder6 = guests.children.age0to6;
    // const numChildrenOver6 = guests.children.age7to17;
    // const totalEffectiveGuests = numAdults + numChildrenOver6;


    return {
        price, setPrice,
        views, setViews,
        amenities, setAmenities,
        dateRange, setDateRange,
        guests, setGuests,
        showCalendar, setShowCalendar,
        showGuestBox, setShowGuestBox,
        guestBoxRef, calendarRef,
        maxGuests, setMaxGuests,
        totalGuests,
        numberOfNights, setNumberOfNights,
        totalPrice, setTotalPrice,
        hasSearched, setHasSearched,
        numberOfAdults,
        numberOfChildren,
        pendingGuests, setPendingGuests,
        pendingDateRange, setPendingDateRange,
        startDate, setStartDate,
        endDate, setEndDate,
        // numAdults,
        // numChildrenUnder6,
        // numChildrenOver6,
        // totalEffectiveGuests
    };
}