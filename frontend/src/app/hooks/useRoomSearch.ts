'use client';
import { useState, useRef } from "react";

export function useRoomSearch() {
    const [price, setPrice] = useState(500000);
    const [views, setViews] = useState<string[]>([]);
    const [amenities, setAmenities] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState([{ startDate: new Date(), endDate: new Date(), key: 'selection' }]);
    const [guests, setGuests] = useState({ adults: 1, children: 0 });
    const [beds, setBeds] = useState(1);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showGuestBox, setShowGuestBox] = useState(false);
    const [showBedBox, setShowBedBox] = useState(false);
    const guestBoxRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const bedRef = useRef<HTMLDivElement>(null);

    return {
        price, setPrice,
        views, setViews,
        amenities, setAmenities,
        dateRange, setDateRange,
        guests, setGuests,
        beds, setBeds,
        showCalendar, setShowCalendar,
        showGuestBox, setShowGuestBox,
        showBedBox, setShowBedBox,
        guestBoxRef, calendarRef, bedRef
    };
}