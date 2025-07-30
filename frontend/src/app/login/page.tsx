"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import styles from "@/styles/pages/login.module.css";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Link from "next/link";
import { resendVerificationEmail, verifyEmail } from "@/services/AuthService";
import { showConfirmDialog } from "@/utils/swal";
import { facebookLogin, googleLogin } from "@/api/authApi";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [resendCooldown, setResendCooldown] = useState(60);
  const { login } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      // The redirect will be handled in the callback page
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(
        "Đã xảy ra lỗi khi đăng nhập bằng Google. Vui lòng thử lại sau."
      );
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await facebookLogin();
    } catch (error) {
      console.error("Facebook login error:", error);
      toast.error(
        "Đã xảy ra lỗi khi đăng nhập bằng Facebook. Vui lòng thử lại sau."
      );
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      if (
        !res.success &&
        res.message ===
          "Tài khoản chưa được xác minh. Vui lòng kiểm tra email để xác minh tài khoản."
      ) {
        const result = await showConfirmDialog(
          "Tài khoản chưa được xác minh",
          "Bạn cần xác minh tài khoản để đăng nhập. Bạn có muốn gửi lại email xác minh không?",
          "Gửi lại",
          "Huỷ"
        );

        if (!result) {
          toast.error("Bạn cần xác minh tài khoản để đăng nhập.");
          return;
        } else {
          const response = await resendVerificationEmail(email);
          if (!response.success) {
            toast.error(response.message);
            return;
          }
          toast.success("Email xác minh đã được gửi lại");
          setStep(2);
          setOtp("");
          setResendCooldown(60);
          return;
        }
      }
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.");
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await verifyEmail({ email, verificationCode: otp });
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Xác minh thành công. Vui lòng đăng nhập lại.");
      setStep(1);
      setOtp("");
    } catch (error) {
      toast.error("Lỗi xác minh.");
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
      toast.error("Đã xảy ra lỗi khi gửi lại mã OTP");
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
        {step === 1 && (
          <>
            <h2 className={styles.title}>ĐĂNG NHẬP</h2>
            <div className={styles.separator}></div>
            <p className={styles.welcomeText}>Chào mừng đến với The Moon</p>

            <form onSubmit={handleSubmit}>
              <motion.input
                type="email"
                className={styles.input}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                whileFocus={{ scale: 1.03, borderColor: "#fab320" }}
              />
              <motion.input
                type="password"
                className={styles.input}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                whileFocus={{ scale: 1.03, borderColor: "#fab320" }}
              />
              <p className={styles.infoText}>
                <Link
                  href="/forgot-password"
                  className={styles.forgotPasswordLink}
                >
                  Quên mật khẩu?
                </Link>
              </p>

              <motion.button
                type="submit"
                className={styles.continueButton}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
              >
                Đăng Nhập
              </motion.button>

              <div className={styles.text}>
                <p>
                  Bạn chưa có tài khoản?{" "}
                  <Link href="/register" className={styles.registerLink}>
                    Đăng ký ngay
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
              <a href="#" onClick={handleGoogleLogin}>
                <i className="bi bi-google"></i>
              </a>
              <a href="#" onClick={handleFacebookLogin}>
                <i className="bi bi-facebook"></i>
              </a>
            </motion.div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className={styles.title}>XÁC MINH EMAIL</h2>
            <div className={styles.separator}></div>
            <p className={styles.welcomeText}>
              Nhập mã OTP đã gửi đến <strong>{email}</strong>
            </p>
            <form onSubmit={handleVerifyEmail}>
              <motion.input
                type="text"
                placeholder="Mã xác nhận"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={styles.input}
                required
                whileFocus={{ scale: 1.03, borderColor: "#fab320" }}
              />
              <button type="submit" className={styles.continueButton}>
                Xác minh
              </button>
              <button
                type="button"
                onClick={handleResendOTP}
                className={styles.resendButton}
                disabled={resendCooldown > 0}
              >
                {resendCooldown > 0
                  ? `Gửi lại sau ${resendCooldown}s`
                  : "Gửi lại mã OTP"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default LoginPage;
