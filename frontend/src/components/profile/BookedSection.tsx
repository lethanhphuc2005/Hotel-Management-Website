import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/dateUtils";
import Pagination from "@/components/Pagination";

export default function BookedRoomSection({ bookings }: { bookings: any[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalItems = bookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = bookings.slice(startIndex, endIndex);
  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  const [expandedId, setExpandedId] = useState<string | null>(null);
  if (!bookings || bookings.length === 0) {
    return (
      <div className="tw-text-center tw-text-gray-400">
        Bạn chưa đặt phòng nào.
      </div>
    );
  }
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getColorClass = (status: string) => {
    switch (status) {
      case "CHECKED_IN":
        return "tw-bg-green-500 tw-text-white";
      case "CHECKED_OUT":
        return "tw-bg-red-500 tw-text-white";
      case "CANCELLED":
        return "tw-bg-gray-500 tw-text-white";
      case "PENDING":
        return "tw-bg-amber-500 tw-text-black";
      case "CONFIRMED":
        return "tw-bg-blue-600 tw-text-white";
      default:
        return "tw-bg-yellow-400 tw-text-black";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="tw-space-y-4"
    >
      {currentBookings?.map((booking: any) => {
        const isCheckedOut = booking.booking_status_id?.code === "CHECKED_OUT";
        const payment = booking.payment;

        return (
          <div
            key={booking.id}
            className="tw-p-4 tw-rounded-xl tw-border tw-border-gray-700 tw-bg-black/50"
          >
            <div
              className="tw-flex tw-gap-4 tw-cursor-pointer"
              onClick={() => toggleExpand(booking.id)}
            >
              <div className="tw-space-y-2">
                <h3 className="tw-text-lg tw-font-bold tw-text-white">
                  {booking.booking_details?.[0]?.room_class_id?.name ||
                    "Không rõ loại phòng"}
                </h3>
                <p className="tw-text-sm tw-text-gray-400">
                  Ngày đến: {formatDate(booking.check_in_date)} - Ngày đi:{" "}
                  {formatDate(booking.check_out_date)}
                </p>
                <p className="tw-text-sm tw-text-gray-400">
                  Số người lớn: {booking.adult_amount || 0} - Số trẻ em:{" "}
                  {booking.child_amount || 0}
                </p>
                <p className="tw-text-sm tw-text-gray-300">
                  Thông tin người đặt:
                </p>
                <ul className="tw-list-disc tw-text-gray-300">
                  <li>Họ và tên: {booking.full_name || "Không rõ"}</li>
                  <li>Số điện thoại: {booking.phone_number || "Không rõ"}</li>
                  <li>Email: {booking.email || "Không rõ"}</li>
                </ul>
                <span
                  className={`tw-inline-block tw-px-3 tw-py-1 tw-text-xs tw-font-semibold tw-rounded-full tw-uppercase ${getColorClass(
                    booking.booking_status_id?.code
                  )}`}
                >
                  {booking.booking_status_id?.name}
                </span>
              </div>
            </div>

            <AnimatePresence>
              {expandedId === booking.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="tw-overflow-hidden tw-mt-4 tw-text-gray-300 tw-text-sm"
                >
                  <div className="tw-w-full tw-max-w-3xl tw-mx-auto tw-flex tw-flex-col tw-gap-6">
                    {booking.booking_details?.map((detail: any) => {
                      const room = detail?.room_id;
                      const roomClass =
                        room?.room_class_id || detail?.room_class_id;
                      return (
                        <div
                          key={roomClass.main_room_clas_id || roomClass.id}
                          className="tw-border-t tw-border-gray-600 tw-pt-4 tw-flex tw-gap-4 tw-items-start"
                        >
                          <div className="tw-w-[50%] tw-h-[300px] tw-relative tw-flex tw-items-center tw-justify-center">
                            <motion.img
                              initial={{ x: -30, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              src={`http://localhost:8000/images/${
                                roomClass?.images?.[0]?.url || "no-image.jpg"
                              }`}
                              alt="room"
                              className="tw-w-full tw-h-full tw-object-cover tw-object-center"
                            />
                          </div>

                          <motion.div
                            initial={{ x: 30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="tw-flex-1 tw-space-y-2"
                          >
                            <p>
                              <strong>Phòng:</strong> {room?.name || "Chưa gán"}{" "}
                              {room?.floor && `- Tầng ${room.floor}`}
                            </p>
                            <p>
                              <strong>Dịch vụ:</strong>
                            </p>
                            <ul className="tw-list-disc tw-ml-6">
                              {detail?.services?.length > 0 ? (
                                detail.services.map((s: any) => (
                                  <li key={s.id}>
                                    {s.service_id.name} - {s.amount}x -{" "}
                                    {s.service_id.price.toLocaleString("vi-VN")}
                                    ₫
                                  </li>
                                ))
                              ) : (
                                <li>Không sử dụng dịch vụ</li>
                              )}
                            </ul>
                          </motion.div>
                        </div>
                      );
                    })}

                    <motion.div
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="tw-space-y-2 tw-border-t tw-border-gray-600 tw-pt-4"
                    >
                      <p>
                        <strong>Yêu cầu:</strong>{" "}
                        {booking.request || "Không có"}
                      </p>
                      <p>
                        <strong>Ghi chú:</strong> {booking.note || "Không có"}
                      </p>
                      <p>
                        <strong>Thời gian đặt:</strong>{" "}
                        {formatDate(booking.createdAt)}
                      </p>
                      <p>
                        <strong>Hình thức:</strong>{" "}
                        {booking.booking_method_id?.name || "Không xác định"}
                      </p>
                      <strong>Thanh toán:</strong>{" "}
                      {payment && payment.length > 0 ? (
                        <ul className="tw-list-disc tw-ml-6">
                          {payment.map((p: any) => (
                            <li key={p.id}>
                              {p.payment_method_id.name} -{" "}
                              {p.amount.toLocaleString("vi-VN")}₫ - {p.status}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "Chưa thanh toán"
                      )}
                      <p>
                        <strong>Tổng tiền:</strong>{" "}
                        {booking.total_price.toLocaleString("vi-VN")}₫
                      </p>
                      {isCheckedOut && (
                        <motion.button
                          onClick={() =>
                            toast.success("Cảm ơn bạn đã sử dụng dịch vụ!")
                          }
                          transition={{ delay: 0 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-full tw-border-none"
                        >
                          Đánh giá
                        </motion.button>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
      {totalPages > 1 && (
        <Pagination
          pageCount={totalPages}
          onPageChange={handlePageChange}
          forcePage={currentPage - 1}
        />
      )}
    </motion.div>
  );
}
