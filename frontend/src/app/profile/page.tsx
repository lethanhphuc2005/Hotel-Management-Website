"use client";

import styles from "./quanly.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/api/profileApi";
import AccountSection from "@/components/profile/AccountSection";
import NotificationSection from "@/components/profile/NotificationSection";
import RoomSection from "@/components/profile/RoomSection";
import ChangeInfoSection from "@/components/profile/ChangeInfoSection";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("account");
  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
    phone_number: "",
    address: "",
    subscribed: true,
  });
  const [bookedRooms, setBookedRooms] = useState([]);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await getProfile(user.id);
        const data = res.data;
        setProfile(data);
        setFormData({
          first_name: data.first_name || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
          address: data.address || "",
          subscribed: data.subscribed ?? true,
        });
        setBookedRooms(data.bookedRooms || []);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
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
            setSubscribed={(val: boolean) =>
              setFormData((prev) => ({ ...prev, subscribed: val }))
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

  if (!profile)
    return <div className={styles.loading}>Đang tải dữ liệu...</div>;

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
