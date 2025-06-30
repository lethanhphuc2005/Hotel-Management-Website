"use client";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { Review } from "@/types/review";
import { nestReplies } from "@/utils/nestObject";

const ReviewSection = ({ reviews }: { reviews: Review[] }) => {
  const [visibleCount, setVisibleCount] = useState(3);

  const nested = nestReplies(reviews);
  const userReviews = nested.filter(
    (review) => review.user_id && !review.employee_id
  );

  const averageRating =
    userReviews.length > 0
      ? (
          userReviews.reduce((sum, review) => sum + (review.rating ?? 0), 0) /
          userReviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <section className="tw-max-w-[1320px] tw-mx-auto tw-my-10 tw-p-6 tw-bg-black tw-shadow-xl tw-border-t tw-border-white">
      <h3 className="tw-text-2xl tw-font-bold tw-text-primary tw-font-playfair tw-mb-4">
        Đánh giá của khách hàng
      </h3>

      {/* Tổng điểm trung bình */}
      <div className="tw-flex tw-items-center tw-gap-4 tw-mb-6">
        <div className="tw-text-4xl tw-font-bold tw-text-primary">
          {averageRating}
        </div>
        <div className="tw-flex tw-items-center tw-gap-1">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={
                i < Math.round(Number(averageRating))
                  ? "tw-text-primary"
                  : "tw-text-gray-600"
              }
            />
          ))}
        </div>
        <span className="tw-text-gray-400">
          ({userReviews.length} đánh giá)
        </span>
      </div>

      {/* Danh sách đánh giá */}
      <div className="tw-space-y-4">
        {nested.slice(0, visibleCount).map((review) => (
          <div
            key={review.id}
            className="tw-bg-gray-900 tw-rounded-xl tw-p-4 tw-shadow-sm"
          >
            <div className="tw-flex tw-items-center tw-gap-3 tw-mb-2">
              <div className="tw-font-medium tw-text-primary">
                {review.user_id
                  ? `${review.user_id.last_name} ${review.user_id.first_name}`
                  : review.employee_id
                  ? `Nhân viên: ${review.employee_id.last_name} ${review.employee_id.first_name}`
                  : "Ẩn danh"}
              </div>
              {!review.parent_id && review.rating && (
                <div className="tw-flex tw-gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < (review.rating ?? 0)
                          ? "tw-text-primary tw-text-sm"
                          : "tw-text-gray-600 tw-text-sm"
                      }
                    />
                  ))}
                </div>
              )}
            </div>
            <p className="tw-text-sm tw-text-gray-300">{review.content}</p>

            {/* Hiển thị phản hồi */}
            {(review.replies?.length ?? 0) > 0 && (
              <div className="tw-ml-6 tw-mt-2 tw-border-l-2 tw-border-primary tw-pl-4 tw-space-y-2">
                {review.replies?.map((reply) => (
                  <div
                    key={reply.id}
                    className="tw-bg-gray-800 tw-rounded-lg tw-p-3"
                  >
                    <div className="tw-text-sm tw-text-yellow-400 tw-font-medium">
                      {reply.employee_id
                        ? `${reply.employee_id.last_name} ${reply.employee_id.first_name} (Nhân viên)`
                        : `${reply.user_id?.last_name} ${reply.user_id?.first_name}`}
                    </div>
                    <p className="tw-text-sm tw-text-gray-200">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Xem thêm */}
        {visibleCount < nested.length && (
          <button
            onClick={() => setVisibleCount((prev) => prev + 3)}
            className="tw-mt-4 tw-px-4 tw-py-2 tw-rounded tw-bg-primary tw-text-black hover:tw-bg-yellow-400 tw-transition"
          >
            Xem thêm đánh giá
          </button>
        )}
      </div>
    </section>
  );
};

export default ReviewSection;
