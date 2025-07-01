"use client";
import styles from "./page.module.css";
import { useState } from "react";
import { AccountSection } from "@/components/pages/profile/AccountSection";
import { PasswordSection } from "@/components/pages/profile/PasswordSection";
import BookingSection from "@/components/pages/profile/BookedSection";
import { useProfile } from "@/hooks/useProfile";
import CommentSection from "@/components/pages/profile/CommentSection";
import ReviewSection from "@/components/pages/profile/ReviewSection";
import FavoriteSection from "@/components/pages/profile/FavoriteSection";
import WalletSection from "@/components/pages/profile/WalletSection";

const ProfilePage = () => {
  const {
    profile,
    formData,
    bookedRooms,
    setBookedRooms,
    comments,
    setComments,
    reviews,
    setReviews,
    favorites,
    setFavorites,
    logout,
  } = useProfile();

  const [activeTab, setActiveTab] = useState("account");
  const handleLogout = () => {
    logout();
  };

  const renderSection = () => {
    switch (activeTab) {
      case "account":
        return <AccountSection formData={formData} />;
      case "wallet":
        return <WalletSection userId={profile.id} />;
      case "change-password":
        return <PasswordSection formData={formData} />;
      case "booked-rooms":
        return (
          <BookingSection bookings={bookedRooms} setBookings={setBookedRooms} />
        );
      case "comments":
        return <CommentSection comments={comments} setComments={setComments} />;
      case "reviews":
        return <ReviewSection reviews={reviews} setReviews={setReviews} />;
      case "favorites":
        return (
          <FavoriteSection favorites={favorites} setFavorites={setFavorites} />
        );
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
