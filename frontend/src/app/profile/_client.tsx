"use client";
import styles from "@/styles/pages/profile.module.css";
import { useState } from "react";
import { AccountSection } from "@/components/pages/profile/AccountSection";
import { PasswordSection } from "@/components/pages/profile/PasswordSection";
import BookedRoomSection from "@/components/pages/profile/BookedSection";
import CommentSection from "@/components/pages/profile/CommentSection";
import ReviewSection from "@/components/pages/profile/ReviewSection";
import FavoriteSection from "@/components/pages/profile/FavoriteSection";
import WalletSection from "@/components/pages/profile/WalletSection";
import { useAuth } from "@/contexts/AuthContext";

const ProfilePage = () => {
  const { user, refetchProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  if (!user) {
    return <div className={styles.container}>Loading...</div>;
  }
  const userId = user?.id || "";

  const handleLogout = () => {
    logout();
  };

  const renderSection = () => {
    switch (activeTab) {
      case "account":
        return <AccountSection user={user} refreshProfile={refetchProfile} />;
      case "wallet":
        return <WalletSection userId={userId} />;
      case "change-password":
        return <PasswordSection userId={userId} />;
      case "booked-rooms":
        return <BookedRoomSection userId={userId} />;
      case "comments":
        return <CommentSection userId={userId} />;
      case "reviews":
        return <ReviewSection userId={userId} />;
      case "favorites":
        return <FavoriteSection userId={userId} />;
      default:
        return <AccountSection user={user} refreshProfile={refetchProfile} />;
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.settingsWrapper}>
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Quản lý tài khoản</h2>
          <ul className={styles.sidebarMenu}>
            {[
              { tab: "account", label: "Thông tin cá nhân" },
              { tab: "wallet", label: "Ví của tôi" },
              { tab: "change-password", label: "Đổi mật khẩu" },
              { tab: "booked-rooms", label: "Phòng đã đặt" },
              { tab: "favorites", label: "Mục yêu thích" },
              { tab: "comments", label: "Bình luận" },
              { tab: "reviews", label: "Đánh giá" },
            ].map(({ tab, label }) => (
              <li
                key={tab}
                className={`${styles.sidebarItem} ${
                  activeTab === tab ? styles.active : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {label}
              </li>
            ))}
            <li onClick={handleLogout} className={styles.logoutItem}>
              Đăng xuất
            </li>
          </ul>
        </aside>

        <main className={styles.mainContent}>{renderSection()}</main>
      </div>
    </div>
  );
};

export default ProfilePage;
