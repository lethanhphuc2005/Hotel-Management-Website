'use client';
import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';
import style from "./page.module.css";
import { RoomClassSaleList, MainRoomClassList, ServiceList } from "./components/roomList";
import { Banner } from "./components/bannerItem";
import RoomSearchBar from "./components/roomSearchBar";
import { useRoomSearch } from './hooks/useRoomSearch';
import { useData } from "./hooks/useData";


export default function Home() {
  const {
    dateRange, setDateRange,
    guests, setGuests,
    beds, setBeds,
    showCalendar, setShowCalendar,
    showGuestBox, setShowGuestBox,
    showBedBox, setShowBedBox,
    guestBoxRef, calendarRef, bedRef
  } = useRoomSearch();
  const { websitecontent, mainroomclass, services, roomclass } = useData();
  return (
    <>
      <Banner banners={websitecontent} />
      <div className="mt-2">
        <RoomSearchBar
          dateRange={dateRange}
          setDateRange={setDateRange}
          guests={guests}
          setGuests={setGuests}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
          showGuestBox={showGuestBox}
          setShowGuestBox={setShowGuestBox}
          guestBoxRef={guestBoxRef}
          calendarRef={calendarRef}
        />
      </div>
      <Container fluid className={`${style.customContainer} container`}>
        {/* LOẠI PHÒNG Section */}
        <div className={style.headerContainer}>
          <h2 className={style.sectionTitle}>LOẠI PHÒNG</h2>
          <a href="#" className={style.seeAll}>Xem tất cả <i className="bi bi-arrow-right"></i></a>
        </div>
        <Row className="g-4 justify-content-center">
          <MainRoomClassList mrcl={mainroomclass} />
        </Row>
        <br />

        {/* DỊCH VỤ KHÁCH SẠN Section */}
        <div className={`mt-5 ${style.headerContainer}`}>
          <h2 className={style.sectionTitle}>DỊCH VỤ KHÁCH SẠN</h2>
          <a href="#" className={style.seeAll}>Xem tất cả <i className="bi bi-arrow-right"></i></a>
        </div>
        <Row className="g-4 justify-content-center">
          <ServiceList svl={services} />
        </Row>
        {/* ƯU ĐÃI ĐẶC BIỆT Section */}
        <div className={`mt-5 ${style.headerContainer}`}>
          <h2 className={style.sectionTitle}>ƯU ĐÃI ĐẶC BIỆT (giảm 30% khi đặt trước 7 ngày)</h2>
          <a href="#" className={style.seeAll}>Xem tất cả <i className="bi bi-arrow-right"></i></a>
        </div>
        <Row className="g-4 justify-content-center">
          <RoomClassSaleList rcsl={roomclass} />
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
                Nơi lưu trú lý tưởng cho những khoảnh khắc đáng nhớ.Tại The Moon Hotel & Resort, chúng tôi mang đến không gian nghỉ dưỡng sang trọng, dịch vụ đẳng cấp cùng những trải nghiệm tuyệt vời. Mỗi căn phòng không chỉ là nơi dừng chân mà còn là điểm khởi đầu cho những hành trình đáng nhớ. <br /><br />
                Nơi lưu trú lý tưởng cho những khoảnh khắc đáng nhớ.Tại The Moon Hotel & Resort, chúng tôi mang đến không gian nghỉ dưỡng sang trọng, dịch vụ đẳng cấp cùng những trải nghiệm tuyệt vời. Mỗi căn phòng không chỉ là nơi dừng chân mà còn là điểm khởi đầu cho những hành trình đáng nhớ. <br /> <br />
                Nơi lưu trú lý tưởng cho những khoảnh khắc đáng nhớ.Tại The Moon Hotel & Resort, chúng tôi mang đến không gian nghỉ dưỡng sang trọng, dịch vụ đẳng cấp cùng những trải nghiệm tuyệt vời. Mỗi căn phòng không chỉ là nơi dừng chân mà còn là điểm khởi đầu cho những hành trình đáng nhớ. <br /> <br />
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