"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { RoomClass } from "@/types/roomClass";
import getImageUrl from "@/utils/getImageUrl";

const RoomClassDetail = ({ roomClass }: { roomClass: RoomClass }) => {
  const images = roomClass?.images || [];

  return (
    <div className="tw-bg-black tw-min-h-screen tw-py-10 tw-text-[#fab320]">
      <div className="tw-max-w-6xl tw-mx-auto tw-px-4">
        {/* Tên và mô tả loại phòng */}
        <motion.h2
          className="tw-text-3xl tw-font-bold tw-mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {roomClass.name}
        </motion.h2>
        <motion.p
          className="tw-text-lg tw-text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {roomClass.description}
        </motion.p>

        {/* Album ảnh */}
        <motion.div
          className="tw-mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
            className="tw-rounded-2xl tw-shadow-xl"
          >
            {images.map((img, index) => (
              <SwiperSlide key={img.id || index}>
                <img
                  src={getImageUrl(img.url)}
                  alt={`Ảnh ${index + 1}`}
                  className="tw-w-full tw-h-[400px] tw-object-cover tw-rounded-2xl"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Thông tin chi tiết */}
        <motion.div
          className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6 tw-mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div>
            <p className="tw-mb-2">
              <strong>Giường:</strong> {roomClass.bed_amount}
            </p>
            <p className="tw-mb-2">
              <strong>Sức chứa:</strong> {roomClass.capacity} người
            </p>
            <p className="tw-mb-2">
              <strong>View:</strong> {roomClass.view}
            </p>
            <p className="tw-mb-2">
              <strong>Giá:</strong>{" "}
              {roomClass.price.toLocaleString()} VND
            </p>
          </div>

          <div>
            <p className="tw-font-semibold tw-mb-2">Tiện nghi:</p>
            <ul className="tw-list-disc tw-ml-5 tw-text-gray-400">
              {roomClass?.features?.map((f) => (
                <li key={f.feature_id.id}>{f.feature_id.name}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RoomClassDetail;
