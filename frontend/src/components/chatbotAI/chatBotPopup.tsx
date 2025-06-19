"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import styles from "./chatbotPopup.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Role = "user" | "model";

interface ChatMessageHistory {
  role: Role;
  parts: { text: string }[];
}

export default function ChatbotPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ChatMessageHistory[]>([]);
  const [hasGreeted, setHasGreeted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Tự động cuộn xuống cuối khi có tin nhắn mới hoặc đang loading
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Gửi lời chào khi mở popup, reset trạng thái khi đóng
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
  }, [isOpen, hasGreeted]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input.trim();

    // Cập nhật hiển thị người dùng
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");
    setLoading(true);

    // Cập nhật history phía frontend
    // Lọc bỏ lời chào của model nếu nó nằm đầu tiên
    const filteredHistory =
      history[0]?.role === "model" ? history.slice(1) : history;

    const updatedHistory: ChatMessageHistory[] = [
      ...filteredHistory,
      { role: "user", parts: [{ text: userText }] },
    ];

    try {
      const res = await axios.post(
        "http://localhost:8000/v1/chat/generate-response",
        {
          prompt: userText,
          history: updatedHistory,
        }
      );

      const botText = res.data.response;

      // Cập nhật hiển thị bot
      setMessages((prev) => [...prev, { sender: "bot", text: botText }]);

      // Lưu lại history kèm phản hồi của bot
      setHistory([
        ...updatedHistory,
        { role: "model", parts: [{ text: botText }] },
      ]);
    } catch (err) {
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
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`${styles.message} ${
                  msg.sender === "user" ? styles.user : styles.bot
                }`}
              >
                {msg.sender === "bot" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  <span>{msg.text}</span>
                )}
              </div>
            ))}
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
