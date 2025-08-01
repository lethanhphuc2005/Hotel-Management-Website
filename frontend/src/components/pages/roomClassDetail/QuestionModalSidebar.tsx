"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CommentWithReplies } from "@/types/comment";
import { useAuth } from "@/contexts/AuthContext";
import { createComment } from "@/services/CommentService";
import { nestComments } from "@/utils/nestObject";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/dateUtils";
import { AnimatedButtonLink } from "@/components/common/Button";
import { useRoomComments } from "@/hooks/data/useComment";
import Pagination from "@/components/sections/Pagination";

interface Props {
  roomId: string;
  mode: "ask" | "comments";
  onClose: () => void;
}

const QuestionModalSidebar = ({ roomId, mode, onClose }: Props) => {
  const [currentTab, setCurrentTab] = useState<"ask" | "comments">(mode);
  const [question, setQuestion] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const ref = useRef(null);
  const { user } = useAuth();
  const userId = user?.id || null;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const { comments, total, mutate } = useRoomComments(
    roomId,
    currentPage,
    itemsPerPage
  );
  const totalPages = Math.ceil(total / itemsPerPage);
  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [comments]);

  const handleClickOutside = (e: MouseEvent) => {
    if (ref.current && !(ref.current as any).contains(e.target)) {
      onClose();
    }
  };

  const nested = nestComments(comments);
  const handleSubmit = async () => {
    if (!question.trim()) return;

    try {
      const response = await createComment({
        roomClassId: roomId,
        parentId: null,
        userId: userId,
        content: question,
      });
      if (!response.success) {
        toast.error(response.message || "Lỗi khi gửi câu hỏi");
        return;
      }

      toast.success("Câu hỏi đã được gửi thành công!");
      setQuestion("");
      setCurrentTab("comments");
      mutate();
    } catch (err) {
      console.error("Error submitting comment", err);
    }
  };

  const handleReplySubmit = async (parentId: string) => {
    if (!replyContent.trim()) return;

    try {
      const res = await createComment({
        roomClassId: roomId,
        parentId,
        userId,
        content: replyContent,
      });

      if (!res.success) {
        toast.error(res.message || "Lỗi khi gửi phản hồi");
        return;
      }

      toast.success("Phản hồi đã được gửi thành công!");
      setReplyingTo(null);
      setReplyContent("");
      mutate();
    } catch (err) {
      console.error("Error submitting reply", err);
    }
  };

  const renderCommentTree = (comments: CommentWithReplies[]) => {
    return comments.map((c) => (
      <div
        key={c.id}
        className="tw-bg-gray-900 tw-p-3 tw-rounded tw-text-white"
      >
        {/* Người gửi */}
        <div className="tw-font-bold">
          {c.user && c.user.first_name
            ? `${c.user.last_name} ${c.user.first_name}`
            : c.employee
            ? `Nhân viên: ${c.employee.last_name} ${c.employee.first_name}`
            : "Ẩn danh"}
          <div className="tw-text-xs tw-text-gray-400">
            ({c.createdAt ? formatDate(c.createdAt) : "Vừa xong"})
          </div>
        </div>

        {/* Nội dung */}
        <div className="tw-text-sm tw-mt-2">{c.content}</div>

        {/* Nút trả lời */}
        {/* <button
          onClick={() => setReplyingTo(c.id!)}
          className="tw-text-sm tw-mt-2 hover:tw-underline"
        >
          Trả lời
        </button> */}
        <AnimatedButtonLink
          onClick={() => {
            setReplyingTo(c.id!);
            setReplyContent("");
          }}
          className="tw-text-sm tw-mt-2"
        >
          Trả lời
        </AnimatedButtonLink>

        {/* Form trả lời */}
        {replyingTo === c.id && (
          <div className="tw-mt-2">
            <textarea
              rows={2}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="tw-w-full tw-bg-gray-800 tw-text-white tw-p-2 tw-rounded-md tw-text-sm"
              placeholder="Nhập phản hồi..."
            />
            <button
              onClick={() => handleReplySubmit(c.id!)}
              className="tw-bg-primary tw-text-black tw-text-sm tw-font-semibold tw-py-1 tw-px-3 tw-rounded hover:tw-bg-yellow-400 tw-mt-2"
            >
              Gửi phản hồi
            </button>
          </div>
        )}

        {/* Reply con (gọi đệ quy) */}
        {c.replies && c.replies.length > 0 && (
          <div className="tw-ml-4 tw-mt-3 tw-space-y-2 tw-border-l tw-border-gray-400 tw-pl-1">
            {renderCommentTree(c.replies)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="tw-fixed tw-inset-0 tw-bg-black/60 tw-z-50 tw-flex tw-justify-end tw-backdrop-blur-sm">
      <motion.div
        ref={ref}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="tw-bg-black tw-text-primary tw-w-full sm:tw-w-[400px] tw-h-full tw-p-4 tw-flex tw-flex-col tw-border-l tw-border-white/40"
      >
        {/* Tabs */}
        <div className="tw-flex tw-gap-4 tw-mb-4 tw-border-b tw-border-primary/30 tw-pb-2 tw-mt-[100px]">
          <button
            onClick={() => setCurrentTab("ask")}
            className={`tw-uppercase tw-font-bold tw-text-sm ${
              currentTab === "ask" ? "tw-text-primary" : "tw-text-gray-500"
            }`}
          >
            Đặt câu hỏi
          </button>
          <button
            onClick={() => setCurrentTab("comments")}
            className={`tw-uppercase tw-font-bold tw-text-sm ${
              currentTab === "comments" ? "tw-text-primary" : "tw-text-gray-500"
            }`}
          >
            Bình luận ({total})
          </button>
        </div>

        {/* Nội dung */}
        <div className="tw-flex-1 tw-overflow-y-auto tw-space-y-4">
          {currentTab === "ask" ? (
            <div className="tw-space-y-4">
              <textarea
                rows={4}
                className="tw-w-full tw-bg-gray-900 tw-text-white tw-p-3 tw-rounded-md focus:tw-outline-none"
                placeholder="Viết câu hỏi của bạn..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                className="tw-bg-primary tw-text-black tw-font-semibold tw-py-2 tw-px-4 tw-rounded hover:tw-bg-yellow-400"
              >
                Gửi câu hỏi
              </button>
            </div>
          ) : (
            <div className="tw-space-y-4">
              {nested.length > 0 ? (
                <div className="tw-space-y-4">
                  {renderCommentTree(nested)}
                  <Pagination
                    pageCount={totalPages}
                    onPageChange={handlePageChange}
                    forcePage={currentPage - 1}
                  />
                </div>
              ) : (
                <div className="tw-text-gray-400 tw-text-center tw-py-4">
                  Chưa có bình luận nào. Hãy đặt câu hỏi hoặc bình luận để bắt
                  đầu.
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QuestionModalSidebar;
