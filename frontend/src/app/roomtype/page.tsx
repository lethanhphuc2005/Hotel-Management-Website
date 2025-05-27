"use client"
import { useEffect, useState } from 'react';
import { RoomTypeList } from '../components/roomList';
import { RoomType } from '../types/roomtype';
import { getRoomTypes } from '../services/roomtypeService';

export default function Roomtype() {
    const [price, setPrice] = useState(500000);
    const [roomtype, setRoomtype] = useState('');
    const [view, setView] = useState('');
    const [amenity, setAmenity] = useState('');
    const [roomtypes, setRoomTypes] = useState<RoomType[]>([]);
    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const res: RoomType[] = await getRoomTypes(`http://localhost:8000/v1/roomtype`);

                setRoomTypes(res);
            } catch (err) {
                console.error('Lỗi khi lấy danh sách phòng:', err);
            }
        };
        fetchRoomTypes();
    }, []);

    const handleChange = (e: any) => {
        setPrice(Number(e.target.value));
    };
    const handleChangeRT = (e: any) => {
        setRoomtype(e.target.value);
    };
    const handleChangeView = (e: any) => {
        setView(e.target.value);
    };
    const handleChangeAmenity = (e: any) => {
        setAmenity(e.target.value);
    };
    return (
        <>
            <div className={`container text-white`} style={{ height: '1750px', marginTop: '7%', marginBottom: '10%' }}>
                <p className='fs-5 fw-bold'>TẤT CẢ LOẠI PHÒNG</p>
                <div className="row">
                    <div className='col-3 border-end border-top h-auto'>
                        <div className='sticky-top' style={{ top: '13%' }}>
                            <p className='mt-3 fw-bold'>LỌC THEO GIÁ</p>
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

                            <p className='mt-3 fw-bold'>LỌC THEO LOẠI PHÒNG</p>
                            <select className="form-select bg-black text-white" value={roomtype} onChange={handleChangeRT}>
                                <option value="">Tất cả loại phòng</option>
                                <option value="Standard">Standard</option>
                                <option value="Deluxe">Deluxe</option>
                                <option value="Suite">Suite</option>
                            </select>
                            <p className="mt-2">
                                {roomtype ? `Đang lọc: ${roomtype}` : 'Hiển thị tất cả'}
                            </p>


                            <p className='mt-3 fw-bold'>LỌC THEO VIEW</p>
                            <select className="form-select bg-black text-white" value={view} onChange={handleChangeView}>
                                <option value="">Tất cả view</option>
                                <option value="Sea">Sea</option>
                                <option value="City">City</option>
                            </select>
                            <p className="mt-2">
                                {view ? `Đang lọc: ${view}` : 'Hiển thị tất cả'}
                            </p>

                            <p className="mt-3 fw-bold">LỌC THEO TIỆN NGHI</p>
                            <select className="form-select bg-black text-white" value={amenity} onChange={handleChangeAmenity}>
                                <option value="">Tất cả tiện nghi</option>
                                <option value="Ban công">Ban công</option>
                                <option value="Bồn tắm">Bồn tắm</option>
                            </select>

                            <p className="mt-2">
                                {amenity ? `Đang lọc: ${amenity}` : 'Hiển thị tất cả'}
                            </p>

                            <button className='w-100 border-0 text-black' style={{ background: '#FAB320', height: '40px' }}>Lọc</button>
                        </div>
                    </div>
                    <div className="col-9 border-top">
                        <div className='row p-3 gap-3'>
                            <RoomTypeList roomtypes={roomtypes} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}