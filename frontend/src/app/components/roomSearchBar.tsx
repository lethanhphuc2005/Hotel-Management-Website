'use client';
import { DateRange } from 'react-date-range';
import { vi } from 'date-fns/locale';
import style from '../../app/roomtype/[parentSlug]/rcChild.module.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useEffect } from 'react';

interface RoomSearchBarProps {
    dateRange: any;
    setDateRange: (range: any) => void;
    guests: { adults: number; children: number };
    setGuests: React.Dispatch<React.SetStateAction<{ adults: number; children: number }>>;
    beds: number;
    setBeds: React.Dispatch<React.SetStateAction<(number)>>;
    showCalendar: boolean;
    setShowCalendar: (show: boolean) => void;
    showGuestBox: boolean;
    setShowGuestBox: (show: boolean) => void;
    showBedBox: boolean;
    setShowBedBox: (show: boolean) => void;
    guestBoxRef: React.RefObject<HTMLDivElement | null>;
    calendarRef: React.RefObject<HTMLDivElement | null>;
    bedRef: React.RefObject<HTMLDivElement | null>;
}

export default function RoomSearchBar(props: RoomSearchBarProps) {
    const {
        dateRange, setDateRange,
        guests, setGuests,
        beds, setBeds,
        showCalendar, setShowCalendar,
        showGuestBox, setShowGuestBox,
        showBedBox, setShowBedBox,
        guestBoxRef, calendarRef, bedRef
    } = props;

    // Đóng popup khi click ra ngoài
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
            if (
                showBedBox &&
                bedRef.current &&
                !bedRef.current.contains(event.target as Node)
            ) {
                setShowBedBox(false);
            }
        }
        if (showGuestBox || showCalendar || showBedBox) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showGuestBox, showCalendar, showBedBox]);
    return (
        <>

                <div className="col">
                    <div className="bg-black border mx-auto rounded-5 d-flex align-items-center justify-content-center mb-4" style={{ position: 'relative', width: '725px' }}>
                        <div className={`px-5 ${style.calendarHover}`} style={{ position: 'relative' }}>
                            <div
                                style={{ cursor: 'pointer' }}
                                onClick={() => setShowCalendar(!showCalendar)}
                            >
                                <label className="small mb-1 text-white fw-bold" style={{ cursor: 'pointer' }}>
                                    Nhận phòng - Trả phòng
                                </label>
                                <div>
                                    {dateRange[0].startDate.toLocaleDateString('vi-VN')} - {dateRange[0].endDate.toLocaleDateString('vi-VN')}
                                </div>
                            </div>
                            {showCalendar && (
                                <div
                                    ref={calendarRef}
                                    style={{ position: 'absolute', zIndex: 1050, top: '80px', left: 0 }}>
                                    <DateRange
                                        editableDateInputs={true}
                                        onChange={(item: any) => setDateRange([item.selection])}
                                        moveRangeOnFirstSelection={false}
                                        ranges={dateRange}
                                        locale={vi}
                                        minDate={new Date()}
                                    />
                                </div>
                            )}
                        </div>
                        <div style={{ width: 1, height: 48, background: 'white', opacity: 0.7 }} />
                        {/* Khách */}
                        <div className={`${style.calendarHover}`} style={{ position: "relative" }}>
                            <div
                                className="form-control border-0 p-0 bg-transparent text-center text-white"
                                style={{ minWidth: 150, cursor: "pointer", background: "transparent" }}
                                onClick={() => setShowGuestBox(!showGuestBox)}
                            >
                                <label className="small mb-1 fw-bold">Khách</label>
                                <div>
                                    {guests.adults} khách
                                    {guests.children > 0 && `, ${guests.children} trẻ em`}
                                </div>
                            </div>
                            {showGuestBox && (
                                <div
                                    ref={guestBoxRef}
                                    className="bg-white text-dark rounded-4 shadow p-3"
                                    style={{
                                        position: "absolute",
                                        zIndex: 20,
                                        top: "110%",
                                        left: 0,
                                        minWidth: 300,
                                        minHeight: 120,
                                    }}
                                >
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div>
                                            <div className="fw-bold">Người lớn</div>
                                            <div className="small text-secondary">Từ 18 tuổi trở lên</div>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                disabled={guests.adults <= 1}
                                                onClick={() => setGuests(g => ({ ...g, adults: Math.max(1, g.adults - 1) }))}
                                            >-</button>
                                            <span>{guests.adults}</span>
                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={() => setGuests(g => ({ ...g, adults: g.adults + 1 }))}
                                            >+</button>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div>
                                            <div className="fw-bold">Trẻ em</div>
                                            <div className="small text-secondary">0 – 17 tuổi</div>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                disabled={guests.children <= 0}
                                                onClick={() => setGuests(g => ({ ...g, children: Math.max(0, g.children - 1) }))}
                                            >-</button>
                                            <span>{guests.children}</span>
                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={() => setGuests(g => ({ ...g, children: g.children + 1 }))}
                                            >+</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Giường */}
                        <div style={{ width: 1, height: 48, background: 'white', opacity: 0.7 }} />
                        <div className={`${style.calendarHover} d-flex flex-column align-items-center justify-content-center`} style={{ position: "relative", minWidth: 120, cursor: "pointer" }}>
                            <div
                                className="w-100 text-center"
                                onClick={() => setShowBedBox(!showBedBox)}
                            >
                                <label className="small mb-1 fw-bold">Số giường</label>
                                <div>{beds}</div>
                            </div>
                            {showBedBox && (
                                <div
                                    ref={bedRef}
                                    className="bg-white text-dark rounded-4 shadow p-3"
                                    style={{
                                        position: "absolute",
                                        zIndex: 20,
                                        top: "110%",
                                        left: 0,
                                        minWidth: 180,
                                        minHeight: 50,
                                    }}
                                >
                                    <div className="d-flex align-items-center justify-content-between">
                                        <button
                                            className="btn btn-outline-secondary btn-sm"
                                            disabled={beds <= 1}
                                            onClick={() => setBeds(b => Math.max(1, b - 1))}
                                        >-</button>
                                        <span className="fw-bold">{beds}</span>
                                        <button
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() => setBeds(b => b + 1)}
                                        >+</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div style={{ width: 1, height: 48, background: 'white', opacity: 0.7 }} />
                        <button className="rounded-pill px-4 ms-auto me-3 border-0 text-black" style={{ backgroundColor: "#FAB320", height: '40px' }} type="button">
                            <i className="bi bi-search"></i> Tìm kiếm
                        </button>
                    </div>
                </div>
        </>
    );
}