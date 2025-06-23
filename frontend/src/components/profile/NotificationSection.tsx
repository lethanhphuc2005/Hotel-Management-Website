"use client";

import styles from "@/app/profile/quanly.module.css";

interface Props {
  subscribed: boolean;
  setSubscribed: (value: boolean) => void;
}

const NotificationSection = ({ subscribed, setSubscribed }: Props) => (
  <section className={styles.section}>
    <h3>Thông báo</h3>
    <div className={styles.notificationRow}>
      <input
        type="checkbox"
        checked={subscribed}
        onChange={() => setSubscribed(!subscribed)}
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

export default NotificationSection;
