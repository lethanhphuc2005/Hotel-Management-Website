"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/contexts/store";
import { addServiceToRoom } from "@/contexts/cartSlice";
import { Service } from "@/types/service";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Image from "next/image";
import ServiceDetailPopup from "@/components/modals/ServiceDetailModal";
import { AnimatedButtonPrimary } from "@/components/common/Button";
import SelectRoomModal from "@/components/modals/SelecteServiceModal";

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
          image: item.image.url,
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
      <ServiceDetailPopup
        open={showDetailPopup}
        onClose={() => setShowDetailPopup(false)}
        title={item.name}
        image={item.image.url}
        description={item.description}
        price={item.price}
      />
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
          src={item.image.url}
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

        <AnimatedButtonPrimary
          className="tw-w-full tw-py-3"
          onClick={(e) => {
            e.stopPropagation();
            handleAddService();
          }}
        >
          Thêm
        </AnimatedButtonPrimary>
      </motion.div>
      {/* === POPUP CHỌN PHÒNG === */}
      <SelectRoomModal
        open={showPopup}
        onClose={() => setShowPopup(false)}
        onSelect={handleSelectRoom}
      />
    </>
  );
}
