"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Props {
  open: boolean;
  onSelect: (roomId: string) => void;
  onClose: () => void;
}

export default function SelectRoomModal({ open, onSelect, onClose }: Props) {
  const cartRooms = useSelector((state: RootState) => state.cart.rooms);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="tw-fixed tw-inset-0 tw-z-[9999] tw-flex tw-items-center tw-justify-center tw-bg-black/70 tw-backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="tw-bg-white tw-rounded-2xl tw-shadow-lg tw-w-[400px] tw-max-w-[90%] tw-p-6"
            initial={{ scale: 0.8, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 30, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="tw-text-center tw-font-bold tw-text-lg tw-text-black tw-mb-4">
              Chọn phòng để thêm dịch vụ
            </h5>

            <ul className="tw-space-y-2 tw-mb-4">
              {cartRooms.map((room) => (
                <li
                  key={room.id}
                  className="tw-flex tw-justify-between tw-items-center tw-bg-gray-100 tw-rounded-md tw-py-2 tw-px-4 tw-cursor-pointer hover:tw-bg-gray-200"
                  onClick={() => onSelect(room.id)}
                >
                  <span className="tw-font-medium tw-text-black">
                    {room.name}
                  </span>
                  <i className="bi bi-plus-circle-fill tw-text-green-600 tw-text-lg"></i>
                </li>
              ))}
            </ul>

            <div className="tw-text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="tw-bg-[#FAB320] tw-text-black tw-font-semibold tw-px-4 tw-py-2 tw-rounded-md hover:tw-bg-yellow-400"
                onClick={onClose}
              >
                Hủy
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
