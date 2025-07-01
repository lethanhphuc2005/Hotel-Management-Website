"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  image?: string;
  description: string;
  price?: number;
}

function ServiceDetailPopup({
  open,
  onClose,
  title,
  image,
  description,
  price,
}: Props) {
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
            className="tw-bg-black tw-rounded-2xl tw-shadow-xl tw-w-[500px] tw-max-w-[90%] tw-p-6 tw-space-y-4 tw-text-white"
            initial={{ scale: 0.8, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 30, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="tw-text-xl tw-font-bold tw-text-[#FAB320]">
              {title}
            </h5>

            {image && (
              <Image
                src={image}
                alt={title}
                width={500}
                height={240}
                className="tw-w-full tw-h-60 tw-object-cover tw-rounded-lg tw-mb-4"
              />
            )}

            <p className="tw-text-sm tw-text-gray-300">{description}</p>

            {price !== undefined && (
              <p className="tw-font-bold tw-text-lg">
                Giá:{" "}
                <span className="tw-text-[#FAB320]">
                  {price.toLocaleString("vi-VN")} VNĐ
                </span>
              </p>
            )}

            <div className="tw-text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="tw-bg-[#FAB320] tw-text-black tw-font-semibold tw-py-2 tw-px-6 tw-rounded hover:tw-bg-yellow-400"
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

export default ServiceDetailPopup;