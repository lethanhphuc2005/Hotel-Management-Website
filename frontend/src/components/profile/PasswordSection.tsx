"use client";

import styles from "@/styles/profile/AccountSection.module.css";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-toastify";
import { savePassword } from "@/services/ProfileService";

interface Props {
  formData: {
    id: string;
  };
}

const validatePassword = (user: any) => {
  const errors: string[] = [];
  if (!user.password) errors.push("Mật khẩu hiện tại là bắt buộc.");
  if (!user.newPassword) errors.push("Mật khẩu mới là bắt buộc.");
  if (!user.confirmNewPassword)
    errors.push("Xác nhận mật khẩu mới là bắt buộc.");
  if (user.newPassword !== user.confirmNewPassword)
    errors.push("Mật khẩu mới và xác nhận mật khẩu mới không khớp.");
  if (user.newPassword.length < 6)
    errors.push("Mật khẩu mới phải có ít nhất 6 ký tự.");
  if (user.newPassword.length > 20)
    errors.push("Mật khẩu mới không được vượt quá 20 ký tự.");
  if (user.newPassword && user.newPassword.includes(" "))
    errors.push("Mật khẩu mới không được chứa khoảng trắng.");
  return errors;
};

export function PasswordSection({ formData }: Props) {
  const user = formData;
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "password") setPassword(value);
    else if (name === "newPassword") setNewPassword(value);
    else if (name === "confirmNewPassword") setConfirmNewPassword(value);
  };

  const handleSave = async () => {
    const updatedData = {
      password,
      newPassword,
      confirmNewPassword,
    };

    try {
      const errors = validatePassword(updatedData);
      if (errors.length > 0) {
        toast.error(errors.join("\n"), {
          style: { whiteSpace: "pre-line" },
        });
        return;
      }
      const res = await savePassword(user.id, password, newPassword);
      if (res.error) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message || "Đổi mật khẩu thành công!");
      setPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      toast.error("Đổi mật khẩu thất bại. Vui lòng thử lại sau.");
      console.error("Error changing password:", error);
    }
  };

  return (
    <motion.section
      className={styles.section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className={styles.infoRow}>
        <label>Mật khẩu hiện tại</label>
        <input type="password" name="password" onChange={handleChange} />
      </div>
      <div className={styles.infoRow}>
        <label>Mật khẩu mới</label>
        <input type="password" name="newPassword" onChange={handleChange} />
      </div>
      <div className={styles.infoRow}>
        <label>Xác nhận mật khẩu mới</label>
        <input
          type="password"
          name="confirmNewPassword"
          onChange={handleChange}
        />
      </div>

      <div className={styles.buttonRow}>
        <motion.button
          type="button"
          onClick={handleSave}
          whileHover={{ scale: 1.05, opacity: 0.9 }}
          whileTap={{ scale: 0.95, opacity: 0.8 }}
        >
          Lưu
        </motion.button>
      </div>
    </motion.section>
  );
}
