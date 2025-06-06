"use client"
import { Col } from "react-bootstrap";
import Image from "next/image";
import style from "../page.module.css";
import { Service } from "../types/service";
import { useState } from "react";
import { MainRoomClass } from "../types/mainroomclass";
import { RoomClass } from "../types/roomclass";

export function MainRoomClassItem({ mrci }: { mrci: MainRoomClass }) {
  return (
    <Col lg={4} md={6}>
      <div className={style.roomCard}>
        {mrci.images?.map((img, index) => {
          return (
            <Image
              key={index}
              src={`/img/${img.url}`}
              alt="Phòng Standard"
              layout="fill"
              objectFit="cover"
              className={style.roomImage}
            />
          );
        })}
        <div className={style.roomOverlay}></div>
        <div className={style.roomContent}>
          <p className={style.roomLabel}>Phòng {mrci.name}</p>
          <div className={style.priceContainer}>
            <span className={style.priceLabel}>{mrci.description}</span>
            {/* <span className={style.price}>{roomtype.GiaPhong.toLocaleString('vi-VN')} VND</span> */}
          </div>
          <a href="#" className={style.seeMore}>Xem thêm</a>
        </div>
      </div>
    </Col>
  );
}

export function RoomClassSaleItem({ rcsi }: { rcsi: RoomClass }) {
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

export function ServiceItem({ svi }: { svi: Service }) {
  return (
    <Col lg={2} md={4} sm={6}>
      <div className={style.serviceCard}>
        <Image
          src={`/img/${svi.image}`}
          alt="Hồ bơi"
          layout="fill"
          objectFit="cover"
          className={style.serviceImage}
        />
        <div className={style.serviceOverlay}></div>
        <div className={style.serviceContent}>
          <p className={style.serviceLabel}>{svi.name}</p>
        </div>
      </div>
    </Col>
  );
}

export function RoomClassItem({ rci }: { rci: RoomClass}) {
  const [liked, setLiked] = useState(false);

  const handleLikeClick = () => {
    setLiked(prev => !prev);
  };
  return (
    <>
      <div className='col border rounded-4 d-flex p-3 gap-3' style={{ height: '280px' }}>
        <div className="position-relative">
          {/* {img.map((img, index) => { */}
            {/* return ( */}
              <a href={`/roomdetail/${rci._id}`}>
                <img src='/img/r1.jpg' alt="" className="rounded-4 h-100" />
              </a>
            {/* ) */}
          {/* })} */}
          <button type="button"
            className="btn btn-light position-absolute top-0 end-0 m-1 rounded-circle shadow"
            onClick={handleLikeClick}
          >
            <i className={`bi bi-heart-fill ${liked ? 'text-danger' : 'text-dark'}`}></i>
          </button>
        </div>
        <div>
          <div className='d-flex gap-3'>
            <p className='fs-5 fw-bold mb-2'>{rci.name}</p>
            <span className='d-flex gap-1 mt-2' style={{ color: '#FAB320', fontSize: '12px' }}>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
            </span>
          </div>
          {/* <p className='mb-1'>Trạng thái: {item.TrangThai}</p> */}
          <p className='mb-1'>View: {rci.view}</p>
          <p className='mb-1'>Số giường: {rci.bed_amount}</p>
          <p className='mb-1'>Sức chứa: {rci.capacity}</p>
          <p className='mb-1'>Mô tả: {rci.description}</p>
          <p className='mb-1' style={{ color: '#FAB320' }}>
            <i className="bi bi-check2" style={{ color: '#FAB320' }}></i> Miễn phí hủy</p>
          <p className='mb-1' style={{ color: '#FAB320' }}>
            <i className="bi bi-check2" style={{ color: '#FAB320' }}></i> Không cần thanh toán trước - thanh toán tại lễ tân
          </p>
        </div>
        <div className='ms-auto align-self-end mb-2 text-end'>
          <h5>{rci.price.toLocaleString('vi-VN')} VND/đêm</h5>
          <p style={{ fontSize: '12px' }}>Đã bao gồm thuế và phí</p>
          <button className='border-0 rounded text-black' style={{ height: '40px', width: '150px', backgroundColor: '#FAB320' }}>
            Đặt phòng <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </>
  );
}