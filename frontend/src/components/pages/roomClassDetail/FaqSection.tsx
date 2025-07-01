"use client";

import { useState } from "react";
import { FiMessageCircle } from "react-icons/fi";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import QuestionModalSidebar from "./QuestionModalSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Comment } from "@/types/comment";
import {
  AnimatedButtonPrimary,
  AnimatedButtonLink,
} from "@/components/common/Button";

const faqColumns = [
  [
    // Column 1
    {
      question: "Họ có phục vụ bữa sáng không?",
      answer: "Chỗ nghỉ có phục vụ bữa sáng với thực đơn đa dạng.",
    },
    {
      question: "Chỗ nghỉ có dịch vụ đưa đón sân bay không?",
      answer: "Có, bạn có thể đặt dịch vụ đưa đón sân bay với phụ phí.",
    },
    {
      question: "Chỗ nghỉ có spa không?",
      answer: "Chỗ nghỉ có dịch vụ spa cho khách.",
    },
    {
      question: "Chỗ nghỉ có nhà hàng không?",
      answer: "Có nhà hàng phục vụ các món ăn địa phương và quốc tế.",
    },
    {
      question: "Chỗ nghỉ có chính sách Wi-Fi ra sao?",
      answer: "Wi-Fi miễn phí toàn bộ khuôn viên.",
    },
  ],
  [
    // Column 2
    {
      question: "Hồ bơi có hoạt động không?",
      answer: "Hồ bơi mở cửa từ 6h đến 22h hàng ngày.",
    },
    {
      question: "Tôi có thể đặt phòng gia đình ở đây không?",
      answer: "Có phòng gia đình với nhiều lựa chọn.",
    },
    {
      question: "Phòng gym có hoạt động không?",
      answer: "Phòng gym hoạt động 24/7.",
    },
    {
      question: "Chỗ nghỉ có chỗ đỗ xe không?",
      answer: "Có bãi đỗ xe miễn phí cho khách.",
    },
    {
      question: "Có tiện nghi BBQ không?",
      answer: "Có khu vực BBQ ngoài trời.",
    },
  ],
];

interface Props {
  roomClassId: string;
  comments: Comment[];
}
const FAQSection = ({ roomClassId, comments }: Props) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [commentsData, setCommentsData] = useState<Comment[]>(comments);

  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: "ask" | "comments";
  }>({ open: false, mode: "ask" });

  const toggleExpand = (question: string) => {
    setExpanded(expanded === question ? null : question);
  };

  return (
    <section className="tw-bg-black tw-text-white tw-py-12 tw-px-4 tw-border-t tw-border-white">
      <div className="tw-max-w-7xl tw-mx-auto tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6">
        {/* Box hỏi */}
        <div className="tw-border tw-rounded-lg tw-p-6 tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center">
          <h3 className="tw-text-xl tw-font-bold tw-mb-4">
            Bạn vẫn đang tìm kiếm?
          </h3>
          <AnimatedButtonPrimary
            onClick={() => setModalState({ open: true, mode: "ask" })}
            className="tw-px-6 tw-py-2"
          >
            Đặt câu hỏi
          </AnimatedButtonPrimary>
          <p className="tw-mt-4">
            Chúng tôi có thể giải đáp tức thì hầu hết các thắc mắc
          </p>
          <AnimatedButtonLink
            onClick={() => setModalState({ open: true, mode: "comments" })}
          >
            Xem câu hỏi đã có
          </AnimatedButtonLink>
        </div>

        {/* Cột câu hỏi */}
        {faqColumns.map((column, i) => (
          <div key={i} className="tw-border tw-rounded-lg tw-p-4">
            {column.map((qa, idx) => (
              <div key={idx} className="tw-border-b tw-border-gray-700 tw-py-2">
                <div
                  className="tw-flex tw-justify-between tw-items-center tw-cursor-pointer hover:tw-text-yellow-400"
                  onClick={() => toggleExpand(qa.question)}
                >
                  <span className="tw-flex tw-items-center tw-gap-2">
                    <FiMessageCircle /> {qa.question}
                  </span>
                  {expanded === qa.question ? (
                    <FaChevronDown className="tw-transition-transform" />
                  ) : (
                    <FaChevronRight className="tw-transition-transform" />
                  )}
                </div>

                <AnimatePresence initial={false}>
                  {expanded === qa.question && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="tw-bg-gray-800 tw-text-sm tw-text-gray-300 tw-px-4 tw-py-2 tw-mt-2 tw-rounded">
                        {qa.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Modal sidebar */}
      {modalState.open && (
        <QuestionModalSidebar
          roomClassId={roomClassId} // Replace with actual room class ID
          comments={commentsData} // Replace with actual comments data\
          setCommentsData={setCommentsData} // Function to update comments
          mode={modalState.mode}
          onClose={() => setModalState({ ...modalState, open: false })}
        />
      )}
    </section>
  );
};

export default FAQSection;
