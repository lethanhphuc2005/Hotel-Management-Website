"use client";

import { useState, useEffect } from "react";
import styles from "./forgotpassword.module.css";

export default function ForgotPasswordFlow() {
  const [step, setStep] = useState(1); // 1: Nhập email, 2: OTP, 3: Reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(60); // Đếm ngược 60 giây
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);

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
        setTimer(60);
        setCanResend(false);
      } else {
        setMessage(data.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      setMessage("Lỗi hệ thống");
    }
  };

  const handleResendOtp = async () => {
    if (canResend) {
      console.log("Đang gửi lại OTP cho:", email);
      try {
        const res = await fetch("http://localhost:8000/v1/auth/resend-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok) {
          setMessage("Đã gửi lại OTP thành công");
          setTimer(60);
          setCanResend(false);
        } else {
          setMessage(data.message || "Gửi lại OTP thất bại");
        }
      } catch (err) {
        setMessage("Lỗi hệ thống");
      }
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
    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu nhập lại không khớp");
      return;
    }
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
        <div className={styles.progressBar}>
          <div className={`${styles.step} ${step >= 1 ? styles.completed : ""}`}>
            {step > 1 ? "✔" : "1"}
          </div>
          <div className={`${styles.step} ${step >= 2 ? styles.completed : ""}`}>
            {step > 2 ? "✔" : "2"}
          </div>
          <div className={`${styles.step} ${step >= 3 ? styles.completed : ""}`}>
            {step > 3 ? "✔" : "3"}
          </div>
          <div
            className={styles.progressLine}
            style={{ width: `${(step - 1) * 50}%` }} // Di chuyển logic vào đây
          />
        </div>
        {step === 1 && (
          <>
            <h2 className={styles.title}>🔑 Quên Mật Khẩu</h2>
            <input
              type="email"
              className={styles.input}
              placeholder="Nhập email của bạn..."
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
            <h2 className={styles.title}>📩 Xác Minh OTP</h2>
            <input
              type="text"
              className={styles.input}
              placeholder="Nhập mã OTP..."
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button className={styles.button} onClick={handleVerifyOtp}>
              Xác Minh
            </button>
            <p className={styles.timer}>
              Thời gian còn lại: {timer}s{" "}
              {canResend ? (
                <span className={styles.resend} onClick={handleResendOtp}>
                  Gửi lại OTP
                </span>
              ) : null}
            </p>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className={styles.title}>🔒 Đặt Lại Mật Khẩu</h2>
            <input
              type="password"
              className={styles.input}
              placeholder="Mật khẩu mới..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              className={styles.input}
              placeholder="Nhập lại mật khẩu..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className={styles.button} onClick={handleResetPassword}>
              Xác Nhận
            </button>
          </>
        )}

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}