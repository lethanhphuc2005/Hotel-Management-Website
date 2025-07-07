"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/contexts/store";
import { getRoomTotalPrice } from "@/contexts/cartSelector";
import { clearCart, removeRoomFromCart } from "@/contexts/cartSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import { createBooking } from "@/services/BookingService";
import { useLoading } from "@/contexts/LoadingContext";
import { createPayment } from "@/services/PaymentService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { fetchWalletByUserId } from "@/services/WalletService";
import { formatDate, formatDateForBooking } from "@/utils/dateUtils";
import BookingForm from "@/components/form/BookingForm";
import PaymentMethods from "@/components/pages/payment/PaymentMethod";
import PriceSummary from "@/components/pages/payment/PriceSummary";
import RoomCartItem from "@/components/pages/payment/RoomCardItem";
import InformationSection from "@/components/pages/payment/InformationSection";
import { formatCurrencyVN } from "@/utils/currencyUtils";
import { fetchPreviewDiscountBookingPrice } from "@/services/DiscountService";

export default function PayMent() {
  const { user } = useAuth();
  const { setLoading } = useLoading();

  const rooms = useSelector((state: RootState) => state.cart.rooms);
  const dispatch = useDispatch();

  const total = rooms.reduce((sum, room) => {
    const roomTotal = getRoomTotalPrice(room);
    return sum + roomTotal;
  }, 0);

  const [selectedMethod, setSelectedMethod] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [finalTotal, setFinalTotal] = useState<number>(total);
  const [promoCode, setPromoCode] = useState("");

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

  useEffect(() => {
    const fetchDiscounts = async () => {
      if (rooms.length === 0) return;

      const bookingInfo = {
        baseTotal: total,
        checkInDate: formatDateForBooking(rooms[0].checkIn),
        checkOutDate: formatDateForBooking(rooms[0].checkOut),
        roomClassId: rooms[0].id,
        totalRooms: rooms.length,
      };

      const response = await fetchPreviewDiscountBookingPrice(bookingInfo);
      if (response.success) {
        const data = response.data;
        setDiscounts(data.appliedDiscounts || []);
        setFinalTotal(data.finalPrice || total);
      } else {
        setDiscounts([]);
        setFinalTotal(total);
      }
    };

    fetchDiscounts();
  }, [rooms, user]);

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

  const handlePromoCodeChange = async (code: string) => {
    setPromoCode(code);
    if (code.trim() === "") {
      setDiscounts([]);
      setFinalTotal(total);
      return;
    }
    try {
      const bookingInfo = {
        baseTotal: total,
        checkInDate: formatDateForBooking(rooms[0].checkIn),
        checkOutDate: formatDateForBooking(rooms[0].checkOut),
        roomClassId: rooms[0].id,
        totalRooms: rooms.length,
        promoCode: code.trim(),
      };

      const response = await fetchPreviewDiscountBookingPrice(bookingInfo);
      if (response.success) {
        const data = response.data;
        if (!data.isPromo) {
          toast.error("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
          setFinalTotal(total);
          return;
        } else {
          toast.success("Mã giảm giá đã được áp dụng thành công.");
        }
        setDiscounts(data.appliedDiscounts || []);
        setFinalTotal(data.finalPrice || total);
      } else {
        toast.error(response.message || "Không thể áp dụng mã giảm giá.");
        setDiscounts([]);
        setFinalTotal(total);
      }
    } catch (error) {
      console.error("Lỗi khi áp dụng mã giảm giá:", error);
      toast.error("Lỗi khi áp dụng mã giảm giá. Vui lòng thử lại.");
      setDiscounts([]);
      setFinalTotal(total);
    }
  };

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

    try {
      setLoading(true);
      const payload = {
        user_id: user?.id || null,
        full_name: name,
        email: email,
        phone_number: phone,
        check_in_date: formatDateForBooking(rooms[0].checkIn),
        check_out_date: formatDateForBooking(rooms[0].checkOut),
        adult_amount: rooms.reduce((sum, r) => sum + (r.adults ?? 0), 0),
        child_amount: rooms.reduce(
          (sum, r) => sum + (r.childrenUnder6 ?? 0) + (r.childrenOver6 ?? 0),
          0
        ),
        note: rooms.reduce((notes, r) => {
          let noteStr = "";
          if (r.childrenUnder6 && r.childrenUnder6 > 0) {
            noteStr += `Có ${r.childrenUnder6} trẻ dưới 6 tuổi. `;
          }
          if (r.childrenOver6 && r.childrenOver6 > 0) {
            noteStr += `Có ${r.childrenOver6} trẻ trên 6 tuổi. `;
          }
          return notes + noteStr;
        }, ""),
        discount_id: discounts.map((d) => d.discountId),
        discount_value: discounts.reduce((sum, d) => sum + d.amount, 0),
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
        original_price: total, // Giá gốc trước khi áp dụng khuyến mãi
        total_price: finalTotal,
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
        `Đặt phòng từ ${formatDate(rooms[0].checkIn)} đến ${formatDate(
          rooms[0].checkOut
        )}
        - Tổng tiền: ${formatCurrencyVN(total)}
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

  // Kiểm tra nếu không có phòng nào trong giỏ hàng
  if (rooms.length === 0) {
    return (
      <div
        className="container"
        style={{ marginTop: "120px", marginBottom: "100px" }}
      >
        <div className="alert alert-warning text-center">
          Giỏ hàng của bạn đang trống. Vui lòng thêm phòng trước khi thanh toán.
        </div>
      </div>
    );
  }

  return (
    <div
      className="container"
      style={{ marginTop: "120px", marginBottom: "100px" }}
    >
      <div className="row">
        {/* Left Column - Form & Notes */}
        <div className="col-md-7">
          <BookingForm
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            request={request}
            setRequest={setRequest}
          />

          <InformationSection />
        </div>

        {/* Right Column - Room Info & Price */}
        <div className="col-md-5">
          {rooms.map((room) => (
            <RoomCartItem
              key={room.id}
              room={room}
              onRemove={() => dispatch(removeRoomFromCart(room.id))}
            />
          ))}
          <div className="tw-bg-[#1a1a1a] tw-border tw-border-white/20 tw-text-white tw-rounded-2xl tw-shadow-md tw-p-6 tw-mb-4">
            <p className="tw-font-semibold tw-mb-2 tw-text-primary">
              Mã giảm giá
            </p>

            <div className="tw-flex tw-gap-2">
              <input
                type="text"
                className="tw-flex-1 tw-bg-[#2a2a2a] tw-border tw-border-white/10 tw-rounded-xl tw-text-white tw-px-4 tw-py-2 focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-primary"
                placeholder="Nhập mã giảm giá"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button
                className="tw-bg-primary tw-text-black tw-font-semibold tw-px-4 tw-rounded-xl hover:tw-bg-[#ffc844] tw-transition-all"
                onClick={() => handlePromoCodeChange(promoCode)}
              >
                Áp dụng
              </button>
            </div>
          </div>

          <PaymentMethods
            methods={methods}
            selectedMethod={selectedMethod}
            onSelect={handleSelect}
            walletBalance={walletBalance}
          />

          <PriceSummary
            total={total}
            discounts={discounts}
            onSubmit={handleBooking}
          />
        </div>
      </div>
    </div>
  );
}
