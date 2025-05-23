"use client"
import { useParams } from 'next/navigation';
import { getRooms } from '../../services/roomService';
import { Room } from '../../types/room';
import { useEffect, useState } from 'react';
import { RoomofrtList } from '../../components/roomList';

export default function Roomtype() {
    const params = useParams();
    const id = params?.id as string;
    const [price, setPrice] = useState(500000);
    const [floor, setFloor] = useState('');
    const [status, setStatus] = useState('');
    const [rooms, setRooms] = useState<Room[]>([]);
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res: Room[] = await getRooms('http://localhost:8000/v1/room');

                const filtered = res.filter(room => room.MaLP && room.MaLP._id === id);

                setRooms(filtered);
                // console.log('Phòng theo loại:', filteredRooms);
            } catch (err) {
                console.error('Lỗi khi lấy danh sách phòng:', err);
            }
        };

        if (id) fetchRooms();
    }, [id]);
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
                <p className='fs-5 fw-bold'>{rooms[0]?.MaLP?.TenLP}</p>
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
                            <RoomofrtList roomofrts={rooms}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}