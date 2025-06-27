import { Service } from "@/types/service";
import { motion } from "framer-motion";
import style from "@/app/page.module.css";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import AnimatedButton from "@/components/common/Button";

export function ServiceItem({ svi }: { svi: Service }) {
  return (
    <div className={style.serviceCard}>
      <div style={{ position: "relative", width: "100%", height: 180 }}>
        <Image
          src={`http://localhost:8000/images/${svi.image}`}
          alt={svi.name}
          layout="fill"
          objectFit="cover"
          className={style.serviceImage}
        />
      </div>
      <div className="p-3">
        <h5 className="text-truncate" style={{ fontWeight: 600 }}>
          {svi.name}
        </h5>

        <div className="mb-4 mt-3 d-flex align-items-center gap-1">
          <span role="img" aria-label="clock">
            <i className="bi bi-bookmark-check-fill"></i>
          </span>
          <span
            className="text-truncate"
            style={{ marginLeft: 8, color: "white" }}
          >
            {svi.description}
          </span>
        </div>
        <a>
          <AnimatedButton className="tw-w-full ">Xem thêm</AnimatedButton>
        </a>
      </div>
    </div>
  );
}

export default function ServiceList({
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
        <Link href="/service" className={style.seeAll}>
          Xem tất cả <i className="bi bi-arrow-right"></i>
        </Link>
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
          <SwiperSlide key={svi.id || idx}>
            <ServiceItem svi={svi} />
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
}
