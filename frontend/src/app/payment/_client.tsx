"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { clearCart, removeRoomFromCart } from "@/store/cartSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import { createBooking } from "@/services/BookingService";
import { useLoading } from "@/contexts/LoadingContext";
import { createPayment } from "@/services/PaymentService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { formatDate, formatDateForBooking } from "@/utils/dateUtils";
import BookingForm from "@/components/form/BookingForm";
import PaymentMethods from "@/components/pages/payment/PaymentMethod";
import PriceSummary from "@/components/pages/payment/PriceSummary";
import RoomCartItem from "@/components/pages/payment/RoomCardItem";
import InformationSection from "@/components/pages/payment/InformationSection";
import { formatCurrencyVN } from "@/utils/currencyUtils";
import { fetchPreviewDiscountBookingPrice } from "@/services/DiscountService";
import getCancelPolicyTimeline from "@/utils/getCancelPolicy";
import { useSearchParams } from "next/navigation";
import { CreateBookingRequest } from "@/types/booking";
import { AppliedDiscount } from "@/types/discount";
import { useUserWallet } from "@/hooks/data/useWallet";
import { useRouter } from "next/navigation";
import { getRoomTotalPrice } from "@/store/cartSelector";

export default function PayMent() {
  const router = useRouter();
  const { user } = useAuth();
  const { setLoading } = useLoading();
  const { wallet, mutate } = useUserWallet(user?.id || "");

  const rooms = useSelector((state: RootState) => state.cart.rooms);
  const dispatch = useDispatch();

  const total = rooms.reduce((sum, room) => {
    return sum + getRoomTotalPrice(room);
  }, 0);

  const extraTotal = rooms.reduce((sum, room) => sum + (room.extraFee || 0), 0);

  const [selectedMethod, setSelectedMethod] = useState("");
  const [discounts, setDiscounts] = useState<AppliedDiscount[]>([]);
  const [finalTotal, setFinalTotal] = useState<number>(total);
  const [promoCode, setPromoCode] = useState("");

  const handleSelect = (value: string) => {
    setSelectedMethod(value);
  };

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
        setFinalTotal(data.finalPrice + extraTotal || total + extraTotal);
      } else {
        setDiscounts([]);
        setFinalTotal(total + extraTotal);
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

  if (user && user.id && (wallet?.balance || 0) > total) {
    methods.push({
      label: "Thanh toán qua ví",
      value: "wallet",
      icon: <FontAwesomeIcon icon={faWallet} className=" tw-text-2xl" />,
    });
  }

  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [request, setRequest] = useState("");

  useEffect(() => {
    const fullName =
      searchParams.get("fullName") ||
      (user?.last_name || user?.first_name
        ? `${user.last_name} ${user.first_name}`
        : "");

    setName(fullName);
    setEmail(searchParams.get("email") || user?.email || "");
    setPhone(searchParams.get("phone") || user?.phone_number || "");
    setRequest(searchParams.get("request") || user?.request || "");
  }, [searchParams, user]);

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
          toast.info("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
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
      toast.info("Không có phòng nào trong giỏ hàng.");
      return;
    }
    if (name === "" && email === "" && phone === "") {
      toast.info("Vui lòng nhập thông tin cá nhân để đặt phòng.");
      return;
    }
    if (!selectedMethod) {
      toast.info("Vui lòng chọn phương thức thanh toán.");
      return;
    }
    try {
      setLoading(true);
      const payload: CreateBookingRequest = {
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
        note: rooms.map((r) => r.desc).join(". "),
        discount_id: discounts.map((d) => d.discountId),
        discount_value: discounts.reduce((sum, d) => sum + d.amount, 0),
        booking_method_id: "684126db1ce6a19c45c2ec0a",
        booking_status_id: "683fba8d351a96315d45767a", // pending
        request: request || "Không có",
        booking_details: rooms.map((room) => ({
          room_class_id: room.id,
          price_per_night: room.price,
          nights: room.nights,
          services:
            room.services?.map((s) => ({
              amount: s.quantity,
              service_id: s.id,
            })) ?? [],
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

      const paymentResponse = await createPayment({
        method: selectedMethod,
        orderId: data?.id as string, // orderId
        orderInfo: `Đặt phòng từ ${formatDate(
          rooms[0].checkIn
        )} đến ${formatDate(rooms[0].checkOut)}
        - Tổng tiền: ${formatCurrencyVN(total)}
        - Phương thức: ${selectedMethod}`,
        amount: total,
      });
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
        router.push(`/thank-you?orderId=${data?.id}`);
        mutate(); // Cập nhật ví sau khi đặt thành công
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

  const cancelPolicyTimeline = getCancelPolicyTimeline(
    new Date(formatDateForBooking(rooms[0].checkIn)),
    new Date(formatDateForBooking(rooms[0].checkOut)),
    new Date() // hoặc createdAt
  );

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

          <InformationSection
            cancelPolicyTimeline={cancelPolicyTimeline}
            total_price={finalTotal}
          />
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
            walletBalance={wallet?.balance || 0}
          />

          <PriceSummary
            total={total}
            extraTotal={extraTotal}
            discounts={discounts}
            onSubmit={handleBooking}
          />
        </div>
      </div>
    </div>
  );
}
