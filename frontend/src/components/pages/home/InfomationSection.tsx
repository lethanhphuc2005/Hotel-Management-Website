import style from "@/styles/base/page.module.css";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
import { Col, Row } from "react-bootstrap";
import Image from "next/image";

export default function InformationSection({ title }: { title: string }) {
  const [ref, controls] = useScrollAnimation(0.2, false);

  return (
    <>
      <div className={style.headerContainer1}>
        <h2 className={style.sectionTitle1}>{title}</h2>
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
              Tận hưởng kỳ nghỉ trong mơ tại The Moon Hotel & Resort. Chúng tôi
              mang đến không gian sang trọng, yên bình và đầy cảm hứng.
              <br />
              <br />
              Mỗi căn phòng là sự kết hợp hoàn hảo giữa tiện nghi hiện đại và vẻ
              đẹp tinh tế.
              <br />
              <br />
              Hãy để hành trình của bạn bắt đầu với những trải nghiệm độc đáo và
              dịch vụ tận tâm từ chúng tôi.
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
                    Nơi để sáng tạo vòng đời với không gian sang trọng và hưởng
                    ứng cocktail độc đáo. Tất cả, chúng tôi mang đến sự trải
                    nghiệm tuyệt vời với những món cocktail đặc biệt tại quầy
                    bar của chúng tôi.
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
        </motion.div>
      </div>
    </>
  );
}
