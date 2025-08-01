"use client";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { nestReplies } from "@/utils/nestObject";
import { useRoomReviews } from "@/hooks/data/useReview";
import Pagination from "@/components/sections/Pagination";

interface ReviewSectionProps {
  roomId: string;
}

const ReviewSection = ({ roomId }: ReviewSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const { reviews, total, averageRating } = useRoomReviews(
    roomId,
    currentPage,
    itemsPerPage
  );
  const totalPages = Math.ceil(total / itemsPerPage);

  const nested = nestReplies(reviews);
  const userReviews = nested.filter(
    (review) => review.user_id && !review.employee_id
  );

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
        <span className="tw-text-gray-400">({total} đánh giá)</span>
      </div>

      {/* Danh sách đánh giá */}
      <div className="tw-space-y-4">
        {nested.map((review) => (
          <div
            key={review.id}
            className="tw-bg-gray-900 tw-rounded-xl tw-p-4 tw-shadow-sm"
          >
            <div className="tw-flex tw-items-center tw-gap-3 tw-mb-2">
              <div className="tw-font-medium tw-text-primary">
                {review.user
                  ? `${review.user.last_name} ${review.user.first_name}`
                  : review.employee
                  ? `Nhân viên: ${review.employee.last_name} ${review.employee.first_name}`
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
                      {reply.employee
                        ? `${reply.employee.last_name} ${reply.employee.first_name} (Nhân viên)`
                        : `${reply.user?.last_name} ${reply.user?.first_name}`}
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

        {userReviews.length === 0 && (
          <div className="tw-text-gray-400 tw-text-center tw-mt-4">
            Chưa có đánh giá nào từ khách hàng.
          </div>
        )}

        {/* Phân trang */}
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            onPageChange={handlePageChange}
            forcePage={currentPage - 1}
          />
        )}
      </div>
    </section>
  );
};

export default ReviewSection;
