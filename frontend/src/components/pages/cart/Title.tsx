"use client";
import styles from "@/styles/pages/cart.module.css";
import Link from "next/link";
import { AnimatedButton } from "@/components/common/Button";

export default function CartTitle() {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className={styles.cartTitle}>Giỏ Hàng</div>

      <Link href="/room-class">
        <AnimatedButton className="tw-px-5 tw-py-2">
          ← Tiếp tục đặt phòng
        </AnimatedButton>
      </Link>
    </div>
  );
}
