"use client";
import styles from "./page.module.css";
import { useState } from "react";
import { AccountSection } from "@/components/profile/AccountSection";
import { PasswordSection } from "@/components/profile/PasswordSection";
import BookingSection from "@/components/profile/BookedSection";
import { useProfile } from "@/hooks/useProfile";
import CommentSection from "@/components/profile/CommentSection";
import ReviewSection from "@/components/profile/ReviewSection";
import FavoriteSection from "@/components/profile/FavoriteSection";

const ProfilePage = () => {
  const {
    profile,
    formData,
    bookedRooms,
    comments,
    setComments,
    reviews,
    setReviews,
    favorites,
    setFavorites,
    logout,
  } = useProfile();
  console.log("Profile data:", profile);

  const [activeTab, setActiveTab] = useState("account");
  const handleLogout = () => {
    logout();
  };

  const renderSection = () => {
    switch (activeTab) {
      case "account":
        return <AccountSection formData={formData} />;
      case "change-password":
        return <PasswordSection formData={formData} />;
      case "booked-rooms":
        return <BookingSection bookings={bookedRooms} />;
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
    return (
      <div
        className={styles.loading}
        style={{ color: "#fab320", textAlign: "center", padding: "2rem" }}
      >
        Đang tải dữ liệu...
      </div>
    );

  return (
    <div
      className={styles.container}
      style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh" }}
    >
      <div className={styles.settingsWrapper} style={{ display: "flex" }}>
        <aside
          className={styles.sidebar}
          style={{ backgroundColor: "#111", padding: "1.5rem", width: "250px" }}
        >
          <h2 style={{ color: "#fab320" }}>Quản lý tài khoản</h2>
          <ul
            className={styles.sidebarMenu}
            style={{ listStyle: "none", padding: 0 }}
          >
            {[
              { tab: "account", label: "Thông tin cá nhân" },
              { tab: "change-password", label: "Đổi mật khẩu" },
              { tab: "booked-rooms", label: "Phòng đã đặt" },
              { tab: "favorites", label: "Mục yêu thích" },
              { tab: "comments", label: "Bình luận" },
              { tab: "reviews", label: "Đánh giá" },
            ].map(({ tab, label }) => (
              <li
                key={tab}
                className={activeTab === tab ? styles.active : ""}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "0.75rem 1rem",
                  cursor: "pointer",
                  backgroundColor:
                    activeTab === tab ? "#fab320" : "transparent",
                  color: activeTab === tab ? "#000" : "#fff",
                  marginBottom: "0.5rem",
                  borderRadius: "8px",
                  transition: "0.3s",
                }}
              >
                {label}
              </li>
            ))}
            <li
              onClick={handleLogout}
              className={styles.logoutItem}
              style={{
                color: "#fab320",
                cursor: "pointer",
                marginTop: "2rem",
                padding: "0.75rem 1rem",
              }}
            >
              Đăng xuất
            </li>
          </ul>
        </aside>

        <main
          className={styles.mainContent}
          style={{ flex: 1, padding: "2rem" }}
        >
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
