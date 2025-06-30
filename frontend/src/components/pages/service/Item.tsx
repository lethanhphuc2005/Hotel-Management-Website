"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/contexts/store";
import { addServiceToRoom } from "@/contexts/cartSlice";
import { Service } from "@/types/service";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Image from "next/image";

export function HotelServiceItem({ item }: { item: Service }) {
  const dispatch = useDispatch();
  const cartRooms = useSelector((state: RootState) => state.cart.rooms);
  const [showPopup, setShowPopup] = useState(false);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [ref, controls] = useScrollAnimation(0.2, false);

  const handleAddService = () => {
    if (cartRooms.length === 0) {
      toast.error(
        "Bạn chưa có phòng nào trong giỏ hàng. Vui lòng thêm phòng trước khi thêm dịch vụ."
      );
      return;
    }
    setShowPopup(true); // Mở popup chọn phòng
  };

  const handleSelectRoom = (roomId: string) => {
    dispatch(
      addServiceToRoom({
        roomId,
        service: {
          id: item.id,
          name: item.name,
          image: item.image ? item.image : "default.jpg",
          description: item.description,
          price: item.price,
          quantity: 1,
        },
      })
    );
    toast.success(`Đã thêm dịch vụ "${item.name}" vào phòng thành công!`);
    setShowPopup(false); // Đóng popup sau khi thêm
  };

  return (
    <>
      <AnimatePresence>
        {showDetailPopup && (
          <motion.div
            className="tw-fixed tw-inset-0 tw-bg-black/70 tw-z-[9999] tw-flex tw-items-center tw-justify-center tw-backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetailPopup(false)} // Đóng khi click nền
          >
            <motion.div
              className="tw-bg-black tw-rounded-2xl tw-shadow-xl tw-w-[500px] tw-max-w-[90%] tw-p-6 tw-relative tw-space-y-4"
              initial={{ scale: 0.8, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 30, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h5 className="tw-text-xl tw-font-bold tw-text-primary">
                {item.name}
              </h5>
              <Image
                src={`http://localhost:8000/images/${item.image}`}
                alt={item.name}
                width={500}
                height={240}
                priority={false}
                loading="lazy"
                className="tw-w-full tw-h-60 tw-object-cover tw-rounded-lg tw-mb-4"
              />
              <p className="tw-text-gray-400 tw-text-sm">{item.description}</p>
              <p className="tw-font-bold tw-text-lg">
                Giá:{" "}
                <span className="tw-text-primary">
                  {item.price.toLocaleString("vi-VN")} VNĐ
                </span>
              </p>
              <div className="tw-text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="tw-bg-primary tw-text-black tw-px-6 tw-py-2 tw-rounded-md tw-transition hover:tw-bg-primaryHover hover:tw-shadow-glow"
                  onClick={() => setShowDetailPopup(false)}
                >
                  Đóng
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="tw-bg-black tw-text-white tw-p-4 tw-rounded-xl tw-shadow-md tw-space-y-3 tw-h-full tw-cursor-pointer"
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
        <p className="tw-font-lora tw-text-gray-400 tw-line-clamp-1">
          {item.description}
        </p>

        <div className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-items-center sm:tw-justify-between">
          <p className="tw-text-sm">Giá chỉ từ:</p>
          <p className="tw-font-bold tw-text-[#FAB320] tw-text-base">
            {item.price.toLocaleString("vi-VN")} VNĐ
          </p>
        </div>

        <motion.button
          className="tw-bg-[#FAB320] tw-text-black tw-px-4 tw-py-2 tw-rounded-md tw-w-full tw-transition-all hover:tw-bg-primaryHover hover:tw-shadow-glow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            handleAddService();
          }}
        >
          Thêm
        </motion.button>
      </motion.div>

      {/* === POPUP CHỌN PHÒNG === */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              zIndex: 9999,
              backdropFilter: "blur(4px)",
            }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            <motion.div
              className="p-4 bg-white rounded-4 shadow-lg"
              style={{ width: "400px", maxWidth: "90%" }}
              initial={{ scale: 0.8, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 30, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <h5 className="mb-4 text-center text-dark fw-bold">
                Chọn phòng để thêm dịch vụ
              </h5>
              <ul className="list-group mb-4">
                {cartRooms.map((room) => (
                  <li
                    key={room.id}
                    className="list-group-item d-flex justify-content-between align-items-center rounded-3 mb-2"
                    style={{
                      cursor: "pointer",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #eee",
                    }}
                    onClick={() => handleSelectRoom(room.id)}
                  >
                    <span className="fw-medium">{room.name}</span>
                    <i className="bi bi-plus-circle-fill text-success fs-5"></i>
                  </li>
                ))}
              </ul>
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn px-4"
                  style={{
                    backgroundColor: "#FAB320",
                    color: "#000",
                    fontWeight: "bold",
                    border: "none",
                  }}
                  onClick={() => setShowPopup(false)}
                >
                  Hủy
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
