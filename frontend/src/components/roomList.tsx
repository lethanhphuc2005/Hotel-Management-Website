"use client";
import { MainRoomClass } from "@/types/mainroomclass";
import { RoomClass } from "@/types/roomclass";
import { Service } from "@/types/service";
import {
  DiscountItem,
  MainRoomClassItem,
  RoomClassItem,
  ServiceItem,
} from "./roomItem";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Discount } from "@/types/discount";
import { motion } from "framer-motion";
import style from "@/app/page.module.css";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function MainRoomClassList({
  mrcl,
  title,
}: {
  mrcl: MainRoomClass[];
  title?: string;
}) {
  const [ref, controls] = useScrollAnimation(0.2, false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={controls}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="mt-3 mb-3 d-flex row"
    >
      <div className={style.headerContainer}>
        <h2 className={style.sectionTitle}>{title}</h2>
        <a href="#" className={style.seeAll}>
          Xem tất cả <i className="bi bi-arrow-right"></i>
        </a>
      </div>
      {mrcl.map((mrc: MainRoomClass) => (
        <MainRoomClassItem key={mrc._id} mrci={mrc} />
      ))}
    </motion.div>
  );
}

export function DiscountList({
  dcl,
  title,
}: {
  dcl: Discount[];
  title?: string;
}) {
  const [ref, controls] = useScrollAnimation(0.2, false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={controls}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="mt-5 mb-5 d-flex row"
    >
      <div className={style.headerContainer}>
        <h2 className={style.sectionTitle}>{title}</h2>
        <a href="#" className={style.seeAll}>
          Xem tất cả <i className="bi bi-arrow-right"></i>
        </a>
      </div>
      {dcl.map((dc: Discount, index) => (
        <DiscountItem dci={dc} key={index} />
      ))}
    </motion.div>
  );
}

export function ServiceList({
  svl,
  title,
}: {
  svl: Service[];
  title?: string;
}) {
  const [ref, controls] = useScrollAnimation(0.2, false);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={controls}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="mt-3 mb-3 d-flex row"
    >
      <div className={`mt-5 ${style.headerContainer}`}>
        <h2 className={style.sectionTitle}>{title}</h2>
        <a href="#" className={style.seeAll}>
          Xem tất cả <i className="bi bi-arrow-right"></i>
        </a>
      </div>
      <Swiper
        modules={[Navigation]}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          576: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
          1200: { slidesPerView: 4 },
        }}
        navigation
        style={{ padding: "16px 0" }}
      >
        {svl.slice(0, 6).map((svi, idx) => (
          <SwiperSlide key={svi._id || idx}>
            <ServiceItem svi={svi} />
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
}

export function RoomClassList({
  rcl,
  numberOfNights,
  totalGuests,
  hasSearched,
  numberOfAdults,
  numberOfChildren,
  startDate,
  endDate,
  numChildrenUnder6,
  numchildrenOver6,
  numAdults,
  showExtraBedOver6,
}: {
  rcl: RoomClass[];
  numberOfNights: number;
  totalGuests: number;
  hasSearched?: boolean;
  numberOfAdults?: number;
  numberOfChildren?: number;
  startDate?: Date;
  endDate?: Date;
  numChildrenUnder6?: number;
  numchildrenOver6?: number;
  numAdults?: number;
  showExtraBedOver6?: boolean;
}) {
  return (
    <>
      {rcl.map((rc) => (
        <RoomClassItem
          rci={rc}
          numberOfNights={numberOfNights}
          totalGuests={totalGuests}
          hasSearched={hasSearched}
          numberOfAdults={numberOfAdults}
          numberOfChildren={numberOfChildren}
          startDate={startDate}
          endDate={endDate}
          numChildrenUnder6={numChildrenUnder6}
          numchildrenOver6={numchildrenOver6}
          numAdults={numAdults}
          showExtraBedOver6={showExtraBedOver6}
          key={rc._id}
        />
      ))}
    </>
  );
}
