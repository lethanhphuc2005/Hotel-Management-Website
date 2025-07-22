"use client";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { deleteReview, updateReview } from "@/services/ReviewService";
import { formatDate } from "@/utils/dateUtils";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Pagination from "@/components/sections/Pagination";
import { showConfirmDialog } from "@/utils/swal";
import { Review } from "@/types/review";

export default function ReviewSection({
  reviews,
  setReviews,
}: {
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = reviews.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReviews = reviews.slice(startIndex, endIndex);
  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center text-gray-500">Không có đánh giá nào.</div>
    );
  }
  const handleEdit = async (review: Review) => {
    try {
      const response = await updateReview({
        reviewId: review.id,
        userId: review.user_id ?? "",
        rating: editRating ?? review.rating,
        content: editContent,
      });
      if (!response.success) {
        toast.error(response.message || "Cập nhật đánh giá thất bại.");
        return;
      }
      const updatedReview = response.data;
      toast.success(response.message || "Cập nhật đánh giá thành công");
      setReviews((prev) =>
        prev.map((r) =>
          r.id === review.id
            ? {
                ...r,
                content: updatedReview.content,
                rating: updatedReview.rating,
                updated_at: updatedReview.updatedAt,
              }
            : r
        )
      );
      setEditingId(null);
    } catch {
      toast.error("Cập nhật đánh giá thất bại. Vui lòng thử lại sau.");
    }
  };

  const handleDelete = async (reviewId: string, userId: string) => {
    try {
      const result = await showConfirmDialog(
        "Bạn có chắc muốn xóa đánh giá này?",
        "Đánh giá này sẽ bị xóa vĩnh viễn.",
        "Xóa",
        "Huỷ"
      );

      if (!result) {
        return;
      }
      await deleteReview({ reviewId, userId });
      toast.success("Xóa đánh giá thành công");
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch {
      toast.error("Xóa đánh giá thất bại. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="tw-space-y-4">
      {currentReviews.map((review) => {
        return (
          <motion.div
            key={review.id}
            className="tw-p-4 tw-rounded-xl tw-border tw-border-gray-700 tw-bg-black/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="tw-flex tw-justify-between tw-items-center">
              <div>
                <h3 className="tw-text-lg tw-font-bold tw-text-white">
                  {review.user?.last_name + " " + review.user?.first_name ||
                    "Anonymous"}
                </h3>
                <p className="tw-text-sm tw-text-gray-400">
                  Ngày tạo: {formatDate(review.createdAt || "")}
                </p>
                <p className="tw-text-sm tw-text-gray-400 tw-mb-3">
                  Ngày cập nhật: {formatDate(review.updatedAt || "")}
                </p>
                <h2 className="tw-text-base tw-font-medium tw-text-blue-400">
                  {review.booking.booking_details[0].room_class.name ||
                    "Unknown Room Type"}
                </h2>
                <div className="tw-flex tw-items-center tw-mt-2">
                  {review.rating ? (
                    Array.from({ length: 5 }, (_, index) => {
                      const starValue = index + 1;
                      return (
                        <FontAwesomeIcon
                          key={index}
                          icon={faStar}
                          className={`tw-cursor-pointer tw-text-2xl ${
                            review.rating !== null && starValue <= review.rating
                              ? "tw-text-yellow-400"
                              : "tw-text-gray-500"
                          }`}
                        />
                      );
                    })
                  ) : (
                    <span className="tw-text-gray-500 tw-text-sm"></span>
                  )}
                </div>
              </div>
              <div className="tw-flex tw-space-x-2">
                {editingId === review.id ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05, opacity: 0.8 }}
                      whileTap={{ scale: 0.95, opacity: 0.6 }}
                      className="tw-text-green-500 tw-border tw-border-green-500 tw-rounded-lg tw-px-3 tw-py-1.5 tw-text-sm"
                      onClick={() => handleEdit(review)}
                    >
                      Lưu
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, opacity: 0.8 }}
                      whileTap={{ scale: 0.95, opacity: 0.6 }}
                      className="tw-text-gray-400 tw-border tw-border-gray-400 tw-rounded-lg tw-px-3 tw-py-1.5 tw-text-sm"
                      onClick={() => setEditingId(null)}
                    >
                      Hủy
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05, opacity: 0.8 }}
                      whileTap={{ scale: 0.95, opacity: 0.6 }}
                      className="tw-text-blue-500 tw-border tw-border-blue-500 tw-rounded-lg tw-px-3 tw-py-1.5 tw-text-sm"
                      onClick={() => {
                        setEditingId(review.id);
                        setEditContent(review.content);
                      }}
                    >
                      Chỉnh sửa
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, opacity: 0.8 }}
                      whileTap={{ scale: 0.95, opacity: 0.6 }}
                      className="tw-text-red-500 tw-border tw-border-red-500 tw-rounded-lg tw-px-3 tw-py-1.5 tw-text-sm"
                      onClick={(e) => {
                        handleDelete(review.id, review.user_id ?? "");
                        e.stopPropagation();
                      }}
                    >
                      Xoá
                    </motion.button>
                  </>
                )}
              </div>
            </div>
            {editingId === review.id ? (
              <>
                <textarea
                  className="tw-mt-2 tw-w-full tw-bg-gray-800 tw-text-gray-100 tw-p-2 tw-rounded"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                />
                <div className="tw-mt-2 tw-flex tw-space-x-1">
                  {Array.from({ length: 5 }, (_, index) => {
                    const starValue = index + 1;
                    return (
                      <label key={index}>
                        <input
                          type="radio"
                          name="rating"
                          value={starValue}
                          className="tw-hidden"
                          onChange={() => setEditRating(starValue)}
                          checked={editRating === starValue}
                        />
                        <FontAwesomeIcon
                          icon={faStar}
                          className={`tw-cursor-pointer tw-text-2xl ${
                            starValue <= (editRating ?? 0)
                              ? "tw-text-yellow-400"
                              : "tw-text-gray-500"
                          }`}
                        />
                      </label>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="tw-mt-2 tw-text-gray-300">{review.content}</p>
            )}
          </motion.div>
        );
      })}
      {totalPages > 1 && (
        <Pagination
          pageCount={totalPages}
          onPageChange={handlePageChange}
          forcePage={currentPage - 1}
        />
      )}
    </div>
  );
}
