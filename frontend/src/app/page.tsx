"use client";
import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import style from "./page.module.css";
import Banner from "@/components/pages/home/BannerSection";
import MainRoomClassList from "@/components/pages/home/MainRoomClassSection";
import ServiceList from "@/components/pages/home/ServiceSection";
import DiscountList from "@/components/pages/home/DiscountSection";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useHome } from "@/hooks/useHome";
import { useRoomSearch } from "@/hooks/useRoomSearch";

export default function Home() {
  const {
    dateRange,
    setDateRange,
    guests,
    setGuests,
    showCalendar,
    setShowCalendar,
    showGuestBox,
    setShowGuestBox,
    guestBoxRef,
    calendarRef,
    maxGuests,
    setMaxGuests,
    totalGuests,
    numberOfNights,
    setNumberOfNights,
    totalPrice,
    setTotalPrice,
    hasSearched,
    setHasSearched,
    pendingGuests,
    setPendingGuests,
    pendingDateRange,
    setPendingDateRange,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useRoomSearch();
  const [ref, controls] = useScrollAnimation(0.2, false);
  const { mainRoomClasses, websiteContents, services, discounts } = useHome();
  return (
    <>
      <Banner
        banners={websiteContents}
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
        maxGuests={maxGuests}
        setMaxGuests={setMaxGuests}
        totalGuests={totalGuests}
        numberOfNights={numberOfNights}
        setNumberOfNights={setNumberOfNights}
        totalPrice={totalPrice}
        setTotalPrice={setTotalPrice}
        hasSearched={hasSearched}
        setHasSearched={setHasSearched}
        pendingGuests={pendingGuests}
        setPendingGuests={setPendingGuests}
        pendingDateRange={pendingDateRange}
        setPendingDateRange={setPendingDateRange}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <Container fluid className={`${style.customContainer} container`}>
        <MainRoomClassList title="Loại phòng" mrcl={mainRoomClasses} />

        <ServiceList title="Dịch vụ khách sạn" svl={services} />

        <DiscountList title="Ưu đãi đặc biệt" dcl={discounts.slice(0, 3)} />

        <div className={style.headerContainer1}>
          <h2 className={style.sectionTitle1}>THÔNG TIN</h2>
        </div>
        <div className={style.infoSection}>
          <div className={style.infoMainCard}>
            <motion.div
              className={style.imageWrapper}
              whileHover="hover"
              initial="rest"
              animate="rest"
              variants={{ rest: {}, hover: {} }}
            >
              <motion.img
                src="/img/about.jpg"
                alt="default"
                className={`${style.image} ${style.defaultImage}`}
                variants={{
                  rest: { opacity: 1, scale: 1 },
                  hover: { opacity: 0, scale: 1.05 },
                }}
                transition={{ duration: 0.5 }}
              />
              <motion.img
                src="/img/phong13.jpg"
                alt="hover"
                className={`${style.image} ${style.hoverImage}`}
                variants={{
                  rest: { opacity: 0, scale: 1 },
                  hover: { opacity: 1, scale: 1.05 },
                }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>

            {/* Nội dung có animation khi hiện ra */}
            <motion.div
              className={style.infoMainContent}
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false }}
            >
              <motion.h3
                className={style.infoTitle}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: false }}
                style={{ marginLeft: "-10px" }}
              >
                THE MOON
              </motion.h3>

              <motion.p
                className={style.infoText}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                viewport={{ once: false }}
              >
                Tận hưởng kỳ nghỉ trong mơ tại The Moon Hotel & Resort. Chúng
                tôi mang đến không gian sang trọng, yên bình và đầy cảm hứng.
                <br />
                <br />
                Mỗi căn phòng là sự kết hợp hoàn hảo giữa tiện nghi hiện đại và
                vẻ đẹp tinh tế.
                <br />
                <br />
                Hãy để hành trình của bạn bắt đầu với những trải nghiệm độc đáo
                và dịch vụ tận tâm từ chúng tôi.
                <br />
                <br />
                The Moon – nơi mỗi khoảnh khắc đều là một kỷ niệm đáng nhớ.
              </motion.p>
            </motion.div>
          </div>
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={controls}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="mt-3 mb-3 d-flex row"
          >
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
                      Nơi để sáng tạo vòng đời với không gian sang trọng và
                      hưởng ứng cocktail độc đáo. Tất cả, chúng tôi mang đến sự
                      trải nghiệm tuyệt vời với những món cocktail đặc biệt tại
                      quầy bar của chúng tôi.
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
                    <h4 className={style.infoCardTitle}>
                      CHÍNH SÁCH ĐẶT PHÒNG
                    </h4>
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
                    <h4 className={style.infoCardTitle}>
                      CHÍNH SÁCH THANH TOÁN
                    </h4>
                    <ul className={style.infoList}>
                      <li>Tiền mặt</li>
                      <li>Thanh toán trực tiếp tại lễ tân</li>
                      <li>Phải cọc tiền vào ngày lễ</li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </motion.div>
        </div>
      </Container>
    </>
  );
}
