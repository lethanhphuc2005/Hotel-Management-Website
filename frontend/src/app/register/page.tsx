"use client";

import React, { useState } from 'react';
import styles from './dangky.module.css';
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [first_name, setFirstName] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [message, setMessage] = useState('');
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
        body: JSON.stringify({ first_name, phone_number, email, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${result.message || "Đăng ký thất bại"}`);
      } else {
        setMessage("✅ Đăng ký thành công! Đang chuyển hướng...");
        setFirstName('');
        setPhoneNumber('');
        setEmail('');
        setPassword('');
        setRepassword('');
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      setMessage("❌ Có lỗi xảy ra khi đăng ký.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Đăng Ký</h2>
        <div className={styles.separator}></div>
        <p className={styles.welcomeText}>Chào mừng đến với The Moon</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.input}
            placeholder="Nhập tên của bạn"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            className={styles.input}
            placeholder="Nhập số điện thoại của bạn"
            value={phone_number}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <input
            type="email"
            className={styles.input}
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className={styles.input}
            placeholder="Nhập password của bạn"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className={styles.input}
            placeholder="Nhập lại password của bạn"
            value={repassword}
            onChange={(e) => setRepassword(e.target.value)}
            required
          />

     

          <button type="submit" className={styles.continueButton}>Tiếp tục</button>

          {message && (
            <p
              style={{
                color: message.includes("✅") ? "green" : "red",
                textAlign: "center",
                marginTop: "1rem",
              }}
            >
              {message}
            </p>
          )}

          <div className={styles.text}>
            <p>
              Bạn đã có tài khoản? <a href="/login">Đăng nhập</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
