"use client"
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { RoomClassList } from '../../components/roomList';
import { RoomClass } from '../../types/roomclass';
import { getRoomClass } from '../../services/roomclassService';
import { DateRange } from 'react-date-range';
import { vi } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import React, { useRef } from "react";
import style from './rcChild.module.css';

export default function Roomclass() {
    const [price, setPrice] = useState(500000);
    const [views, setViews] = useState<string[]>([]);
    const [amenities, setAmenities] = useState<string[]>([]);
    const [roomclass, setRoomClass] = useState<RoomClass[]>([]);
    const [dateRange, setDateRange] = useState([{ startDate: new Date(), endDate: new Date(), key: 'selection' }]);
    const [guests, setGuests] = useState({ adults: 1, children: 0 });
    const [beds, setBeds] = useState(1);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showGuestBox, setShowGuestBox] = useState(false);
    const [showBedBox, setShowBedBox] = useState(false);
    const guestBoxRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const bedRef = useRef<HTMLDivElement>(null);
    const params = useParams();
    const parentSlug = params.parentSlug as string;

    const filteredRoomClass = roomclass.filter(item =>
        item.price >= price &&
        (views.length === 0 || views.includes(item.view)) &&
        (amenities.length === 0 || amenities.every(am => item.features[0]?.feature_id.name.includes(am)))
    );

    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const res: RoomClass[] = await getRoomClass(`http://localhost:8000/v1/room-class/user`);
                const roomclass = res.filter(roomclass => roomclass.main_room_class_id === parentSlug);

                setRoomClass(roomclass);
            } catch (err) {
                console.error('Lỗi khi lấy danh sách phòng:', err);
            }
        };
        fetchRoomTypes();
    }, []);

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

    const handleChange = (e: any) => {
        setPrice(Number(e.target.value));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
        const value = e.target.value;
        if (e.target.checked) {
            setState([...state, value]);
        } else {
            setState(state.filter(item => item !== value));
        }
    };

    return (
        <>
            <div className={`container text-white`} style={{ height: '1750px', marginTop: '7%', marginBottom: '10%' }}>
                <div className="row">
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
                </div>
                <div className="row">
                    <div className='col-3 border-end border-top h-auto'>
                        <div className='sticky-top' style={{ top: '13%' }}>
                            <div className=" mt-3 mb-4" style={{ color: '#FAB320' }}>
                                <p className='fs-5' style={{ letterSpacing: '3px' }}>
                                    Loại phòng {roomclass[0]?.main_room_class?.[0]?.name || "Đang tải..."}
                                </p>
                            </div>
                            <p className='mt-3'>LỌC THEO GIÁ</p>
                            <input
                                type="range"
                                min="500000"
                                max="5000000"
                                step="1"
                                value={price}
                                onChange={handleChange}
                                className="w-100"
                            />
                            <p className="mt-2">Giá: {price.toLocaleString('vi-VN')}đ</p>


                            <p className='mt-3'>LỌC THEO VIEW</p>
                            <div className="d-flex gap-3 mb-3">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value="Sea"
                                        id="viewSea"
                                        checked={views.includes("Sea")}
                                        onChange={e => handleCheckboxChange(e, views, setViews)}
                                    />
                                    <label className="form-check-label" htmlFor="viewSea">
                                        Sea
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value="City"
                                        id="viewCity"
                                        checked={views.includes("City")}
                                        onChange={e => handleCheckboxChange(e, views, setViews)}
                                    />
                                    <label className="form-check-label" htmlFor="viewCity">
                                        City
                                    </label>
                                </div>
                            </div>

                            <p className="mt-3">LỌC THEO TIỆN NGHI</p>
                            <div className="d-flex gap-3 mb-3">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value="Ban công"
                                        id="amenityBanCong"
                                        checked={amenities.includes("Ban công")}
                                        onChange={e => handleCheckboxChange(e, amenities, setAmenities)}
                                    />
                                    <label className="form-check-label" htmlFor="amenityBanCong">
                                        Ban công
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value="Bồn tắm"
                                        id="amenityBonTam"
                                        checked={amenities.includes("Bồn tắm")}
                                        onChange={e => handleCheckboxChange(e, amenities, setAmenities)}
                                    />
                                    <label className="form-check-label" htmlFor="amenityBonTam">
                                        Bồn tắm
                                    </label>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="col-9 border-top">
                        <div className='row p-3 gap-3'>
                            <RoomClassList rcl={filteredRoomClass} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}