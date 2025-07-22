"use client";

import styles from "@/styles/pages/profile.module.css";
import { saveProfile } from "@/services/ProfileService";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGem,
  faWallet,
  faBed,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { formatCurrencyVN } from "@/utils/currencyUtils";
import { User } from "@/types/user";

interface Props {
  formData: {
    id: string;
    first_name: string;
    last_name: string;
    address: string;
    email: string;
    phone_number: string;
    request?: string;
    is_verified?: boolean;
  };
  profile?: User; // Optional profile prop for additional data
}

const validateUser = (user: any) => {
  const errors: string[] = [];
  if (!user.email) errors.push("Email is required.");
  if (!user.phone_number) errors.push("Phone number is required.");

  // Additional validation can be added here
  if (user.email && !/\S+@\S+\.\S+/.test(user.email)) {
    errors.push("Email format is invalid.");
  }
  if (user.phone_number && !/^\d{10,15}$/.test(user.phone_number)) {
    errors.push("Phone number must be between 10 and 15 digits.");
  }
  if (user.request && user.request.length > 500) {
    errors.push("Request must be less than 500 characters.");
  }
  if (user.first_name.length > 50) {
    errors.push("First name must be less than 50 characters.");
  }
  if (user.last_name.length > 50) {
    errors.push("Last name must be less than 50 characters.");
  }
  return errors;
};

export function AccountSection({ formData, profile }: Props) {
  const [user, setUser] = useState(formData);
  const [information, setInformation] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setUser(formData);
    setIsEditing(false);
  };
  const handleSave = async () => {
    const updatedData = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      address: user.address,
      request: user.request || "",
    };

    try {
      const errors = validateUser(updatedData);
      if (errors.length > 0) {
        toast.error(errors.join(" "));
        return;
      }
      const response = await saveProfile(user.id, updatedData);
      if (!response.success) {
        toast.error(response.message || "Cập nhật thông tin thất bại.");
        return;
      }
      setUser((prev) => ({
        ...prev,
        ...updatedData,
      }));
      toast.success(response.message || "Cập nhật thông tin thành công!");
    } catch (error) {
      toast.error("Cập nhật thông tin thất bại. Vui lòng thử lại sau.");
      setUser(formData); // Reset to original data on error
      console.error("Error saving profile:", error);
    }

    setIsEditing(false);
  };

  return (
    <motion.section
      className={styles.section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="tw-bg-black tw-border tw-border-gray-700 tw-rounded-xl tw-p-5 tw-mb-6 tw-text-white">
        <h3 className="tw-text-lg tw-font-semibold tw-mb-4 tw-flex tw-items-center tw-gap-2 tw-text-[#FAB320]">
          <FontAwesomeIcon icon={faGem} />
          Cấp độ của bạn:
          <span
            className={`tw-ml-2 tw-px-3 tw-py-1 tw-rounded-full tw-text-sm tw-font-bold
        ${
          information?.level === "diamond"
            ? "tw-bg-gradient-to-r tw-from-blue-400 tw-to-cyan-400 tw-text-black"
            : information?.level === "gold"
            ? "tw-bg-yellow-400 tw-text-black"
            : information?.level === "silver"
            ? "tw-bg-gray-300 tw-text-black"
            : information?.level === "bronze"
            ? "tw-bg-amber-800 tw-text-white"
            : "tw-bg-gray-600 tw-text-white"
        }
      `}
          >
            {information?.level?.toUpperCase() || "NEWBIE"}
          </span>
        </h3>

        <ul className="tw-text-sm tw-space-y-2 tw-text-primary">
          <li className="tw-flex tw-items-center tw-gap-2">
            <FontAwesomeIcon icon={faWallet} />
            <span>
              <strong>Tổng chi tiêu:</strong>{" "}
              {formatCurrencyVN(information?.total_spent || 0)}
            </span>
          </li>
          <li className="tw-flex tw-items-center tw-gap-2">
            <FontAwesomeIcon icon={faBed} />
            <span>
              <strong>Tổng số đêm:</strong> {information?.total_nights || 0}
            </span>
          </li>
          <li className="tw-flex tw-items-center tw-gap-2">
            <FontAwesomeIcon icon={faCalendar} />
            <span>
              <strong>Lượt đặt phòng:</strong>{" "}
              {information?.total_bookings || 0}
            </span>
          </li>
        </ul>
      </div>

      <div className={styles.infoRow}>
        <label>Họ</label>
        <input
          type="text"
          name="last_name"
          value={user.last_name}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>
      <div className={styles.infoRow}>
        <label>Tên</label>
        <input
          type="text"
          name="first_name"
          value={user.first_name}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>
      <div className={styles.infoRow}>
        <label>
          Email
          <span
            className={user.is_verified ? styles.verified : styles.unverified}
          >
            {user.is_verified ? "Đã xác thực" : "Chưa xác thực"}
          </span>
        </label>

        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>

      <div className={styles.infoRow}>
        <label>Số điện thoại</label>
        <input
          type="tel"
          name="phone_number"
          value={user.phone_number}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>
      <div className={styles.infoRow}>
        <label>Địa chỉ</label>
        <input
          type="text"
          name="address"
          value={user.address}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>
      <div className={styles.infoRow}>
        <label>Yêu cầu đặc biệt</label>
        <textarea
          name="request"
          value={user.request || ""}
          disabled={!isEditing}
          onChange={handleChange}
        />
      </div>

      <div className={styles.buttonRow}>
        {isEditing ? (
          <>
            <motion.button
              type="button"
              onClick={handleSave}
              whileHover={{ scale: 1.05, opacity: 0.9 }}
              whileTap={{ scale: 0.95, opacity: 0.8 }}
            >
              Lưu
            </motion.button>
            <motion.button
              type="button"
              style={{ backgroundColor: "#f44336", color: "#fff" }}
              onClick={handleCancel}
              whileHover={{ scale: 1.05, opacity: 0.9 }}
              whileTap={{ scale: 0.95, opacity: 0.8 }}
            >
              Huỷ
            </motion.button>
          </>
        ) : (
          <motion.button
            type="button"
            onClick={handleEdit}
            whileHover={{ scale: 1.05, opacity: 0.9 }}
            whileTap={{ scale: 0.95, opacity: 0.8 }}
          >
            Sửa
          </motion.button>
        )}
      </div>
    </motion.section>
  );
}
