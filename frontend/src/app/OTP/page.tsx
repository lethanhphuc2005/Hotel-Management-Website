"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./otp.module.css";

export default function OTPPage() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push("/register");
    }
  }, [router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    try {
      const res = await fetch("http://localhost:8000/v1/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const result = await res.json();
      if (!res.ok) {
        setMessage(`❌ ${result.message || "Xác minh thất bại"}`);
      } else {
        setMessage("✅ Xác minh OTP thành công!");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (error) {
      setMessage("❌ Lỗi khi xác minh OTP.");
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await fetch("http://localhost:8000/v1/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();
      if (res.ok) {
        setMessage("✅ OTP mới đã được gửi!");
        setCountdown(60); // đếm ngược 60 giây
      } else {
        setMessage(`❌ ${result.message || "Không thể gửi lại OTP"}`);
      }
    } catch (error) {
      setMessage("❌ Lỗi khi gửi lại OTP.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Xác minh OTP</h2>
        <p className={styles.desc}>
          Nhập mã OTP đã gửi đến <strong>{email}</strong>
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.input}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Nhập mã OTP..."
            required
          />
          <button type="submit" className={styles.btn}>Xác minh</button>
        </form>

        <button
          className={styles.resendBtn}
          onClick={handleResendOtp}
          disabled={countdown > 0}
        >
          {countdown > 0 ? `Gửi lại sau ${countdown}s` : "Gửi lại OTP"}
        </button>

        {message && (
          <p
            className={styles.message}
            style={{ color: message.includes("✅") ? "lime" : "red" }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
