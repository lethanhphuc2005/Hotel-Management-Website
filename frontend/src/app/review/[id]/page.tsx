"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AnimatedButtonPrimary } from "@/components/common/Button";
import { formatDate } from "@/utils/dateUtils"; // nếu có
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getBookingById } from "@/services/BookingService";
import { useLoading } from "@/contexts/LoadingContext";
import { Booking, BookingDetail } from "@/types/booking";
import { formatCurrencyVN } from "@/utils/currencyUtils";
import { createReview } from "@/services/ReviewService";
import { ServiceBooking } from "@/types/service";
import { Discount } from "@/types/discount";

export default function RateAfterBookingPage() {

  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [reviews, setReviews] = useState<{ [key: string]: string }>({});

  const [booking, setBooking] = useState<Booking | null>(null);
  const [bookingDetail, setBookingDetail] = useState<BookingDetail[] | null>(
    null
  );
  const [didFetch, setDidFetch] = useState(false);
  const searchParams = useParams();

  const { setLoading } = useLoading();
  const { user, isLoading: isAuthLoading } = useAuth();
  const bookingId = searchParams.id?.toLocaleString();

  useEffect(() => {
    if (isAuthLoading || didFetch) return;

    if (!user) {
      toast.info("Bạn cần đăng nhập để đánh giá.");
      return;
    }

    // Kiểm tra nếu bookingId không hợp lệ
    if (!bookingId) {
      toast.info("Mã đặt phòng không hợp lệ.");
      return;
    }

    try {
      setLoading(true);
      setDidFetch(true);
      // Lấy thông tin đặt phòng từ API
      const fetchBooking = async () => {
        const response = await getBookingById(bookingId);
        if (!response.success) {
          toast.error(response.message || "Không thể lấy thông tin đặt phòng.");
          return;
        }

        const data = response.data;

        if (data?.user_id !== user.id) {
          toast.error("Bạn không có quyền truy cập vào đặt phòng này.");
          return;
        }
        setBooking(data);
        setBookingDetail(data.booking_details || []);
      };
      fetchBooking();
    } catch (error) {
      console.error("Lỗi khi lấy thông tin đặt phòng:", error);
      toast.error("Không thể lấy thông tin đặt phòng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, [bookingId, user]);
  if (!booking) return;
  const checkInDate = booking.check_in_date;
  const checkOutDate = booking.check_out_date;

  const handleSubmitReview = async (
    bookingDetailId: string,
    roomClassId: string
  ) => {
    const rating = ratings[bookingDetailId];
    const review = reviews[bookingDetailId];

    if (!rating) {
      toast.warning("Vui lòng chọn số sao đánh giá.");
      return;
    }

    if (!user) {
      toast.info("Bạn cần đăng nhập để gửi đánh giá.");
      return;
    }
    try {
      const response = await createReview({
        bookingId: booking.id,
        roomClassId: roomClassId,
        parentId: null,
        userId: user.id,
        rating,
        content: review,
      });

      if (!response.success) {
        toast.error(response.message || "Không thể gửi đánh giá.");
        return;
      }

      toast.success("Đánh giá đã được gửi!");
      setRatings((prev) => ({ ...prev, [bookingDetailId]: 0 }));
      setReviews((prev) => ({ ...prev, [bookingDetailId]: "" }));
      window.location.href = `/profile`; // Điều hướng lại trang đánh giá
    } catch (error) {
      console.error("Lỗi gửi đánh giá:", error);
      toast.error("Không thể gửi đánh giá. Vui lòng thử lại sau.");
    }
  };
  return (
    <div className="tw-container tw-my-[80px] tw-mx-auto tw-px-4 tw-text-white">
      <h1 className="tw-text-3xl tw-font-bold tw-text-primary tw-text-center">
        Đánh giá đặt phòng
      </h1>

      <div className="tw-mt-8 tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-8">
        {/* THÔNG TIN ĐẶT PHÒNG */}
        <div className="tw-bg-[#1a1a1a] tw-p-6 tw-rounded-2xl tw-shadow-md">
          <h2 className="tw-text-xl tw-font-semibold tw-mb-4 tw-text-primary">
            Thông tin đặt phòng
          </h2>

          <ul className="tw-text-sm tw-space-y-2">
            <li>
              Mã đặt phòng: <strong>{booking.id}</strong>
            </li>
            <li>
              Ngày đặt:{" "}
              <strong>{formatDate(booking.booking_date ?? new Date())}</strong>
            </li>
            <li>
              Hình thức: <strong>{booking.booking_method.name}</strong>
            </li>
            <li>
              Họ tên: <strong>{booking.full_name}</strong>
            </li>
            <li>
              Email: <strong>{booking.email}</strong>
            </li>
            <li>
              Điện thoại: <strong>{booking.phone_number}</strong>
            </li>
            <li>
              Số người lớn: <strong>{booking.adult_amount}</strong>
            </li>
            <li>
              Số trẻ em: <strong>{booking.child_amount || 0}</strong>
            </li>
            <li>
              Nhận phòng: <strong>{formatDate(checkInDate)}</strong>
            </li>
            <li>
              Trả phòng: <strong>{formatDate(checkOutDate)}</strong>
            </li>

            {booking.discounts && booking.discounts.length > 0 ? (
              <li>
                <p className="tw-mt-2">Khuyến mãi áp dụng:</p>
                <ul className="tw-list-disc tw-ml-5">
                  {booking.discounts.map((discount: Discount, index) => (
                    <li key={discount.id || index}>
                      {discount.name} -{" "}
                      {discount.value_type === "percent"
                        ? `${discount.value * 100}%`
                        : formatCurrencyVN(discount.value)}
                      <br />
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li>Không có khuyến mãi áp dụng.</li>
            )}

            <li className="tw-pt-2 tw-border-t tw-border-gray-700 tw-mt-4">
              <div>
                <p>
                  Giá gốc:{" "}
                  <strong>{formatCurrencyVN(booking.original_price)}</strong>
                </p>
                {(booking.discount_value ?? 0) > 0 && (
                  <p>
                    Giảm giá:{" "}
                    <strong>
                      {formatCurrencyVN(booking.discount_value ?? 0)}
                    </strong>
                  </p>
                )}
                <p className="tw-text-primary tw-text-lg tw-font-bold">
                  Tổng thanh toán: {formatCurrencyVN(booking.total_price)}
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* THÔNG TIN CÁC PHÒNG */}
        <div className="tw-space-y-6">
          {bookingDetail?.map((item, index) => (
            <div key={item.id || index}>
              <div className="tw-bg-[#1a1a1a] tw-p-4 tw-rounded-2xl tw-flex tw-gap-4 tw-shadow-md">
                <Image
                  src={
                    item.room_class?.images[0].url ||
                    "/img/default-room.jpg"
                  }
                  alt={item.room_class.name || "Phòng"}
                  width={120}
                  height={120}
                  className="tw-rounded-lg tw-object-cover tw-w-[120px] tw-h-[120px]"
                />
                <div className="tw-flex-1 tw-space-y-1 tw-text-sm">
                  <h3 className="tw-text-lg tw-font-semibold tw-text-primary">
                    {item.room_class.name || "Phòng"}
                  </h3>
                  <p>
                    Dịch vụ:{" "}
                    {item.services?.length > 0
                      ? item.services
                          .map((s: ServiceBooking) => s.service.name)
                          .join(", ")
                      : "Không có"}
                  </p>
                  <p>
                    {item.nights} đêm – {formatCurrencyVN(item.price_per_night)}
                    /đêm
                  </p>
                  <p className="tw-font-bold">
                    Tổng: {formatCurrencyVN(item.price_per_night * item.nights)}
                  </p>
                </div>
              </div>
              {/* ĐÁNH GIÁ */}
              <div className="tw-mt-10 tw-text-left">
                <h3 className="tw-text-xl tw-font-semibold tw-text-primary">
                  Đánh giá
                </h3>

                <div className="tw-flex tw-gap-2 tw-my-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() =>
                        setRatings((prev) => ({ ...prev, [item.id]: star }))
                      }
                    >
                      <FontAwesomeIcon
                        icon={faStar}
                        className={`tw-text-2xl ${
                          ratings[item.id] >= star
                            ? "tw-text-yellow-400"
                            : "tw-text-gray-500"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  placeholder="Viết nhận xét của bạn..."
                  value={reviews[item.id] || ""}
                  onChange={(e) =>
                    setReviews((prev) => ({
                      ...prev,
                      [item.id]: e.target.value,
                    }))
                  }
                  rows={4}
                  className="tw-w-full tw-p-3 tw-rounded-xl tw-bg-black/20 tw-text-white tw-border tw-border-gray-600 tw-mb-4"
                />

                <AnimatedButtonPrimary
                  onClick={() =>
                    handleSubmitReview(item.id, item.room_class_id)
                  }
                  className="tw-px-6 tw-py-2"
                >
                  Gửi đánh giá
                </AnimatedButtonPrimary>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
