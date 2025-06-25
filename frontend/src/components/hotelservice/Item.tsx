"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/contexts/store";
import { addServiceToRoom } from "@/contexts/cartSlice";
import { Service } from "@/types/service";
import style from "@/app/hotelservice/hotelservice.module.css";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";

export function HotelServiceItem({ item }: { item: Service }) {
  const dispatch = useDispatch();
  const cartRooms = useSelector((state: RootState) => state.cart.rooms);

  const [showPopup, setShowPopup] = useState(false);

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
          id: item._id,
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
      <div
        className={`col p-0 rounded text-white ${style.box}`}
        style={{ backgroundColor: "#1F1F1F" }}
      >
        <img
          className="p-2 object-fit-cover"
          style={{ borderRadius: "15px", width: "100%", height: "200px" }}
          src={`/img/${item.image}`}
          alt=""
        />
        <h5 className="mt-2 ms-2">{item.name}</h5>
        <p className="ms-2" style={{ fontSize: "14px" }}>
          {item.description}
        </p>
        <div className="d-flex gap-3 ms-2">
          <p className="">Giá chỉ từ:</p>
          <p className="fw-bold" style={{ color: "#FAB320" }}>
            {item.price.toLocaleString("vi-VN")} VNĐ
          </p>
        </div>
        <div className={style.btnWrapper}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={style.bookingBtn}
            onClick={handleAddService}
          >
            Thêm
          </motion.button>
        </div>
      </div>
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
