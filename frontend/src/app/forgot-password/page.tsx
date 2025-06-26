"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./page.module.css";
import { toast } from "react-toastify";
import { forgotPassword, resetPassword } from "@/services/AuthService";
import { useRouter } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";
import Link from "next/link";

export default function ResetPasswordFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setLoading } = useLoading();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await forgotPassword(email);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
    } catch (error) {
      console.error("Lỗi khi gửi mã OTP:", error);
      toast.error("Đã xảy ra lỗi khi gửi mã OTP. Vui lòng thử lại sau.");
      return;
    }
    toast.success("Mã OTP đã được gửi tới email của bạn.");
    setStep(2);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      if (newPassword.length < 6) {
        toast.error("Mật khẩu mới phải có ít nhất 6 ký tự.");
        return;
      }
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }
    if (otp.length !== 6) {
      toast.error("Mã xác nhận phải có 6 ký tự.");
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword(email, otp, newPassword);
      // console.log("Reset password response:", res);
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success("Mật khẩu đã được đặt lại thành công.");
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      router.push("/login");
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại sau.");
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.formContainer}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {step === 1 && (
          <>
            <h2 className={styles.title}>QUÊN MẬT KHẨU</h2>
            <div className={styles.separator}></div>
            <p className={styles.description}>
              Nhập email bạn đã đăng ký để nhận mã xác nhận.
            </p>
            <form onSubmit={handleSendOTP}>
              <motion.input
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                whileFocus={{ scale: 1.03, borderColor: "#fab320" }}
                required
              />
              <button type="submit" className={styles.submitButton}>
                Gửi mã xác nhận
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className={styles.title}>ĐẶT LẠI MẬT KHẨU</h2>
            <div className={styles.separator}></div>
            <p className={styles.description}>
              Nhập mã xác nhận đã gửi tới <strong>{email}</strong> và đặt lại
              mật khẩu mới.
            </p>
            <button
              type="button"
              onClick={async () => {
                try {
                  const res = await forgotPassword(email);
                  if (!res.success) {
                    toast.error(res.message);
                    return;
                  }
                  toast.success("Mã OTP đã được gửi lại.");
                } catch (error) {
                  toast.error("Gửi lại OTP thất bại. Vui lòng thử lại sau.");
                }
              }}
              className={styles.resendButton}
            >
              Gửi lại mã
            </button>
            <form onSubmit={handleResetPassword}>
              <motion.input
                type="text"
                placeholder="Mã xác nhận"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={styles.input}
                required
                whileFocus={{ scale: 1.03, borderColor: "#fab320" }}
              />
              <motion.input
                type="password"
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
                required
                whileFocus={{ scale: 1.03, borderColor: "#fab320" }}
              />
              <motion.input
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                required
                whileFocus={{ scale: 1.03, borderColor: "#fab320" }}
              />
              <button type="submit" className={styles.submitButton}>
                Đặt lại mật khẩu
              </button>
            </form>
          </>
        )}

        <div className={styles.backLink}>
          {step > 1 ? (
            <button
              onClick={() => setStep(1)}
              style={{ cursor: "pointer", background: "none", border: "none" }}
            >
              ← Quay lại
            </button>
          ) : (
            <button>
              <Link href="/login" className={styles.backLink}>
                ← Quay lại đăng nhập
              </Link>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
