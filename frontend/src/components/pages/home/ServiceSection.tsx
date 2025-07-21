import { Service } from "@/types/service";
import { useState } from "react";
import { motion } from "framer-motion";
import style from "@/styles/base/page.module.css";
import Image from "next/image";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/contexts/store";
import { addServiceToRoom } from "@/contexts/cartSlice";
import SelectRoomModal from "@/components/modals/SelecteServiceModal";
import { AnimatedButton } from "@/components/common/Button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import getImageUrl from "@/utils/getImageUrl";

export function ServiceItem({ svi }: { svi: Service }) {
  const [showDetail, setShowDetail] = useState(false);
  const [showSelectRoom, setShowSelectRoom] = useState(false);
  const dispatch = useDispatch();
  const cartRooms = useSelector((state: RootState) => state.cart.rooms);

  const handleAdd = () => {
    if (cartRooms.length === 0) {
      toast.warning("Bạn cần thêm ít nhất một phòng vào giỏ trước.");
      return;
    }
    setShowSelectRoom(true);
  };

  const handleSelectRoom = (roomId: string) => {
    dispatch(
      addServiceToRoom({
        roomId,
        service: {
          id: svi.id,
          name: svi.name,
          image: svi.image || "default.jpg",
          description: svi.description,
          price: svi.price,
          quantity: 1,
        },
      })
    );
    toast.success(`Đã thêm dịch vụ "${svi.name}" vào phòng!`);
    setShowSelectRoom(false);
  };

  return (
    <>
      {/* Card dịch vụ */}
      <div className={style.serviceCard}>
        <div style={{ position: "relative", width: "100%", height: 180 }}>
          <Image
            src={getImageUrl(svi.image)}
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
            <i className="bi bi-bookmark-check-fill" />
            <span className="text-truncate ms-2 text-white">
              {svi.description}
            </span>
          </div>
          <div className="tw-flex tw-gap-2">
            <AnimatedButton className="tw-w-full" onClick={handleAdd}>
              Thêm
            </AnimatedButton>
          </div>
        </div>
      </div>

      {/* === MODAL CHỌN PHÒNG === */}
      <SelectRoomModal
        open={showSelectRoom}
        onClose={() => setShowSelectRoom(false)}
        onSelect={handleSelectRoom}
      />
    </>
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
