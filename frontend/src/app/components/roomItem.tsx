import { RoomType } from "../types/roomtype";
import { Col } from "react-bootstrap";
import Image from "next/image";
import style from "../page.module.css";
import { Room } from "../types/room";
import { Service } from "../types/service";

export function RoomT({ roomtype }: { roomtype: RoomType }) {
    return (
        <Col lg={4} md={6}>
            <div className={style.roomCard}>
              <Image
                src="/img/r1.jpg"
                alt="Phòng Standard"
                layout="fill"
                objectFit="cover"
                className={style.roomImage}
              />
              <div className={style.roomOverlay}></div>
              <div className={style.roomContent}>
                <p className={style.roomLabel}>Phòng {roomtype.TenLP}</p>
                <div className={style.priceContainer}>
                  <span className={style.priceLabel}>Giá chỉ từ:</span>
                  <span className={style.price}>{roomtype.GiaPhong} VND</span>
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