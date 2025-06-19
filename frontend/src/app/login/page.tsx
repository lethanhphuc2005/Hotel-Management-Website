"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./Login.module.css";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const success = await login(email, password);
      if (!success) {
        setMessage("❌ Email hoặc mật khẩu không đúng.");
      } else {
        setMessage("✅ Đăng nhập thành công!");
        setTimeout(() => {
          router.push("/");
        }, 300);
      }
    } catch (error) {
      setMessage("❌ Đã xảy ra lỗi khi đăng nhập.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>ĐĂNG NHẬP</h2>
        <div className={styles.separator}></div>
        <p className={styles.welcomeText}>Chào mừng đến với The Moon</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.input}
            placeholder="Tên đăng nhập"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className={styles.input}
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className={styles.infoText}>
            <a href="/quenmk" style={{ color: "white" }}>
              Quên mật khẩu? Nhấn vào đây
            </a>
          </p>

          <button type="submit" className={styles.continueButton}>
            Đăng Nhập
          </button>

          {message && (
            <p
              style={{
                color: message.includes("thành công") ? "green" : "red",
                textAlign: "center",
                marginTop: "1rem",
              }}
            >
              {message}
            </p>
          )}

          <div className={styles.text}>
            <p>
              Bạn chưa có tài khoản? <a href="/register">Đăng ký</a>
            </p>
          </div>
        </form>

        <div className={styles.orContainer}>
          <div className={styles.orLine}></div>
          <span className={styles.orText}>Hoặc</span>
          <div className={styles.orLine}></div>
        </div>

        <div className={styles.socialLogin}>
          <a href="">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="">
            <i className="bi bi-twitter"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
