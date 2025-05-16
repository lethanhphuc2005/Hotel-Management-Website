import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';
import style from "./page.module.css";


export default function Home() {
  return (
    <>
      <section className={style.banner}>
        <div className={style.bannerContent}>
          <h2 className="fw-bold">WELCOME TO THE MOON</h2>
          <button className={`bg-transparent p-2 mt-3 ${style.btnBooking} fw-bold border-1`}>BOOKING</button>
        </div>
      </section>
      <Container fluid className={`${style.customContainer} container`}>
        {/* LOẠI PHÒNG Section */}
        <div className={style.headerContainer}>
          <h2 className={style.sectionTitle}>LOẠI PHÒNG</h2>
          <a href="#" className={style.seeAll}>Xem tất cả <i className="bi bi-arrow-right"></i></a>
        </div>
        <Row className="g-4 justify-content-center">
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
                <p className={style.roomLabel}>Phòng Standard</p>
                <div className={style.priceContainer}>
                  <span className={style.priceLabel}>Giá chỉ từ:</span>
                  <span className={style.price}>2.000.000 VND</span>
                </div>
                <a href="#" className={style.seeMore}>Xem thêm</a>
              </div>
            </div>
          </Col>
          <Col lg={4} md={6}>
            <div className={style.roomCard}>
              <Image
                src="/img/r2.jpg"
                alt="Phòng Deluxe"
                layout="fill"
                objectFit="cover"
                className={style.roomImage}
              />
              <div className={style.roomOverlay}></div>
              <div className={style.roomContent}>
                <p className={style.roomLabel}>Phòng Deluxe</p>
                <div className={style.priceContainer}>
                  <span className={style.priceLabel}>Giá chỉ từ:</span>
                  <span className={style.price}>2.000.000 VND</span>
                </div>
                <a href="#" className={style.seeMore}>Xem thêm</a>
              </div>
            </div>
          </Col>
          <Col lg={4} md={6}>
            <div className={style.roomCard}>
              <Image
                src="/img/r3.jpg"
                alt="Phòng Suite"
                layout="fill"
                objectFit="cover"
                className={style.roomImage}
              />
              <div className={style.roomOverlay}></div>
              <div className={style.roomContent}>
                <p className={style.roomLabel}>Phòng Suite</p>
                <div className={style.priceContainer}>
                  <span className={style.priceLabel}>Giá chỉ từ:</span>
                  <span className={style.price}>2.000.000 VND</span>
                </div>
                <a href="#" className={style.seeMore}>Xem thêm</a>
              </div>
            </div>
          </Col>
        </Row>
        <br />

        {/* DỊCH VỤ KHÁCH SẠN Section */}
        <div className={style.headerContainer}>
          <h2 className={style.sectionTitle}>DỊCH VỤ KHÁCH SẠN</h2>
          <a href="#" className={style.seeAll}>Xem tất cả <i className="bi bi-arrow-right"></i></a>
        </div>
        <Row className="g-4 justify-content-center">
          <Col lg={2} md={4} sm={6}>
            <div className={style.serviceCard}>
              <Image
                src="/img/phong5.jpg"
                alt="Hồ bơi"
                layout="fill"
                objectFit="cover"
                className={style.serviceImage}
              />
              <div className={style.serviceOverlay}></div>
              <div className={style.serviceContent}>
                <p className={style.serviceLabel}>HỒ BƠI</p>
              </div>
            </div>
          </Col>
          <Col lg={2} md={4} sm={6}>
            <div className={style.serviceCard}>
              <Image
                src="/img/phong6.jpg"
                alt="WIFI"
                layout="fill"
                objectFit="cover"
                className={style.serviceImage}
              />
              <div className={style.serviceOverlay}></div>
              <div className={style.serviceContent}>
                <p className={style.serviceLabel}>WIFI</p>
              </div>
            </div>
          </Col>
          <Col lg={2} md={4} sm={6}>
            <div className={style.serviceCard}>
              <Image
                src="/img/phong7.jpg"
                alt="Spa & Massage"
                layout="fill"
                objectFit="cover"
                className={style.serviceImage}
              />
              <div className={style.serviceOverlay}></div>
              <div className={style.serviceContent}>
                <p className={style.serviceLabel}>SPA & MASSAGE</p>
              </div>
            </div>
          </Col>
          <Col lg={2} md={4} sm={6}>
            <div className={style.serviceCard}>
              <Image
                src="/img/phong10.jpeg"
                alt="Yoga"
                layout="fill"
                objectFit="cover"
                className={style.serviceImage}
              />
              <div className={style.serviceOverlay}></div>
              <div className={style.serviceContent}>
                <p className={style.serviceLabel}>YOGA</p>
              </div>
            </div>
          </Col>
          <Col lg={2} md={4} sm={6}>
            <div className={style.serviceCard}>
              <Image
                src="/img/phong8.jpg"
                alt="Gym"
                layout="fill"
                objectFit="cover"
                className={style.serviceImage}
              />
              <div className={style.serviceOverlay}></div>
              <div className={style.serviceContent}>
                <p className={style.serviceLabel}>GYM</p>
              </div>
            </div>
          </Col>
          <Col lg={2} md={4} sm={6}>
            <div className={style.serviceCard}>
              <Image
                src="/img/phong9.jpeg"
                alt="Nhà hàng"
                layout="fill"
                objectFit="cover"
                className={style.serviceImage}
              />
              <div className={style.serviceOverlay}></div>
              <div className={style.serviceContent}>
                <p className={style.serviceLabel}>NHÀ HÀNG</p>
              </div>
            </div>
          </Col>
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
          <Col lg={3} md={6}>
            <div className={style.offerCard}>
              <Image
                src="/img/r5.jpg"
                alt="Ưu đãi 2"
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
          <Col lg={3} md={6}>
            <div className={style.offerCard}>
              <Image
                src="/img/r6.jpg"
                alt="Ưu đãi 3"
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
          <Col lg={3} md={6}>
            <div className={style.offerCard}>
              <Image
                src="/img/r7.jpg"
                alt="Ưu đãi 4"
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
                    <li>Thời gian từ 6:00 AM</li>
                    <li>Thực đơn phong phú</li>
                    <li>Phục vụ tại quầy bar</li>
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