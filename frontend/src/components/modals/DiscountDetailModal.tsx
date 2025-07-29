"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { formatDate } from "@/utils/dateUtils";
import { toast } from "react-toastify";

interface Props  {
  open: boolean;
  onClose: () => void;
  title: string;
  image?: string;
  description: string;
  price?: number;
  value?: number;
  value_type?: "percent" | "fixed";
  type?: string;
  promo_code?: string | null;
  valid_from: Date;
  valid_to: Date;
}

function DiscountDetailPopup({
  open,
  onClose,
  title,
  image,
  description,
  price,
  value,
  value_type,
  type,
  promo_code,
  valid_from,
  valid_to,
}: Props) {
  const handleCopy = () => {
    if (promo_code) {
      navigator.clipboard.writeText(promo_code);
      toast.success("Đã sao chép mã khuyến mãi!");
    }
  };

  const getValueDisplay = () => {
    if (!value || !value_type) return null;
    return value_type === "percent"
      ? `Giảm ${value * 100}%`
      : `Giảm ${value.toLocaleString("vi-VN")}₫`;
  };

  const getTypeLabel = () => {
    switch (type) {
      case "promo_code":
        return "Mã giảm giá";
      case "early_bird":
        return "Đặt sớm";
      case "user_level":
        return "Ưu đãi thành viên";
      case "seasonal":
        return "Khuyến mãi theo mùa";
      case "length_of_stay":
        return "Ưu đãi dài ngày";
      default:
        return "Khuyến mãi đặc biệt";
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="tw-fixed tw-inset-0 tw-bg-black/70 tw-z-[9999] tw-flex tw-items-center tw-justify-center tw-backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="tw-bg-[#1f1f1f] tw-rounded-2xl tw-shadow-xl tw-w-[500px] tw-max-w-[90%] tw-p-6 tw-space-y-4 tw-text-white"
            initial={{ scale: 0.8, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 30, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="tw-text-2xl tw-font-bold tw-text-[#FAB320]">
              {title}
            </h5>

            {image && (
              <Image
                src={image}
                alt={title}
                width={500}
                height={240}
                className="tw-w-full tw-h-60 tw-object-cover tw-rounded-lg"
              />
            )}

            <p className="tw-text-sm tw-text-gray-300">{description}</p>

            <div className="tw-space-y-2 tw-text-sm">
              <p>
                <span className="tw-text-white/60">Loại giảm giá:</span>{" "}
                <span className="tw-text-[#FAB320] tw-font-semibold">
                  {getTypeLabel()}
                </span>
              </p>

              {promo_code && (
                <div className="tw-flex tw-items-center tw-gap-2">
                  <span className="tw-font-semibold text-white">Mã:</span>{" "}
                  <span className="tw-bg-white/10 tw-px-2 tw-py-1 tw-rounded tw-text-yellow-300">
                    {promo_code}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className="tw-bg-[#FAB320] tw-text-black tw-px-3 tw-py-1 tw-rounded-md tw-font-semibold hover:tw-bg-yellow-400"
                  >
                    Sao chép
                  </motion.button>
                </div>
              )}

              <p>
                <span className="tw-text-white/60">Mức giảm:</span>{" "}
                <span className="tw-text-[#FAB320] tw-font-semibold">
                  {getValueDisplay()}
                </span>
              </p>

              {(valid_from || valid_to) && (
                <p>
                  <span className="tw-text-white/60">Thời gian áp dụng:</span>{" "}
                  <span className="tw-text-gray-300">
                    {formatDate(valid_from)} - {formatDate(valid_to)}
                  </span>
                </p>
              )}

              {price !== undefined && (
                <p>
                  <span className="tw-text-white/60">Giá ưu đãi:</span>{" "}
                  <span className="tw-text-[#FAB320] tw-font-bold">
                    {price.toLocaleString("vi-VN")}₫
                  </span>
                </p>
              )}
            </div>

            <div className="tw-text-center tw-pt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="tw-bg-[#FAB320] tw-text-black tw-font-semibold tw-py-2 tw-px-6 tw-rounded-xl hover:tw-bg-yellow-400"
                onClick={onClose}
              >
                Đóng
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DiscountDetailPopup;
