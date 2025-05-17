import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';
import style from "./page.module.css";
import { RoomSaleList, RoomTList, ServiceList } from "./components/roomList";
import { RoomType } from "./types/roomtype";
import { Room } from "./types/room";
import { getRooms } from "./services/roomService";
import { getRoomTypes } from "./services/roomtypeService"
import { Banner } from "./components/bannerItem";
import { WebsiteContent } from "./types/websitecontent";
import { getWebsiteContents } from "./services/websitecontentService";
import { Service } from "./types/service";
import { getServices } from "./services/serviceService";


export default async function Home() {
  let banners: WebsiteContent[] = await getWebsiteContents(
    "http://localhost:8000/v1/websitecontent"
  );
  let roomtypes: RoomType[] = await getRoomTypes(
    "http://localhost:8000/v1/roomtype"
  );
  let services: Service[] = await getServices(
    "http://localhost:8000/v1/service"
  );
  let roomsales: Room[] = await getRooms(
    "http://localhost:8000/v1/room"
  );
  return (
    <>
      <Banner banner={banners[0]}/>
      <Container fluid className={`${style.customContainer} container`}>
        {/* LOẠI PHÒNG Section */}
        <div className={style.headerContainer}>
          <h2 className={style.sectionTitle}>LOẠI PHÒNG</h2>
          <a href="#" className={style.seeAll}>Xem tất cả <i className="bi bi-arrow-right"></i></a>
        </div>
        <Row className="g-4 justify-content-center">
          <RoomTList roomtypes={roomtypes} />
        </Row>
        <br />

        {/* DỊCH VỤ KHÁCH SẠN Section */}
        <div className={style.headerContainer}>
          <h2 className={style.sectionTitle}>DỊCH VỤ KHÁCH SẠN</h2>
          <a href="#" className={style.seeAll}>Xem tất cả <i className="bi bi-arrow-right"></i></a>
        </div>
        <Row className="g-4 justify-content-center">
          <ServiceList services={services}/>
        </Row>
        <br />
        <br />
        <br />
        {/* ƯU ĐÃI ĐẶC BIỆT Section */}
        <div className={style.headerContainer}>
          <h2 className={style.sectionTitle}>ƯU ĐÃI ĐẶC BIỆT (giảm 30% khi đặt trước 7 ngày)</h2>
          <a href="#" className={style.seeAll}>Xem tất cả <i className="bi bi-arrow-right"></i></a>
        </div>
        <Row className="g-4 justify-content-center">
          <RoomSaleList rooms={roomsales} />
        </Row>
        <br />
        <br />
        <br />
        {/* THÔNG TIN Section */}
        <div className={style.headerContainer1}>
          <h2 className={style.sectionTitle1}>THÔNG TIN</h2>
        </div>
        <div className={style.infoSection}>
          <div className={style.infoMainCard}>
            <div>
              <img src="/img/about.jpg" width='773px' height='530px' alt="" />
            </div>
            <div className={style.infoMainContent}>
              <h3 className={style.infoTitle}>THE MOON</h3>
              <p className={style.infoText}>
                Nơi lưu trú lý tưởng cho những khoảnh khắc đáng nhớ.Tại Hoshiyo Hotel & Resort, chúng tôi mang đến không gian nghỉ dưỡng sang trọng, dịch vụ đẳng cấp cùng những trải nghiệm tuyệt vời. Mỗi căn phòng không chỉ là nơi dừng chân mà còn là điểm khởi đầu cho những hành trình đáng nhớ. <br /><br />
                Nơi lưu trú lý tưởng cho những khoảnh khắc đáng nhớ.Tại Hoshiyo Hotel & Resort, chúng tôi mang đến không gian nghỉ dưỡng sang trọng, dịch vụ đẳng cấp cùng những trải nghiệm tuyệt vời. Mỗi căn phòng không chỉ là nơi dừng chân mà còn là điểm khởi đầu cho những hành trình đáng nhớ. <br /> <br />
                Nơi lưu trú lý tưởng cho những khoảnh khắc đáng nhớ.Tại Hoshiyo Hotel & Resort, chúng tôi mang đến không gian nghỉ dưỡng sang trọng, dịch vụ đẳng cấp cùng những trải nghiệm tuyệt vời. Mỗi căn phòng không chỉ là nơi dừng chân mà còn là điểm khởi đầu cho những hành trình đáng nhớ. <br /> <br />
                Nơi lưu trú lý tưởng cho những khoảnh khắc đáng nhớ.
              </p>
            </div>
          </div>
          <Row className="g-4 justify-content-center mt-4">
            <Col lg={4} md={6}>
              <div className={style.infoCard}>
                <Image
                  src="/img/phong14.avif"
                  alt="Check-in Information"
                  layout="fill"
                  objectFit="cover"
                  className={style.infoCardImage}
                />
                <div className={style.infoCardOverlay}></div>
                <div className={style.infoCardContent}>
                  <h4 className={style.infoCardTitle}>THE MOON</h4>
                  <p className={style.infoCardText}>
                    Nơi để sáng tạo vòng đời với không gian sang trọng và hưởng ứng cocktail độc đáo. Tất cả, chúng tôi mang
                    đến sự trải nghiệm tuyệt vời với những món cocktail đặc biệt tại quầy bar của chúng tôi.
                  </p>
                  <ul className={style.infoList}>
                    <li>Check-in: Từ 2:00 PM</li>
                    <li>Check-out: Từ 12:00 PM</li>
                    <li>Vị trí hoàn hảo tại trung tâm</li>
                  </ul>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6}>
              <div className={style.infoCard}>
                <Image
                  src="/img/phong15.jpeg"
                  alt="Room Booking Information"
                  layout="fill"
                  objectFit="cover"
                  className={style.infoCardImage}
                />
                <div className={style.infoCardOverlay}></div>
                <div className={style.infoCardContent}>
                  <h4 className={style.infoCardTitle}>CHÍNH SÁCH ĐẶT PHÒNG</h4>
                  <ul className={style.infoList}>
                    <li>Hủy phòng miễn phí trước 48 giờ</li>
                    <li>Không cho phép mang thú cưng</li>
                    <li>Vị trí hoàn hảo tại trung tâm</li>
                  </ul>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6}>
              <div className={style.infoCard}>
                <Image
                  src="/img/phong17.jpeg"
                  alt="Restaurant Information"
                  layout="fill"
                  objectFit="cover"
                  className={style.infoCardImage}
                />
                <div className={style.infoCardOverlay}></div>
                <div className={style.infoCardContent}>
                  <h4 className={style.infoCardTitle}>CHÍNH SÁCH THANH TOÁN</h4>
                  <ul className={style.infoList}>
                    <li>Tiền mặt</li>
                    <li>Thanh toán trực tiếp tại lễ tân</li>
                    <li>Phải cọc tiền vào ngày lễ</li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
}