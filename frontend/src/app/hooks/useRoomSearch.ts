'use client';
import { useState, useRef } from "react";

export function useRoomSearch() {
    const [maxGuests, setMaxGuests] = useState(8);
    const [price, setPrice] = useState(500000);
    const [views, setViews] = useState<string[]>([]);
    const [amenities, setAmenities] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState([{ startDate: new Date(), endDate: new Date(), key: 'selection' }]);
    const [guests, setGuests] = useState({
        adults: 1, children: {
            age0to6: 0,
            age7to17: 0,
        },
    });
    const [showCalendar, setShowCalendar] = useState(false);
    const [showGuestBox, setShowGuestBox] = useState(false);
    const guestBoxRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const [numberOfNights, setNumberOfNights] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [hasSearched, setHasSearched] = useState(false);

    const totalGuests = guests.adults + guests.children.age0to6 + guests.children.age7to17;

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
        hasSearched, setHasSearched
    };
}