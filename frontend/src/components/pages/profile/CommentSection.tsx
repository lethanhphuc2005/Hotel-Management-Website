"use client";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { deleteComment, updateComment } from "@/services/CommentService";
import { formatDate } from "@/utils/dateUtils";
import { useState } from "react";
import Pagination from "@/components/sections/Pagination";
import { showConfirmDialog } from "@/utils/swal";
import { Comment } from "@/types/comment";

export default function CommentSection({
  userId,
  comments,
  setComments,
}: {
  userId: string;
  comments: any[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = comments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentComments = comments.slice(startIndex, endIndex);
  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center text-gray-500">Không có bình luận nào.</div>
    );
  }

  const handleEdit = async (comment: Comment) => {
    try {
      const response = await updateComment({
        commentId: comment.id,
        userId: userId,
        content: editContent,
      });
      if (!response.success) {
        toast.error(response.message || "Cập nhật bình luận thất bại.");
        return;
      }
      const updatedComment = response.data;
      if (!updatedComment) {
        toast.error("Không tìm thấy bình luận để cập nhật.");
        return;
      }
      toast.success(response.message || "Cập nhật bình luận thành công");
      setComments((prev) =>
        prev.map((c) =>
          c.id === comment.id
            ? {
                ...c,
                content: updatedComment.content,
                update_at: updatedComment.updatedAt,
              }
            : c
        )
      );
      setEditingId(null);
    } catch {
      toast.error("Cập nhật bình luận thất bại. Vui lòng thử lại sau.");
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const result = await showConfirmDialog(
        "Bạn có chắc muốn xóa bình luận này?",
        "Bình luận này sẽ bị xóa vĩnh viễn.",
        "Xóa",
        "Huỷ"
      );

      if (!result) {
        return;
      }
      await deleteComment({commentId, userId});
      toast.success("Xóa bình luận thành công");
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      toast.error("Xóa bình luận thất bại. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="tw-space-y-4">
      {currentComments.map((comment) => (
        <motion.div
          key={comment.id}
          className="tw-p-4 tw-rounded-xl tw-border tw-border-gray-700 tw-bg-black/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="tw-flex tw-justify-between tw-items-center">
            <div>
              <h3 className="tw-text-lg tw-font-bold tw-text-white">
                {comment.user?.last_name + " " + comment.user?.first_name ||
                  "Anonymous"}
              </h3>
              <p className="tw-text-sm tw-text-gray-400">
                Ngày tạo: {formatDate(comment.createdAt)}
              </p>
              <p className="tw-text-sm tw-text-gray-400 tw-mb-3">
                Ngày cập nhật: {formatDate(comment.updatedAt)}
              </p>
              <h2 className="tw-text-base tw-font-medium tw-text-blue-400">
                {comment.room_class.name || "Unknown Room Type"}
              </h2>
            </div>
            <div className="tw-flex tw-space-x-2">
              {editingId === comment.id ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05, opacity: 0.8 }}
                    whileTap={{ scale: 0.95, opacity: 0.6 }}
                    className="tw-text-green-500 tw-border tw-border-green-500 tw-rounded-lg tw-px-3 tw-py-1.5 tw-text-sm"
                    onClick={() => handleEdit(comment)}
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
                      setEditingId(comment.id);
                      setEditContent(comment.content);
                    }}
                  >
                    Chỉnh sửa
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, opacity: 0.8 }}
                    whileTap={{ scale: 0.95, opacity: 0.6 }}
                    className="tw-text-red-500 tw-border tw-border-red-500 tw-rounded-lg tw-px-3 tw-py-1.5 tw-text-sm"
                    onClick={(e) => {
                      handleDelete(comment.id);
                      e.stopPropagation();
                    }}
                  >
                    Xoá
                  </motion.button>
                </>
              )}
            </div>
          </div>
          {editingId === comment.id ? (
            <textarea
              className="tw-mt-2 tw-w-full tw-bg-gray-800 tw-text-gray-100 tw-p-2 tw-rounded"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
            />
          ) : (
            <p className="tw-mt-2 tw-text-gray-300">{comment.content}</p>
          )}
        </motion.div>
      ))}
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
