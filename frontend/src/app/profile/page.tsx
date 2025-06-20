"use client";

import styles from "./quanly.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// 👇 Tạo các component con ở đây luôn hoặc tách file nếu muốn
const AccountSection = ({ formData }: any) => (
  <section className={styles.section}>
    <h3>Basic info</h3>
    <div className={styles.profileInfo}>
      <img
        src="https://tse3.mm.bing.net/th/id/OIP.kUFzwD5-mfBV0PfqgI5GrAHaHa?rs=1&pid=ImgDetMain"
        alt="Avatar"
        className={styles.avatar}
      />
      <span className={styles.uploadText}>Upload new picture</span>
      <span className={styles.removeText}>Remove</span>
    </div>

    <div className={styles.infoRow}>
      <label>Name</label>
      <input type="text" value={formData.first_name} readOnly />
    </div>
    <div className={styles.infoRow}>
      <label>Email</label>
      <input type="email" value={formData.email} readOnly />
    </div>
    <div className={styles.infoRow}>
      <label>Phone</label>
      <input type="tel" value={formData.phone_number} readOnly />
    </div>
    <div className={styles.infoRow}>
      <label>Address</label>
      <input type="text" value={formData.address} readOnly />
    </div>
  </section>
);

const RoomSection = ({ bookedRooms }: any) => (
  <section className={styles.section}>
    <h3>Phòng đã đặt</h3>
    <ul className={styles.bookedList}>
      {bookedRooms.map((room: any) => (
        <li key={room.id}>
          {room.name} - Ngày: {room.date}
        </li>
      ))}
    </ul>
  </section>
);

const ChangeInfoSection = () => (
  <section className={styles.section}>
    <h3>Chỉnh sửa thông tin</h3>
    <p>Bạn có thể thêm form ở đây để thay đổi tên, số điện thoại,...</p>
  </section>
);

const NotificationSection = ({ subscribed, setSubscribed }: any) => (
  <section className={styles.section}>
    <h3>Thông báo</h3>
    <div className={styles.notificationRow}>
      <input
        type="checkbox"
        checked={subscribed}
        onChange={() => setSubscribed((prev: boolean) => !prev)}
      />
      <label style={{ marginLeft: "8px" }}>
        Tôi muốn nhận tin tức và ưu đãi đặc biệt
      </label>
    </div>
    <div style={{ marginTop: "10px" }}>
      <button className={styles.deleteBtn}>Xóa tài khoản</button>
      <button className={styles.editBtn}>Chỉnh sửa</button>
    </div>
  </section>
);

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("account");

  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
    phone_number: "",
    address: "",
    subscribed: true,
  });

  const [bookedRooms, setBookedRooms] = useState([
    { id: 1, name: "Phòng Deluxe", date: "2025-06-10" },
    { id: 2, name: "Phòng VIP", date: "2025-06-12" },
  ]);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        address: user.address || "",
        subscribed: true,
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const renderSection = () => {
    switch (activeTab) {
      case "account":
        return <AccountSection formData={formData} />;
      case "notification":
        return (
          <NotificationSection
            subscribed={formData.subscribed}
            setSubscribed={(value: boolean) =>
              setFormData((prev) => ({ ...prev, subscribed: value }))
            }
          />
        );
      case "room":
        return <RoomSection bookedRooms={bookedRooms} />;
      case "changeinfo":
        return <ChangeInfoSection />;
      default:
        return <AccountSection formData={formData} />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.settingsWrapper}>
        <aside className={styles.sidebar}>
          <h2>Settings</h2>
          <ul className={styles.sidebarMenu}>
            <li
              className={activeTab === "account" ? styles.active : ""}
              onClick={() => setActiveTab("account")}
            >
              Account
            </li>
            <li
              className={activeTab === "notification" ? styles.active : ""}
              onClick={() => setActiveTab("notification")}
            >
              Notifications
            </li>
            <li
              className={activeTab === "room" ? styles.active : ""}
              onClick={() => setActiveTab("room")}
            >
              Room
            </li>
            <li
              className={activeTab === "changeinfo" ? styles.active : ""}
              onClick={() => setActiveTab("changeinfo")}
            >
              Changer information
            </li>
            <li onClick={handleLogout} className={styles.logoutItem}>
              Đăng xuất
            </li>
          </ul>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.header}>
            <h2>Account Settings</h2>
          </div>
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;