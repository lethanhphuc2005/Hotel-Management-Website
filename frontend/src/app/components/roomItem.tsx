"use client"
import { RoomType } from "../types/roomtype";
import { Col } from "react-bootstrap";
import Image from "next/image";
import style from "../page.module.css";
import { Room } from "../types/room";
import { Service } from "../types/service";
import { useState } from "react";

export function RoomT({ roomtype }: { roomtype: RoomType }) {
  return (
    <Col lg={4} md={6}>
      <div className={style.roomCard}>
        {roomtype.HinhAnh?.map((img, index) => {
          return (
            <Image
              key={index}
              src={`/img/${img.HinhAnh}`}
              alt="Phòng Standard"
              layout="fill"
              objectFit="cover"
              className={style.roomImage}
            />
          );
        })}
        <div className={style.roomOverlay}></div>
        <div className={style.roomContent}>
          <p className={style.roomLabel}>Phòng {roomtype.TenLP}</p>
          <div className={style.priceContainer}>
            <span className={style.priceLabel}>Giá chỉ từ:</span>
            <span className={style.price}>{roomtype.GiaPhong.toLocaleString('vi-VN')} VND</span>
          </div>
          <a href="#" className={style.seeMore}>Xem thêm</a>
        </div>
      </div>
    </Col>
  );
}

export function RoomSale({ room }: { room: Room }) {
  return (
    <Col lg={3} md={6}>
      <div className={style.offerCard}>
        <Image
          src="/img/r4.jpg"
          alt="Ưu đãi 1"
          layout="fill"
          objectFit="cover"
          className={style.offerImage}
        />
        <div className={style.offerOverlay}></div>
        <div className={style.offerContent}>
          <a href="#" className={style.offerButton}>Xem chi tiết →</a>
        </div>
      </div>
    </Col>
  );
}

export function ServiceItem({ service }: { service: Service }) {
  return (
    <Col lg={2} md={4} sm={6}>
      <div className={style.serviceCard}>
        <Image
          src={`/img/${service.HinhAnh}`}
          alt="Hồ bơi"
          layout="fill"
          objectFit="cover"
          className={style.serviceImage}
        />
        <div className={style.serviceOverlay}></div>
        <div className={style.serviceContent}>
          <p className={style.serviceLabel}>{service.TenDV}</p>
        </div>
      </div>
    </Col>
  );
}

export function RoomTypeItem({ roomtype }: { roomtype: RoomType }) {
  const [liked, setLiked] = useState(false);

  const handleLikeClick = () => {
    setLiked(prev => !prev);
  };
  return (
    <div className='col border rounded-4 d-flex p-3 gap-3' style={{ height: '280px' }}>
      <div className="position-relative">
        {roomtype.HinhAnh?.map((img, index) => {
          return (
            <a href={`/roomtype/${roomtype._id}`}>
              <img key={index} src={`/img/${img.HinhAnh}`} alt="" className="rounded-4 h-100" />
            </a>
          )
        })}

        <button type="button"
          className="btn btn-light position-absolute top-0 end-0 m-1 rounded-circle shadow"
          onClick={handleLikeClick}
        >
          <i className={`bi bi-heart-fill ${liked ? 'text-danger' : 'text-dark'}`}></i>
        </button>
      </div>
      <div>
        <div className='d-flex gap-3'>
          <p className='fs-5 fw-bold mb-2'>The Moon Hotel - {roomtype.TenLP}</p>
          <span className='d-flex gap-1 mt-2' style={{ color: '#FAB320', fontSize: '12px' }}>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
          </span>
        </div>
        <p className='mb-1'>Loại phòng: {roomtype.TenLP}</p>
        <p className='mb-1'>View: {roomtype.View}</p>
        <p className='mb-1'>Số giường: {roomtype.SoGiuong}</p>
        <p className='mb-1'>Mô tả: {roomtype.MoTa}</p>
        <p className='mb-1' style={{ color: '#FAB320' }}>
          <i className="bi bi-check2" style={{ color: '#FAB320' }}></i> Miễn phí hủy</p>
        <p className='mb-1' style={{ color: '#FAB320' }}>
          <i className="bi bi-check2" style={{ color: '#FAB320' }}></i> Không cần thanh toán trước - thanh toán tại lễ tân
        </p>
      </div>
      <div className='ms-auto align-self-end mb-2 text-end'>
        <h5>{roomtype.GiaPhong.toLocaleString('vi-VN')} VND/đêm</h5>
        <p style={{ fontSize: '12px' }}>Đã bao gồm thuế và phí</p>
        <button className='border-0 rounded text-black' style={{ height: '40px', width: '150px', backgroundColor: '#FAB320' }}>
          Xem chỗ trống <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}