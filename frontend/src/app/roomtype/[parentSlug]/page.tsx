"use client"
import { useParams } from 'next/navigation';
import { RoomClassList } from '../../components/roomList';
import React from "react";
import { useRoomSearch } from '../../hooks/useRoomSearch';
import RoomSearchBar from '@/app/components/roomSearchBar';
import { useData } from '@/app/hooks/useData';

export default function Roomclass() {
    const {
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
    } = useRoomSearch();
    const { 
        roomclass 
    } = useData();

    // Sử dụng useParams để lấy parentSlug từ URL
    const params = useParams();
    const parentSlug = params.parentSlug as string;

    // Lọc roomclass theo parentSlug
    const filteredRoomClass = roomclass
        .filter(item => item.main_room_class_id === parentSlug)
        .filter(item =>
            item.price >= price &&
            (views.length === 0 || views.includes(item.view)) &&
            (amenities.length === 0 || amenities.every(am => item.features[0]?.feature_id.name.includes(am)))
        );

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
                    <RoomSearchBar
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        guests={guests}
                        setGuests={setGuests}
                        beds={beds}
                        setBeds={setBeds}
                        showCalendar={showCalendar}
                        setShowCalendar={setShowCalendar}
                        showGuestBox={showGuestBox}
                        setShowGuestBox={setShowGuestBox}
                        showBedBox={showBedBox}
                        setShowBedBox={setShowBedBox}
                        guestBoxRef={guestBoxRef}
                        calendarRef={calendarRef}
                        bedRef={bedRef}
                    />
                </div>
                <div className="row">
                    <div className='col-3 border-end border-top h-auto'>
                        <div className='sticky-top' style={{ top: '13%' }}>
                            <div className=" mt-3 mb-4" style={{ color: '#FAB320' }}>
                                <p className='fs-5' style={{ letterSpacing: '3px' }}>
                                    Loại phòng {filteredRoomClass[0]?.main_room_class?.[0]?.name || "Đang tải..."}
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
                                        value="sea"
                                        id="viewSea"
                                        checked={views.includes("sea")}
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
                                        value="city"
                                        id="viewCity"
                                        checked={views.includes("city")}
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