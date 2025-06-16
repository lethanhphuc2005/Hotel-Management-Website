"use client";

import { useState } from "react";
import styles from "./forgotpassword.module.css";

export default function ForgotPasswordFlow() {
  const [step, setStep] = useState(1); // 1: Nhập email, 2: OTP, 3: Reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
    try {
      const res = await fetch("http://localhost:8000/v1/auth/forgot-password", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("OTP đã gửi tới email");
        setStep(2);
      } else {
        setMessage(data.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      setMessage("Lỗi hệ thống");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await fetch("http://localhost:8000/v1/auth/verify-reset-otp", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("OTP hợp lệ");
        setStep(3);
      } else {
        setMessage(data.message || "OTP không hợp lệ");
      }
    } catch (err) {
      setMessage("Lỗi hệ thống");
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await fetch("http://localhost:8000/v1/auth/reset-password", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Mật khẩu đã được đặt lại thành công");
      } else {
        setMessage(data.message || "Đặt lại mật khẩu thất bại");
      }
    } catch (err) {
      setMessage("Lỗi hệ thống");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        {step === 1 && (
          <>
            <h2 className={styles.title}>🔑 Quên mật khẩu</h2>
            <input
              type="email"
              className={styles.input}
              placeholder="Nhập email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className={styles.button} onClick={handleSendOtp}>
              Gửi OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className={styles.title}>📩 Nhập mã OTP</h2>
            <input
              type="text"
              className={styles.input}
              placeholder="Nhập OTP..."
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button className={styles.button} onClick={handleVerifyOtp}>
              Xác minh OTP
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className={styles.title}>🔒 Đặt lại mật khẩu</h2>
            <input
              type="password"
              className={styles.input}
              placeholder="Mật khẩu mới..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button className={styles.button} onClick={handleResetPassword}>
              Xác nhận
            </button>
          </>
        )}

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}
