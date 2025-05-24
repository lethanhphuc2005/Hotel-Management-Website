'use client';

import React, { useState } from 'react';
import styles from './dangky.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword, ] = useState('');
  const [repassword, setRepassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Đăng nhập với email:", email, "và password:", password);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Đăng Ký</h2>
        <div className={styles.separator}></div> {/* Đường kẻ ngang */}
        <p className={styles.welcomeText}>Chào mừng đến với The Moon</p> {/* Lời chào */}

        <form onSubmit={handleSubmit}>
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
           <p className={styles.infoText}>
          Chúng tôi sẽ gọi điện hoặc nhắn tin cho bạn để xác nhận số điện thoại. Có áp dụng phí dữ liệu và phí tin nhắn tiêu chuẩn. Chính sách quyền riêng tư.
        </p>

          <button type="submit" className={styles.continueButton}>Tiếp tục</button>
        </form>
         </div>
      </div>

  );
};

export default LoginPage;