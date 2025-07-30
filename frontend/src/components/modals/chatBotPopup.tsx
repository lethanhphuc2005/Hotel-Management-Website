"use client";
import { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/chatbotPopup.module.css";
import { ChatMessageHistory, ChatMessage } from "@/types/chatbot";
import { generateChatResponse } from "@/services/ChatbotService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { showConfirmDialog } from "@/utils/swal";
import { useDispatch, useSelector } from "react-redux";
import { addRoomToCart, CartRoom } from "@/store/cartSlice";
import { toast } from "react-toastify";
import { RootState } from "@/store/store";
import { RoomClass } from "@/types/roomClass";
import { Booking, BookingDetail } from "@/types/booking";

export default function ChatbotPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ChatMessageHistory[]>([]);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [rooms, setRooms] = useState<RoomClass[]>([]); // danh sách phòng gợi ý

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      const greeting = "Xin chào! Tôi có thể giúp gì cho bạn?";
      setMessages((prev) => [...prev, { sender: "bot", text: greeting }]);
      setHistory((prev) => [
        ...prev,
        { role: "model", parts: [{ text: greeting }] },
      ]);
      setHasGreeted(true);
    }

    if (!isOpen) {
      // Reset nếu đóng
      setMessages([]);
      setHistory([]);
      setHasGreeted(false);
      setInput("");
      setRooms([]);
    }
  }, [isOpen, hasGreeted]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");
    setLoading(true);

    const filteredHistory =
      history[0]?.role === "model" ? history.slice(1) : history;

    const updatedHistory: ChatMessageHistory[] = [
      ...filteredHistory,
      { role: "user", parts: [{ text: userText }] },
    ];

    try {
      const res = await generateChatResponse({
        prompt: userText,
        history: updatedHistory,
      });

      if (!res.success) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "⚠️ Không thể kết nối đến AI" },
        ]);
        setLoading(false);
        return;
      }

      const botText = res.data;

      // ✅ Cập nhật tin nhắn từ bot
      setMessages((prev) => [...prev, { sender: "bot", text: botText }]);
      setHistory([
        ...updatedHistory,
        { role: "model", parts: [{ text: botText }] },
      ]);

      // ✅ Cập nhật phòng nếu có
      if (res.rooms && res.rooms.length > 0) {
        setRooms(res.rooms);
      }

      // ✅ Nếu đã xác nhận đặt phòng → chuyển sang trang thanh toán
      if (res.isBooking && res.bookingData) {
        const bookingData = res.bookingData;

        const checkInISO = bookingData.check_in_date;
        const checkOutISO = bookingData.check_out_date;
        const startDate = new Date(checkInISO);
        const endDate = new Date(checkOutISO);

        const numberOfNights = bookingData.booking_details?.[0]?.nights || 1;
        const numberOfAdults = bookingData.adults || 1;
        const numberOfChildrenUnder6 = bookingData.children_under_6 || 0;
        const numberOfChildrenOver6 = bookingData.children_over_6 || 0;

        // Xác nhận với người dùng
        const confirmMessage = `Bạn có chắc chắn muốn đặt phòng với thông tin sau?\n
          Tổng giá: ${bookingData.total_price.toLocaleString()} VND\n
          Số lượng phòng: ${bookingData.booking_details.length}\n
          ${bookingData.booking_details
            .map(
              (detail: BookingDetail, idx: number) =>
                `Phòng ${idx + 1}: Tên ${detail.room_class.name}, ${
                  detail.nights
                } đêm`
            )
            .join("\n")}`;

        const confirmed = await showConfirmDialog(
          "Xác nhận đặt phòng",
          confirmMessage,
          "Đặt phòng",
          "Hủy"
        );

        if (!confirmed) {
          setLoading(false);
          return;
        }

        const current = new Date(startDate);
        let hasSaturday = false;
        let hasSunday = false;
        while (current < endDate) {
          if (current.getDay() === 6) hasSaturday = true;
          if (current.getDay() === 0) hasSunday = true;
          current.setDate(current.getDate() + 1);
        }

        const bookingDetails = bookingData.booking_details || [];

        // Thêm phòng vào giỏ hàng
        bookingDetails.forEach((detail: any) => {
          const room: CartRoom = {
            id: detail.room_class_id,
            name: detail.room_class.name,
            img: detail.room_class.images[0],
            price: detail.price_per_night,
            nights: numberOfNights,
            checkIn: startDate.toISOString(),
            checkOut: endDate.toISOString(),
            adults: numberOfAdults,
            childrenUnder6: numberOfChildrenUnder6,
            childrenOver6: numberOfChildrenOver6,
            bedAmount: detail.room_class.bed.quantity,
            view: detail.room_class.view,
            hasSaturdayNight: hasSaturday,
            hasSundayNight: hasSunday,
            features: detail.room_class.features?.map((f: any) => f) ?? [],
          };
          dispatch(addRoomToCart(room));
        });

        setTimeout(() => {
          const params = new URLSearchParams({
            fullName: bookingData.full_name,
            phone: bookingData.phone_number,
            email: bookingData.email,
          });

          router.push(`/payment?${params.toString()}`);
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Có lỗi xảy ra khi gọi AI" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.chatIcon} onClick={() => setIsOpen(!isOpen)}>
        💬
      </div>

      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            Chat với The Moon AI
            <button onClick={() => setIsOpen(false)}>x</button>
          </div>

          <div className={styles.messages}>
            {messages.map((msg, i) => {
              const isLastBot =
                msg.sender === "bot" && i === messages.length - 1;
              return (
                <div
                  key={i}
                  className={`tw-mb-3 tw-flex tw-flex-col ${
                    msg.sender === "user" ? "tw-items-end" : "tw-items-start"
                  }`}
                >
                  {/* Tin nhắn chính */}
                  <div
                    className={`tw-max-w-[80%] tw-px-4 tw-py-2 tw-rounded-xl tw-whitespace-pre-wrap ${
                      msg.sender === "user"
                        ? "tw-bg-blue-100 tw-text-right"
                        : "tw-bg-gray-200"
                    }`}
                  >
                    <span className="tw-text-black">{msg.text}</span>
                  </div>

                  {/* ✅ Gợi ý phòng (chỉ cho bot cuối) */}
                  {isLastBot && rooms.length > 0 && (
                    <div className="tw-mt-2 tw-bg-yellow-50 tw-border-l-4 tw-border-[#FAB320] tw-rounded-lg tw-p-3 tw-text-sm tw-w-full tw-max-w-[80%] tw-text-black">
                      <p className="tw-font-semibold tw-mb-2">
                        📌 Gợi ý phòng:
                      </p>
                      <ul className="tw-list-disc tw-ml-5">
                        {rooms.map((room, idx) => (
                          <li key={idx} className="tw-mb-1">
                            <strong>{room.name}</strong> –{" "}
                            {room.price.toLocaleString()} VND/đêm – View:{" "}
                            {room.view} -{" "}
                            <Link
                              href={`/room-class/${room.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="tw-text-blue-600 hover:tw-underline tw-no-underline"
                            >
                              Xem thêm
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}

            {loading && <div className={styles.bot}>Đang trả lời...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputArea}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Nhập tin nhắn..."
            />
            <button onClick={sendMessage}>Gửi</button>
          </div>
        </div>
      )}
    </>
  );
}
