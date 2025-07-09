"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "@/styles/pages/register.module.css";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  register,
  resendVerificationEmail,
  verifyEmail,
} from "@/services/AuthService";

const validateRegisterForm = (
  first_name: string,
  last_name: string,
  phone: string,
  address: string,
  email: string,
  password: string,
  repassword: string
) => {
  if (
    !first_name ||
    !last_name ||
    !phone ||
    !address ||
    !email ||
    !password ||
    !repassword
  ) {
    return "Vui lòng điền đầy đủ thông tin";
  }
  if (password !== repassword) {
    return "Mật khẩu không khớp";
  }
  if (phone.length < 10) {
    return "Số điện thoại phải có ít nhất 10 chữ số";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Email không hợp lệ";
  }
  return null;
};

const RegisterPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepassword, setShowRepassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (step === 1) {
      const validationError = validateRegisterForm(
        first_name,
        last_name,
        phone,
        address,
        email,
        password,
        repassword
      );
      if (validationError) {
        toast.error(validationError);
        return;
      }

      try {
        // Gửi yêu cầu tạo tài khoản và gửi OTP
        const res = await register(
          first_name,
          last_name,
          email,
          password,
          phone,
          address
        );

        if (!res.success) {
          toast.error(res.message);
          return;
        }

        toast.success("Mã OTP đã được gửi đến email của bạn");
        setResendCooldown(60);
        setStep(2);
      } catch (error) {
        toast.error("Đăng ký thất bại. Vui lòng thử lại sau.");
      }
    }

    if (step === 2) {
      if (otp.length !== 6) {
        toast.error("Mã OTP phải có 6 chữ số.");
        return;
      }

      try {
        const res = await verifyEmail(email, otp);
        if (!res.success) {
          toast.error(res.message);
          return;
        }

        toast.success("Xác thực thành công. Đăng ký hoàn tất.");
        router.push("/login");
      } catch (error) {
        toast.error("Xác thực thất bại. Vui lòng thử lại.");
      }
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    try {
      const res = await resendVerificationEmail(email);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Mã OTP đã được gửi lại");
      setResendCooldown(60);
    } catch (error) {
      toast.error("Gửi lại mã OTP thất bại.");
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.formContainer}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className={styles.title}>ĐĂNG KÝ</h2>
        <div className={styles.separator}></div>
        <p className={styles.welcomeText}>Chào mừng đến với The Moon</p>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className={styles.flexRow}>
                <motion.input
                  type="text"
                  className={styles.inputHalf}
                  placeholder="Họ"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  whileFocus={{ scale: 1.03, borderColor: "#fab320" }}
                  autoComplete="family-name"
                />
                <motion.input
                  type="text"
                  className={styles.inputHalf}
                  placeholder="Tên"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  whileFocus={{ scale: 1.03, borderColor: "#fab320" }}
                  autoComplete="given-name"
                />
              </div>
              <motion.input
                type="text"
                className={styles.input}
                placeholder="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                whileFocus={{ scale: 1.03, borderColor: "#fab320" }}
                autoComplete="tel"
              />
              <motion.input
                type="text"
                className={styles.input}
                placeholder="Địa chỉ"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                whileFocus={{ scale: 1.03, borderColor: "#fab320" }}
                autoComplete="street-address"
              />
              <motion.input
                type="email"
                className={styles.input}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                whileFocus={{ scale: 1.03, borderColor: "#fab320" }}
                autoComplete="email"
              />
              <div className={styles.passwordContainer}>
                <motion.input
                  type={showPassword ? "text" : "password"}
                  className={styles.input}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  whileFocus={{ scale: 1.03, borderColor: "#fab320" }}
                />
                <span
                  className={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                ></span>
              </div>
              <div className={styles.passwordContainer}>
                <motion.input
                  type={showRepassword ? "text" : "password"}
                  className={styles.input}
                  placeholder="Nhập lại mật khẩu"
                  value={repassword}
                  onChange={(e) => setRepassword(e.target.value)}
                  required
                  whileFocus={{ scale: 1.03, borderColor: "#fab320" }}
                />
                <span
                  className={styles.eyeIcon}
                  onClick={() => setShowRepassword(!showRepassword)}
                ></span>
              </div>
              <p className={styles.infoText}>
                Chúng tôi sẽ gửi mã xác minh OTP qua email của bạn.
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <p className={styles.infoText}>
                Mã xác minh đã được gửi đến email <strong>{email}</strong>.
              </p>
              <motion.input
                type="text"
                className={styles.input}
                placeholder="Nhập mã xác minh OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                whileFocus={{ scale: 1.03, borderColor: "#fab320" }}
              />
              <button
                type="button"
                className={styles.resendButton}
                disabled={resendCooldown > 0}
                onClick={handleResendOTP}
              >
                {resendCooldown > 0
                  ? `Gửi lại mã (${resendCooldown}s)`
                  : "Gửi lại mã OTP"}
              </button>
            </>
          )}

          <motion.button
            type="submit"
            className={styles.continueButton}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
          >
            {step === 1 ? "Tiếp tục" : "Xác nhận"}
          </motion.button>

          <div className={styles.text}>
            <p>
              Đã có tài khoản?{" "}
              <Link href="/login" className={styles.registerLink}>
                Đăng nhập
              </Link>
            </p>
          </div>
        </form>

        <div className={styles.orContainer}>
          <div className={styles.orLine}></div>
          <span className={styles.orText}>Hoặc</span>
          <div className={styles.orLine}></div>
        </div>

        <motion.div
          className={styles.socialLogin}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <a href="#">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="#">
            <i className="bi bi-twitter"></i>
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
