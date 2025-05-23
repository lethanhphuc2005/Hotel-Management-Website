"use client"
import { useEffect, useState } from 'react';
import {  RoomTypeList } from '../components/roomList';
import { RoomType } from '../types/roomtype';
import { getRoomTypes } from '../services/roomtypeService';

export default function Roomtype() {
    const [price, setPrice] = useState(500000);
    const [floor, setFloor] = useState('');
    const [status, setStatus] = useState('');
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
    const handleChangeFloor = (e: any) => {
        setFloor(e.target.value);
    };
    const handleChangeStatus = (e: any) => {
        setStatus(e.target.value);
    };
    return (
        <>
            <div className={`container text-white`} style={{ height: '1750px', marginTop: '7%', marginBottom: '10%' }}>
                <p className='fs-5 fw-bold'>TẤT CẢ LOẠI PHÒNG</p>
                <div className="row">
                    <div className='col-3 border-end border-top h-auto'>
                        <div className='sticky-top' style={{ top: '13%' }}>
                            <p className='mt-3 fw-bold'>LỌC THEO TẦNG</p>

                            <select className="form-select bg-black text-white" value={floor} onChange={handleChangeFloor}>
                                <option value="">Tất cả các tầng</option>
                                <option value="1">Tầng 1</option>
                                <option value="2">Tầng 2</option>
                                <option value="3">Tầng 3</option>
                                <option value="4">Tầng 4</option>
                            </select>
                            <p className="mt-2">
                                {floor ? `Đang lọc: Tầng ${floor}` : 'Hiển thị tất cả'}
                            </p>

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

                            <p className="mt-3 fw-bold">LỌC THEO TRẠNG THÁI</p>

                            <select className="form-select bg-black text-white" value={status} onChange={handleChangeStatus}>
                                <option value="">Tất cả trạng thái</option>
                                <option value="Còn trống">Còn trống</option>
                                <option value="Đã đặt">Đã đặt</option>
                                <option value="Đang ở">Đang ở</option>
                            </select>

                            <p className="mt-2">
                                {status ? `Đang lọc: ${status}` : 'Hiển thị tất cả'}
                            </p>

                            <button className='w-100 border-0 text-black' style={{ background: '#FAB320', height: '40px' }}>Lọc</button>
                        </div>
                    </div>
                    <div className="col-9 border-top">
                        <div className='row p-3 gap-3'>
                            <RoomTypeList roomtypes={roomtypes}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}