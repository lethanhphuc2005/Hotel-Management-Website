'use client';

import React, { useState } from 'react';
import styles from './Login.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Đăng nhập với email:", email, "và password:", password);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Đăng Nhập</h2>
        <div className={styles.separator}></div>
        <p className={styles.welcomeText}>Chào mừng đến với The Moon</p>

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
          <p className={styles.infoText}>
           Chúng tôi sẽ gọi hoặc nhắn tin cho bạn để xác nhận số điện thoại. Có áp dụng phí dữ liệu và tin nhắn tiêu chuẩn. Chính sách quyền riêng tư.
          </p>

          <button type="submit" className={styles.continueButton}>Tiếp tục</button>
           <div className={styles.text}>
           <p>
               Bạn chưa có tài khoản?  <a href="">Đăng ký</a>
          </p>
              <p>
              <a href="">Quên mật khẩu?</a>
          </p>
          </div>
        </form>

        <div className={styles.orContainer}>
          <div className={styles.orLine}></div>
          <span className={styles.orText}>Hoặc</span>
          <div className={styles.orLine}></div>
        </div>

        <div className={styles.socialLogin}>
          <a href=""><i className="bi bi-google"></i></a>
          <a href=""><i className="bi bi-facebook"></i></a>
          <a href=""><i className="bi bi-apple"></i></a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;