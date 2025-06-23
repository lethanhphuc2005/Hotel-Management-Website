"use client";

import styles from "@/app/profile/quanly.module.css";

interface Props {
  formData: {
    first_name: string;
    email: string;
    phone_number: string;
    address: string;
  };
}

const AccountSection = ({ formData }: Props) => (
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

export default AccountSection;
