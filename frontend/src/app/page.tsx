import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from "./page.module.css";


export default function Home() {
  return (
    <Container fluid className={`${styles.customContainer} container`}>
      {/* LOẠI PHÒNG Section */}
      <div className={styles.headerContainer}>
        <h2 className={styles.sectionTitle}>LOẠI PHÒNG</h2>
        <a href="#" className={styles.seeAll}>Xem tất cả <i className="bi bi-arrow-right"></i></a>
      </div>
      <Row className="g-4 justify-content-center">
        <Col lg={4} md={6}>
          <div className={styles.roomCard}>
            <Image
              src="/img/r1.jpg"
              alt="Phòng Standard"
              layout="fill"
              objectFit="cover"
              className={styles.roomImage}
            />
            <div className={styles.roomOverlay}></div>
            <div className={styles.roomContent}>
              <p className={styles.roomLabel}>Phòng Standard</p>
              <div className={styles.priceContainer}>
                <span className={styles.priceLabel}>Giá chỉ từ:</span>
                <span className={styles.price}>2.000.000 VND</span>
              </div>
              <a href="#" className={styles.seeMore}>Xem thêm</a>
            </div>
          </div>
        </Col>
        <Col lg={4} md={6}>
          <div className={styles.roomCard}>
            <Image
              src="/img/r2.jpg"
              alt="Phòng Deluxe"
              layout="fill"
              objectFit="cover"
              className={styles.roomImage}
            />
            <div className={styles.roomOverlay}></div>
            <div className={styles.roomContent}>
              <p className={styles.roomLabel}>Phòng Deluxe</p>
              <div className={styles.priceContainer}>
                <span className={styles.priceLabel}>Giá chỉ từ:</span>
                <span className={styles.price}>2.000.000 VND</span>
              </div>
              <a href="#" className={styles.seeMore}>Xem thêm</a>
            </div>
          </div>
        </Col>
        <Col lg={4} md={6}>
          <div className={styles.roomCard}>
            <Image
              src="/img/r3.jpg"
              alt="Phòng Suite"
              layout="fill"
              objectFit="cover"
              className={styles.roomImage}
            />
            <div className={styles.roomOverlay}></div>
            <div className={styles.roomContent}>
              <p className={styles.roomLabel}>Phòng Suite</p>
              <div className={styles.priceContainer}>
                <span className={styles.priceLabel}>Giá chỉ từ:</span>
                <span className={styles.price}>2.000.000 VND</span>
              </div>
              <a href="#" className={styles.seeMore}>Xem thêm</a>
            </div>
          </div>
        </Col>
      </Row>
      <br />

      {/* DỊCH VỤ KHÁCH SẠN Section */}
      <div className={styles.headerContainer}>
        <h2 className={styles.sectionTitle}>DỊCH VỤ KHÁCH SẠN</h2>
        <a href="#" className={styles.seeAll}>Xem tất cả <i className="bi bi-arrow-right"></i></a>
      </div>
      <Row className="g-4 justify-content-center">
        <Col lg={2} md={4} sm={6}>
          <div className={styles.serviceCard}>
            <Image
              src="/img/phong5.jpg"
              alt="Hồ bơi"
              layout="fill"
              objectFit="cover"
              className={styles.serviceImage}
            />
            <div className={styles.serviceOverlay}></div>
            <div className={styles.serviceContent}>
              <p className={styles.serviceLabel}>HỒ BƠI</p>
            </div>
          </div>
        </Col>
        <Col lg={2} md={4} sm={6}>
          <div className={styles.serviceCard}>
            <Image
              src="/img/phong6.jpg"
              alt="WIFI"
              layout="fill"
              objectFit="cover"
              className={styles.serviceImage}
            />
            <div className={styles.serviceOverlay}></div>
            <div className={styles.serviceContent}>
              <p className={styles.serviceLabel}>WIFI</p>
            </div>
          </div>
        </Col>
        <Col lg={2} md={4} sm={6}>
          <div className={styles.serviceCard}>
            <Image
              src="/img/phong7.jpg"
              alt="Spa & Massage"
              layout="fill"
              objectFit="cover"
              className={styles.serviceImage}
            />
            <div className={styles.serviceOverlay}></div>
            <div className={styles.serviceContent}>
              <p className={styles.serviceLabel}>SPA & MASSAGE</p>
            </div>
          </div>
        </Col>
        <Col lg={2} md={4} sm={6}>
          <div className={styles.serviceCard}>
            <Image
              src="/img/phong10.jpeg"
              alt="Yoga"
              layout="fill"
              objectFit="cover"
              className={styles.serviceImage}
            />
            <div className={styles.serviceOverlay}></div>
            <div className={styles.serviceContent}>
              <p className={styles.serviceLabel}>YOGA</p>
            </div>
          </div>
        </Col>
        <Col lg={2} md={4} sm={6}>
          <div className={styles.serviceCard}>
            <Image
              src="/img/phong8.jpg"
              alt="Gym"
              layout="fill"
              objectFit="cover"
              className={styles.serviceImage}
            />
            <div className={styles.serviceOverlay}></div>
            <div className={styles.serviceContent}>
              <p className={styles.serviceLabel}>GYM</p>
            </div>
          </div>
        </Col>
        <Col lg={2} md={4} sm={6}>
          <div className={styles.serviceCard}>
            <Image
              src="/img/phong9.jpeg"
              alt="Nhà hàng"
              layout="fill"
              objectFit="cover"
              className={styles.serviceImage}
            />
            <div className={styles.serviceOverlay}></div>
            <div className={styles.serviceContent}>
              <p className={styles.serviceLabel}>NHÀ HÀNG</p>
            </div>
          </div>
        </Col>
      </Row>
      <br />
      <br />
      <br />
      {/* ƯU ĐÃI ĐẶC BIỆT Section */}
      <div className={styles.headerContainer}>
        <h2 className={styles.sectionTitle}>ƯU ĐÃI ĐẶC BIỆT (giảm 30% khi đặt trước 7 ngày)</h2>
        <a href="#" className={styles.seeAll}>Xem tất cả <i className="bi bi-arrow-right"></i></a>
      </div>
      <Row className="g-4 justify-content-center">
        <Col lg={3} md={6}>
          <div className={styles.offerCard}>
            <Image
              src="/img/r4.jpg"
              alt="Ưu đãi 1"
              layout="fill"
              objectFit="cover"
              className={styles.offerImage}
            />
            <div className={styles.offerOverlay}></div>
            <div className={styles.offerContent}>
              <a href="#" className={styles.offerButton}>Xem chi tiết →</a>
            </div>
          </div>
        </Col>
        <Col lg={3} md={6}>
          <div className={styles.offerCard}>
            <Image
              src="/img/r5.jpg"
              alt="Ưu đãi 2"
              layout="fill"
              objectFit="cover"
              className={styles.offerImage}
            />
            <div className={styles.offerOverlay}></div>
            <div className={styles.offerContent}>
              <a href="#" className={styles.offerButton}>Xem chi tiết →</a>
            </div>
          </div>
        </Col>
        <Col lg={3} md={6}>
          <div className={styles.offerCard}>
            <Image
              src="/img/r6.jpg"
              alt="Ưu đãi 3"
              layout="fill"
              objectFit="cover"
              className={styles.offerImage}
            />
            <div className={styles.offerOverlay}></div>
            <div className={styles.offerContent}>
              <a href="#" className={styles.offerButton}>Xem chi tiết →</a>
            </div>
          </div>
        </Col>
        <Col lg={3} md={6}>
          <div className={styles.offerCard}>
            <Image
              src="/img/r7.jpg"
              alt="Ưu đãi 4"
              layout="fill"
              objectFit="cover"
              className={styles.offerImage}
            />
            <div className={styles.offerOverlay}></div>
            <div className={styles.offerContent}>
              <a href="#" className={styles.offerButton}>Xem chi tiết →</a>
            </div>
          </div>
        </Col>
      </Row>
      <br />
      <br />
      <br />
      {/* THÔNG TIN Section */}
      <div className={styles.headerContainer1}>
        <h2 className={styles.sectionTitle1}>THÔNG TIN</h2>
      </div>
      <div className={styles.infoSection}>
        <div className={styles.infoMainCard}>
          <div>
            <img src="/img/about.jpg" width='773px' height='530px' alt="" />
          </div>
          <div className={styles.infoMainContent}>
            <h3 className={styles.infoTitle}>THE MOON</h3>
            <p className={styles.infoText}>
              Nơi lưu trú lý tưởng cho những khoảnh khắc đáng nhớ.Tại Hoshiyo Hotel & Resort, chúng tôi mang đến không gian nghỉ dưỡng sang trọng, dịch vụ đẳng cấp cùng những trải nghiệm tuyệt vời. Mỗi căn phòng không chỉ là nơi dừng chân mà còn là điểm khởi đầu cho những hành trình đáng nhớ. <br /><br />
              Nơi lưu trú lý tưởng cho những khoảnh khắc đáng nhớ.Tại Hoshiyo Hotel & Resort, chúng tôi mang đến không gian nghỉ dưỡng sang trọng, dịch vụ đẳng cấp cùng những trải nghiệm tuyệt vời. Mỗi căn phòng không chỉ là nơi dừng chân mà còn là điểm khởi đầu cho những hành trình đáng nhớ. <br /> <br />
              Nơi lưu trú lý tưởng cho những khoảnh khắc đáng nhớ.Tại Hoshiyo Hotel & Resort, chúng tôi mang đến không gian nghỉ dưỡng sang trọng, dịch vụ đẳng cấp cùng những trải nghiệm tuyệt vời. Mỗi căn phòng không chỉ là nơi dừng chân mà còn là điểm khởi đầu cho những hành trình đáng nhớ. <br /> <br />
              Nơi lưu trú lý tưởng cho những khoảnh khắc đáng nhớ.
            </p>
          </div>
        </div>
        <Row className="g-4 justify-content-center mt-4">
          <Col lg={4} md={6}>
            <div className={styles.infoCard}>
              <Image
                src="/img/phong14.avif"
                alt="Check-in Information"
                layout="fill"
                objectFit="cover"
                className={styles.infoCardImage}
              />
              <div className={styles.infoCardOverlay}></div>
              <div className={styles.infoCardContent}>
                <h4 className={styles.infoCardTitle}>THE MOON</h4>
                <p className={styles.infoCardText}>
                  Nơi để sáng tạo vòng đời với không gian sang trọng và hưởng ứng cocktail độc đáo. Tất cả, chúng tôi mang
                  đến sự trải nghiệm tuyệt vời với những món cocktail đặc biệt tại quầy bar của chúng tôi.
                </p>
                <ul className={styles.infoList}>
                  <li>Check-in: Từ 2:00 PM</li>
                  <li>Check-out: Từ 12:00 PM</li>
                  <li>Vị trí hoàn hảo tại trung tâm</li>
                </ul>
              </div>
            </div>
          </Col>
          <Col lg={4} md={6}>
            <div className={styles.infoCard}>
              <Image
                src="/img/phong15.jpeg"
                alt="Room Booking Information"
                layout="fill"
                objectFit="cover"
                className={styles.infoCardImage}
              />
              <div className={styles.infoCardOverlay}></div>
              <div className={styles.infoCardContent}>
                <h4 className={styles.infoCardTitle}>CHÍNH SÁCH ĐẶT PHÒNG</h4>
                <ul className={styles.infoList}>
                  <li>Check-in: Từ 2:00 PM</li>
                  <li>Check-out: Từ 12:00 PM</li>
                  <li>Vị trí hoàn hảo tại trung tâm</li>
                </ul>
              </div>
            </div>
          </Col>
          <Col lg={4} md={6}>
            <div className={styles.infoCard}>
              <Image
                src="/img/phong17.jpeg"
                alt="Restaurant Information"
                layout="fill"
                objectFit="cover"
                className={styles.infoCardImage}
              />
              <div className={styles.infoCardOverlay}></div>
              <div className={styles.infoCardContent}>
                <h4 className={styles.infoCardTitle}>CHÍNH SÁCH THANH TOÁN</h4>
                <ul className={styles.infoList}>
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
  );
}