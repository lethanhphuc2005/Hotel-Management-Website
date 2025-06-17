"use client";

import React, { useState } from "react";
import styles from "./dangky.module.css";
import { useRouter } from "next/navigation";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const RegisterPage = () => {
  const [first_name, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepassword, setShowRepassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== repassword) {
      setMessage("❌ Mật khẩu không khớp.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/v1/account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name, email, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${result.message || "Đăng ký thất bại"}`);
      } else {
        localStorage.setItem("email", email);
        setMessage("✅ Đăng ký thành công. Đang chuyển sang xác minh OTP...");
        setTimeout(() => {
          router.push("/OTP");
        }, 1500);
      }
    } catch (error) {
      setMessage("❌ Có lỗi xảy ra khi đăng ký.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>ĐĂNG KÝ</h2>
        <div className={styles.separator}></div>
        <p className={styles.welcomeText}>Chào mừng đến với The Moon</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.input}
            placeholder="Họ tên"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="email"
            className={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              className={styles.input}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>
          <div className={styles.passwordContainer}>
            <input
              type={showRepassword ? "text" : "password"}
              className={styles.input}
              placeholder="Nhập lại mật khẩu"
              value={repassword}
              onChange={(e) => setRepassword(e.target.value)}
              required
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowRepassword(!showRepassword)}
            >
              {showRepassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>
          <p className={styles.infoText}>
            Chúng tôi sẽ gửi mã xác minh OTP qua email của bạn.
          </p>
          <button type="submit" className={styles.continueButton}>
            Tiếp tục
          </button>
          {message && (
            <p style={{ color: message.includes("✅") ? "green" : "red", marginTop: "1rem", textAlign: "center" }}>
              {message}
            </p>
          )}
        </form>
        <div className={styles.text}>
          <p>
            Đã có tài khoản? <a href="/login">Đăng nhập</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;