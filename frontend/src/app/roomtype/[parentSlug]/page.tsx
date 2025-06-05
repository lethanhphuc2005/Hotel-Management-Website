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
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showGuestBox, setShowGuestBox] = useState(false);
    const [guests, setGuests] = useState({
        adults: 1,
        children: 0, // Trẻ em 0-17 tuổi
    });
    const params = useParams();
    const parentSlug = params.parentSlug as string;

    // const childRoomTypes = roomtypes[0]?.DanhSachLoaiPhong || [];
    // const images = roomtypes[0]?.HinhAnh || [];

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

    // Đóng popup khi click ra ngoài
    const guestBoxRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
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
        }
        if (showGuestBox || showCalendar) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showGuestBox, showCalendar]);

    return (
        <>
            <div className={`container text-white`} style={{ height: '1750px', marginTop: '7%', marginBottom: '10%' }}>
                <div className="row">
                    <div className="col">
                        <div className="bg-black border w-75 mx-auto rounded-4 d-flex align-items-center justify-content-center p-3 mb-4" style={{ gap: 50, position: 'relative' }}>
                            <div className="px-3 border-end" style={{ position: 'relative' }}>
                                <label className="text-secondary small mb-1 text-white">Nhận phòng / Trả phòng</label>
                                <div
                                    className={`form-control border-0 p-0 ${style.calendarHover}`}
                                    style={{ minWidth: 200, cursor: 'pointer' }}
                                    onClick={() => setShowCalendar(!showCalendar)}
                                >
                                    {dateRange[0].startDate.toLocaleDateString('vi-VN')} - {dateRange[0].endDate.toLocaleDateString('vi-VN')}
                                </div>
                                {showCalendar && (
                                    <div
                                        ref={calendarRef}
                                        style={{ position: 'absolute', zIndex: 1050, top: '100%', left: 0 }}>
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
                            {/* Khách */}
                            <div className="px-3" style={{ position: "relative" }}>
                                <label className="text-secondary small mb-1 text-white">Khách</label>
                                <div
                                    className="form-control border-0 p-0 bg-transparent text-white"
                                    style={{ minWidth: 150, cursor: "pointer" }}
                                    onClick={() => setShowGuestBox(!showGuestBox)}
                                >
                                    {guests.adults} khách
                                    {guests.children > 0 && `, ${guests.children} trẻ em`}
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
                            {/* End Khách */}
                            <button className="btn rounded-pill px-5 fw-bold ms-auto" style={{ backgroundColor: "#FAB320" }} type="button">
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