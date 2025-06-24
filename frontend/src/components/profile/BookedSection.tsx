import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function BookedRoomSection({ bookings }: { bookings: any[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {bookings?.map((booking: any) => {
        const detail = booking.booking_details?.[0];
        const room = detail?.room_id;
        const roomClass = room?.room_class_id || detail?.room_class_id;
        const isCheckedOut = booking.booking_status_id?.code === "CHECKED_OUT";
        const payment = booking.payment;

        return (
          <div
            key={booking._id}
            className="p-4 rounded-xl border border-gray-700 bg-[#0f172a]"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              style={{ display: "flex", gap: "1rem", cursor: "pointer" }}
              onClick={() => toggleExpand(booking._id)}
            >
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">
                  {roomClass?.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {new Date(booking.check_in_date).toLocaleDateString()} →{" "}
                  {new Date(booking.check_out_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-400">
                  {booking.booking_status_id?.name}
                </p>
              </div>
            </div>

            <AnimatePresence>
              {expandedId === booking._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-4 text-gray-300 text-sm"
                >
                  <div className="w-full max-w-3xl mx-auto">
                    <div
                      className="flex gap-4 items-start"
                      style={{ display: "flex" }}
                    >
                      <div
                        className="w-[200px] h-[140px] overflow-hidden rounded-xl flex-shrink-0 bg-gray-800 flex items-center justify-center"
                        style={{
                          width: "50%",
                          height: "500px",
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <motion.img
                          initial={{ x: -30, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          src={
                            "http://localhost:8000/images/" +
                            (roomClass?.images?.[0]?.url || "no-image.jpg")
                          }
                          alt="room"
                          className="w-full h-full object-cover"
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                            objectPosition: "center",
                            position: "relative",
                          }}
                        />
                      </div>

                      <motion.div
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 space-y-2"
                      >
                        <p>
                          <strong>Phòng:</strong> {room?.name || "Chưa gán"}{" "}
                          {room?.floor && `- Tầng ${room.floor}`}
                        </p>
                        <p>
                          <strong>Yêu cầu:</strong>{" "}
                          {booking.request || "Không có"}
                        </p>
                        <p>
                          <strong>Ghi chú:</strong> {booking.note || "Không có"}
                        </p>

                        <p>
                          <strong>Thời gian đặt:</strong>{" "}
                          {new Date(booking.booking_date).toLocaleString()}
                        </p>

                        <p>
                          <strong>Hình thức:</strong>{" "}
                          {booking.booking_method_id?.name || "Không xác định"}
                        </p>

                        <p>
                          <strong>Thanh toán:</strong>{" "}
                          {payment && payment.length > 0 ? (
                            <ul className="list-disc ml-6">
                              {payment.map((p: any) => (
                                <li key={p._id}>
                                  {p.payment_method_id.name} -{" "}
                                  {p.amount.toLocaleString("vi-VN")} -{" "}
                                  {p.status}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            "Chưa thanh toán"
                          )}
                        </p>

                        <p>
                          <strong>Dịch vụ:</strong>
                        </p>
                        <ul className="list-disc ml-6">
                          {detail?.services?.length > 0 ? (
                            detail?.services.map((s: any) => (
                              <li key={s._id}>
                                {s.service_id.name} -{" "}
                                {s.service_id.price.toLocaleString("vi-VN")}₫
                              </li>
                            ))
                          ) : (
                            <li>Không sử dụng dịch vụ</li>
                          )}
                        </ul>

                        <p>
                          <strong>Tổng tiền:</strong>{" "}
                          {booking.total_price.toLocaleString("vi-VN")}₫
                        </p>

                        {isCheckedOut && (
                          <motion.button
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mt-3 px-4 py-2 bg-[#fab320] text-black font-semibold rounded-lg hover:opacity-90"
                          >
                            Đánh giá
                          </motion.button>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
