"use client";
import styles from "@/styles/pages/cart.module.css";
import { formatCurrencyVN } from "@/utils/currencyUtils";
import Link from "next/link";

interface CartActionProps {
  total: number;
  handleDeleteCart: () => void;
}

export default function CartAction(props: CartActionProps) {
  const { total, handleDeleteCart } = props;
  return (
    <>
      <button
        className="btn btn-outline-danger tw-w-full"
        onClick={() => handleDeleteCart()}
      >
        Xóa toàn bộ giỏ phòng
      </button>
      <div className={styles.shippingBox + " mt-3"}>
        <div className={styles.summaryBox}>
          <div className={styles.summaryRow}>
            <span>Tạm tính</span>
            <span>{formatCurrencyVN(total)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Phí dịch vụ</span>
            <span>Miễn phí</span>
          </div>
          <div className={styles.summaryRow + " " + styles.summaryTotal}>
            <span>Tổng cộng</span>
            <span>{formatCurrencyVN(total)}</span>
          </div>
        </div>
        <div className="text-end mt-4 mb-1">
          <Link href="/payment" className={styles.checkoutBtn}>
            Đặt phòng ({formatCurrencyVN(total)})
          </Link>
        </div>
      </div>
    </>
  );
}
