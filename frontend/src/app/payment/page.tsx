"use client";
import { useDispatch, useSelector } from "react-redux";
import style from "./page.module.css";
import { RootState } from "@/contexts/store";
import { getRoomTotalPrice } from "@/contexts/cartSelector";
import { clearCart, removeRoomFromCart } from "@/contexts/cartSlice";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createBooking } from "@/services/BookingService";
import { useLoading } from "@/contexts/LoadingContext";
import { createPayment } from "@/services/PaymentService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import {
  fetchWalletByUserId,
  useWalletByUserId,
} from "@/services/WalletService";

const formatVietnameseDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split("/").map(Number);
  const date = new Date(year, month - 1, day); // chú ý: tháng tính từ 0

  return date.toLocaleDateString("vi-VN", {
    weekday: "long", // Thứ hai, ba, tư, ...
    day: "numeric",
    month: "long", // tháng 5, tháng 6...
  });
};

export default function PayMent() {
  const { user } = useAuth();
  const { setLoading } = useLoading();

  const rooms = useSelector((state: RootState) => state.cart.rooms);
  const dispatch = useDispatch();
  const router = useRouter();

  const [selectedMethod, setSelectedMethod] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);

  const handleSelect = (value: string) => {
    setSelectedMethod(value);
  };

  useEffect(() => {
    const fetchWallet = async () => {
      if (!user || !user.id) return;
      try {
        const response = await fetchWalletByUserId(user.id);
        if (!response.success) {
          throw new Error(response.message || "Không thể lấy thông tin ví.");
        }
        const data = response.data;
        setWalletBalance(data.balance || 0);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin ví:", error);
        toast.error("Không thể lấy thông tin ví. Vui lòng thử lại sau.");
      }
    };
    fetchWallet();
  }, [user]);

  const methods = [
    {
      label: "Thanh toán qua ZaloPay",
      value: "zalopay",
      icon: <img src="/img/zalopay.png" alt="Momo" style={{ width: 32 }} />,
    },
    {
      label: "Thanh toán qua Momo",
      value: "momo",
      icon: <img src="/img/momo.png" alt="Momo" style={{ width: 32 }} />,
    },
    {
      label: "Thanh toán qua VNPAY",
      value: "vnpay",
      icon: <img src="/img/vnpay.jpg" alt="VNPAY" style={{ width: 32 }} />,
    },
    {
      label: "Thanh toán tiền mặt tại nơi ở",
      value: "cash",
      icon: <FontAwesomeIcon icon={faMoneyBill} className=" tw-text-2xl" />,
    },
  ];
  const total = rooms.reduce((sum, room) => {
    const roomTotal = getRoomTotalPrice(room);
    return sum + roomTotal;
  }, 0);

  if (user && user.id && walletBalance > total) {
    methods.push({
      label: "Thanh toán qua ví",
      value: "wallet",
      icon: <FontAwesomeIcon icon={faWallet} className=" tw-text-2xl" />,
    });
  }

  const [name, setName] = useState(
    user?.last_name + " " + user?.first_name || ""
  );
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone_number || "");
  const [request, setRequest] = useState(user?.request);

  const handleBooking = async () => {
    if (rooms.length === 0) {
      toast.error("Không có phòng nào trong giỏ hàng.");
      return;
    }
    if (name === "" && email === "" && phone === "") {
      toast.info("Vui lòng nhập thông tin cá nhân để đặt phòng.");
      return;
    }
    if (!selectedMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán.");
      return;
    }

    // format date to YYYY-MM-DD
    const formatDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split("/").map(Number);
      return `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
    };
    try {
      setLoading(true);
      const payload = {
        user_id: user?.id || null,
        full_name: name,
        email: email,
        phone_number: phone,
        check_in_date: formatDate(rooms[0].checkIn),
        check_out_date: formatDate(rooms[0].checkOut),
        adult_amount: rooms.reduce((sum, r) => sum + (r.adults ?? 0), 0),
        child_amount: rooms.reduce(
          (sum, r) => sum + (r.childrenUnder6 ?? 0) + (r.childrenOver6 ?? 0),
          0
        ),
        booking_method_id: "684126db1ce6a19c45c2ec0a",
        booking_status_id: "683fba8d351a96315d45767a", // pending
        request: request || "Không có",
        booking_details: rooms.map((room) => ({
          room_class_id: room.id,
          price_per_night: room.price,
          nights: room.nights,
          services: room.services?.map((s) => ({
            amount: s.quantity,
            service_id: s.id,
          })),
        })),
        total_price: total,
      };

      const response = await createBooking(payload);
      if (!response.success) {
        toast.error(response.message || "Lỗi khi tạo đơn đặt phòng.");
        return;
      }

      const data = response.data;

      // Sang API để tạo thanh toán
      if (!data || !data.id) {
        throw new Error("Không thể xác định mã đơn đặt phòng.");
      }

      const paymentResponse = await createPayment(
        selectedMethod,
        data?.id as string, // orderId
        `Đặt phòng từ ${formatVietnameseDate(
          rooms[0].checkIn
        )} đến ${formatVietnameseDate(rooms[0].checkOut)}
        - Tổng tiền: ${total.toLocaleString("vi-VN")} VNĐ
        - Phương thức: ${selectedMethod}`,
        total
      );
      if (!paymentResponse.success) {
        toast.error(
          paymentResponse.message || "Lỗi khi tạo yêu cầu thanh toán."
        );
        return;
      }
      // Redirect đến trang thanh toán
      if (paymentResponse.data.payUrl) {
        dispatch(clearCart()); // Xóa giỏ hàng sau khi đặt thành công
        window.location.href = paymentResponse.data.payUrl;
        return;
      } else {
        dispatch(clearCart()); // Xóa giỏ hàng sau khi đặt thành công
        window.location.href = `/thank-you?orderId=${data?.id}`;
      }

      // Optional: redirect
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi đặt phòng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container"
      style={{ marginTop: "120px", marginBottom: "100px" }}
    >
      <div className="row">
        {/* Left Column - Form & Notes */}
        <div className="col-md-7">
          <div className="card mb-4 p-4 bg-black border text-white">
            <h5>Nhập thông tin chi tiết của bạn</h5>
            <div className="d-flex gap-2 border p-3 rounded mt-2 mb-5">
              <i className="bi bi-exclamation-circle-fill"></i>
              <p className="mb-0">
                Gần xong rồi! Chỉ cần điền phần thông tin{" "}
                <span style={{ color: "red" }}>*</span> bắt buộc <br />
                Vui lòng nhập thông tin của bạn bằng kí tự Latin để chỗ nghỉ có
                thể hiểu được
              </p>
            </div>
            <form className={style.form}>
              <div className="row">
                <div className="mb-3">
                  <label className="form-label">
                    Họ và tên <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control bg-black text-white"
                    placeholder="VD: Lê Thành Phúc"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Số điện thoại <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="tel"
                  className="form-control bg-black text-white"
                  placeholder="VD: 0123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Địa chỉ email <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="email"
                  className="form-control bg-black text-white"
                  placeholder="VD: example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Yêu cầu đặc biệt</label>
                <textarea
                  className="form-control bg-black text-white"
                  placeholder="VD: Tôi cần một phòng yên tĩnh, không có tiếng ồn"
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                />
              </div>
            </form>
          </div>

          <div className="card mb-4 p-4 bg-black border text-white">
            <h6 className="fw-bold" style={{ color: "#FAB320" }}>
              Mách nhỏ:
            </h6>
            <ul className="mb-0 list-unstyled">
              <li>
                <i className="bi bi-stars me-2"></i> Căn hộ sạch bong
              </li>
              <li>
                <i className="bi bi-cash me-2"></i> Giá tốt nhất hôm nay
              </li>
              <li>
                <i className="bi bi-credit-card-fill me-2"></i> Thanh toán ngay
                để có phòng ưng ý
              </li>
              <li>
                <i className="bi bi-check2-circle me-2"></i> Miễn phí: hủy, đổi
                ngày, đặt lại phòng
              </li>
            </ul>
          </div>

          <div className="card mb-4 p-4 bg-black border text-white">
            <h6 className="fw-bold" style={{ color: "#FAB320" }}>
              Lưu ý:
            </h6>
            <p className="mb-2">
              <i className="bi bi-check2-circle me-2"></i> Hủy miễn phí trước:{" "}
              <strong style={{ color: "#FAB320" }}>
                14:00, Thứ 5, 9 tháng 5, 2025
              </strong>
            </p>
            <p>
              <i className="bi bi-alarm me-2"></i> Từ 14:00 ngày 10 tháng 5:{" "}
              <strong style={{ color: "#FAB320" }}>VND 1.417.500</strong>
            </p>
          </div>

          <div className="card p-4 bg-black border text-white">
            <h6 className="fw-bold" style={{ color: "#FAB320" }}>
              Xem lại quy tắc chung:
            </h6>
            <ul className="list-unstyled">
              <li>
                <i className="bi bi-ban me-2"></i> Không hút thuốc
              </li>
              <li>
                <i className="bi bi-bluesky me-2"></i> Không thú cưng
              </li>
              <li>
                <i className="bi bi-hourglass-top me-2"></i> Thời gian nhận
                phòng từ 14:00
              </li>
              <li>
                <i className="bi bi-hourglass-bottom me-2"></i> Thời gian trả
                phòng từ 12:00
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column - Room Info & Price */}
        <div className="col-md-5">
          {rooms.length === 0 ? (
            <div className="alert alert-warning text-center">
              Giỏ hàng của bạn đang trống. Vui lòng thêm phòng trước khi thanh
              toán.
            </div>
          ) : (
            rooms.map((room) => (
              <div
                className="card mb-4 bg-black border text-white"
                key={room.id}
              >
                <img
                  className="card-img-top p-3"
                  src="/img/r1.jpg"
                  alt="room"
                  style={{ height: "300px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title mb-3" style={{ color: "#FAB320" }}>
                    {room.name} - {room.price.toLocaleString("vi-VN")} VNĐ/đêm
                  </h5>
                  <div className="mb-2">
                    {room.features && room.features.length > 0 && (
                      <p className="mb-1">
                        Tiện nghi:
                        {room.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="badge bg-secondary ms-1">
                            {feature}
                          </span>
                        ))}
                        {room.features.length > 3 && (
                          <span className="badge bg-secondary ms-1">
                            +{room.features.length - 3}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                  <p className="mb-1">
                    Nhận phòng:{" "}
                    <strong>{formatVietnameseDate(room.checkIn)}</strong>
                  </p>
                  <p className="mb-1">
                    Trả phòng:{" "}
                    <strong>{formatVietnameseDate(room.checkOut)}</strong>
                  </p>
                  <p className="mb-1">
                    Số đêm:{" "}
                    <strong>
                      {room.nights} đêm - {room.bedAmount} giường đôi
                    </strong>
                  </p>
                  <p className="mb-1">
                    {room.services && room.services.length > 0 && (
                      <>
                        Dịch vụ:
                        {room.services.map((service, index) => (
                          <span key={index} className="badge bg-secondary ms-1">
                            {service.name} - {service.quantity}x -{" "}
                            {service.price.toLocaleString("vi-VN")} VNĐ
                          </span>
                        ))}
                      </>
                    )}
                  </p>
                  <p className="mb-1">
                    Số khách:{" "}
                    <strong>
                      {room.adults} người lớn,{" "}
                      {room.childrenOver6 ? room.childrenOver6 : 0} trẻ em,{" "}
                      {room.childrenUnder6 ? room.childrenUnder6 : 0} trẻ nhỏ
                    </strong>
                  </p>
                  <p className="mb-1">
                    Tổng giá:{" "}
                    <strong>
                      {getRoomTotalPrice(room).toLocaleString("vi-VN")} VNĐ
                    </strong>
                  </p>
                  <p className="mb-1">
                    Phụ thu cuối tuần:{" "}
                    <strong>
                      {room.hasSaturdayNight || room.hasSundayNight
                        ? "+50% phụ thu do có đêm cuối tuần"
                        : "Không có phụ thu"}
                    </strong>
                  </p>
                  <button
                    className="btn btn-outline-danger w-100 mt-2"
                    onClick={() => dispatch(removeRoomFromCart(room.id))}
                  >
                    Xóa khỏi giỏ
                  </button>
                </div>
              </div>
            ))
          )}

          <div className="card p-4 mt-4 bg-black border text-white mb-4">
            <h6 className="fw-bold mb-4" style={{ color: "#FAB320" }}>
              Phương thức thanh toán
            </h6>

            <div className="d-flex flex-column gap-3">
              {methods.map((method) => (
                <motion.label
                  key={method.value}
                  className="payment-option border p-3 rounded d-flex align-items-center gap-3"
                  variants={{
                    selected: {
                      backgroundColor: "#FAB320",
                      color: "black",
                      borderColor: "#FAB320",
                    },
                    unselected: {
                      backgroundColor: "transparent",
                      color: "white",
                      borderColor: "white",
                    },
                  }}
                  animate={
                    selectedMethod === method.value ? "selected" : "unselected"
                  }
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleSelect(method.value)}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    className="form-check-input mt-0"
                    checked={selectedMethod === method.value}
                    onChange={() => handleSelect(method.value)}
                  />
                  {method.icon}
                  <span className="fw-semibold">{method.label}</span>
                  {method.value === "wallet" && (
                    <span className="tw-text-secondary ms-auto">
                      {walletBalance.toLocaleString("vi-VN")} VNĐ
                    </span>
                  )}
                </motion.label>
              ))}
            </div>
          </div>

          <div className="card p-4 bg-black border text-white">
            <h6 className="fw-bold" style={{ color: "#FAB320" }}>
              Tóm tắt giá
            </h6>
            <div className="row mb-2">
              <div className="col">Tạm tính</div>
              <div className="col text-end">
                VND {total.toLocaleString("vi-VN")}
              </div>
            </div>
            <div className="row mb-2">
              <div className="col">Phí dịch vụ</div>
              <div className="col text-end text-success">Miễn phí</div>
            </div>
            <hr />
            <div className="row">
              <div className="col fw-bold">Tổng cộng</div>
              <div
                className="col text-end fw-bold fs-5"
                style={{ color: "#FAB320" }}
              >
                VND {total.toLocaleString("vi-VN")}
              </div>
            </div>
            <button
              className="btn mt-4 w-100 text-black"
              style={{ backgroundColor: "#FAB320", height: "50px" }}
              onClick={handleBooking}
            >
              Hoàn tất đặt phòng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
