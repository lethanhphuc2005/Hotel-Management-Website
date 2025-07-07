"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Image from "next/image";
import { Discount } from "@/types/discount";
import DiscountDetailPopup from "@/components/modals/DiscountDetailModal";

export function DiscountItem({ item }: { item: Discount }) {
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [ref, controls] = useScrollAnimation(0.2, false);

  const getValueDisplay = () => {
    if (item.value_type === "percent") {
      return `Giảm ${item.value * 100}%`;
    } else {
      return `Giảm ${item.value.toLocaleString("vi-VN")}₫`;
    }
  };

  const getTypeLabel = () => {
    switch (item.type) {
      case "early_bird":
        return "Đặt sớm";
      case "promo_code":
        return "Mã khuyến mãi";
      case "user_level":
        return "Ưu đãi thành viên";
      case "seasonal":
        return "Khuyến mãi theo mùa";
      case "length_of_stay":
        return "Ưu đãi dài ngày";
      default:
        return "Khuyến mãi";
    }
  };

  return (
    <>
      {/* Mở modal nếu muốn (chưa triển khai) */}
      <DiscountDetailPopup
        open={showDetailPopup}
        onClose={() => setShowDetailPopup(false)}
        title={item.name}
        image={`http://localhost:8000/images/${item.image}`}
        description={item.description}
        price={undefined}
        value={item.value}
        value_type={item.value_type}
        type={item.type}
        promo_code={item.promo_code}
        valid_from={item.valid_from}
        valid_to={item.valid_to}
      />

      <motion.div
        className="tw-bg-black tw-text-white tw-p-4 tw-rounded-xl tw-shadow-md tw-space-y-3 tw-h-full tw-cursor-pointer tw-relative"
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={controls}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 0 25px #fab320",
          transition: { duration: 0.3 },
        }}
        whileTap={{ scale: 0.98, transition: { duration: 0.2 } }}
        onClick={() => setShowDetailPopup(true)}
      >
        {/* Promo Code Badge */}
        {item.type === "promo_code" && item.promo_code && (
          <div className="tw-absolute tw-top-2 tw-left-2 tw-bg-[#FAB320] tw-text-black tw-text-xs tw-font-bold tw-px-2 tw-py-1 tw-rounded">
            Mã: {item.promo_code}
          </div>
        )}

        <Image
          src={`http://localhost:8000/images/${item.image}`}
          alt={item.name}
          width={500}
          height={240}
          priority={false}
          loading="lazy"
          className="tw-w-full tw-h-[240px] tw-object-cover tw-rounded-lg tw-shrink-0"
        />

        <motion.h5 className="tw-text-lg sm:tw-text-xl tw-text-[#FAB320] tw-tracking-wide tw-line-clamp-1">
          {item.name}
        </motion.h5>

        <p className="tw-font-lora tw-text-gray-400 tw-line-clamp-2">
          {item.description}
        </p>

        <div className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-items-center sm:tw-justify-between tw-mt-2">
          <span className="tw-text-sm tw-text-white/60">{getTypeLabel()}</span>
          <span className="tw-text-[#FAB320] tw-font-bold">
            {getValueDisplay()}
          </span>
        </div>
      </motion.div>
    </>
  );
}
