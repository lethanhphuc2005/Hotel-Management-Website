"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { showNumberInputDialog, showPaymentMethodDialog } from "@/utils/swal";
import { formatCurrencyVN } from "@/utils/currencyUtils";
import { formatDate } from "@/utils/dateUtils";
import { depositToWallet } from "@/services/WalletService";
import Pagination from "@/components/sections/Pagination";
import { WalletTransaction } from "@/types/wallet";
import { useUserWallet } from "@/hooks/data/useWallet";
import { toast } from "react-toastify";

interface Props {
  userId: string;
}

export default function WalletSection({ userId }: Props) {
  const { wallet, error } = useUserWallet(userId);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Không thể lấy thông tin ví.");
    }
  }, [error]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = wallet?.transactions.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = wallet?.transactions.slice(startIndex, endIndex);
  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const handleDeposit = async () => {
    const amountStr = await showNumberInputDialog(
      "Nạp tiền vào ví",
      "Nhập số tiền bạn muốn nạp",
      "0",
      "Nạp tiền",
      "Huỷ"
    );

    if (amountStr === null) {
      return; // Người dùng huỷ
    }
    const method = await showPaymentMethodDialog();

    if (!method) {
      return;
    }

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Số tiền nạp không hợp lệ. Vui lòng nhập lại.");
      return;
    }

    try {
      const response = await depositToWallet({ method, userId, amount });
      if (!response.success) {
        toast.error(response.message || "Nạp tiền thất bại. Vui lòng thử lại.");
        return;
      }

      const { payUrl } = response.data;
      if (payUrl) {
        // Mở liên kết thanh toán trong tab mới
        window.location.href = payUrl;
        // window.open(payUrl, "_blank");
      } else {
        toast.error("Không có liên kết thanh toán. Vui lòng thử lại sau.");
        return;
      }
      toast.success("Đang chuyển hướng đến trang thanh toán...");
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi nạp tiền. Vui lòng thử lại sau.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="tw-space-y-4"
    >
      <div className="tw-flex tw-items-center tw-justify-between">
        <h2 className="tw-text-2xl tw-font-bold tw-text-primary">Ví của tôi</h2>
        <button
          onClick={handleDeposit}
          className="tw-bg-primary tw-text-black tw-font-semibold tw-px-4 tw-py-2 tw-rounded-lg hover:tw-bg-[#e0a918]"
        >
          Nạp tiền
        </button>
      </div>

      <div className="tw-bg-black/60 tw-rounded-xl tw-p-6 tw-shadow-xl tw-border tw-border-gray-700">
        <p className="tw-text-lg tw-font-semibold tw-text-white">
          Số dư hiện tại:
        </p>
        <p className="tw-text-3xl tw-font-bold tw-text-primary">
          {formatCurrencyVN(wallet?.balance || 0)}
        </p>
      </div>

      <div className="tw-bg-black/60 tw-rounded-xl tw-p-6 tw-shadow-xl tw-border tw-border-gray-700">
        <h3 className="tw-text-xl tw-font-semibold tw-text-white mb-4">
          Lịch sử giao dịch
        </h3>
        <ul className="tw-space-y-3">
          {currentTransactions?.length === 0 ? (
            <p className="tw-text-gray-400">Chưa có giao dịch nào.</p>
          ) : (
            currentTransactions?.map((tx: WalletTransaction) => (
              <li
                key={tx.id}
                className="tw-border-b tw-border-gray-600 tw-pb-3 tw-flex tw-justify-between tw-items-center"
              >
                <div>
                  <p className="tw-text-white">{tx.note}</p>
                  <p className="tw-text-xs tw-text-gray-400">
                    {formatDate(tx.createdAt || new Date())}
                  </p>
                </div>
                <p
                  className={`tw-text-sm tw-font-semibold ${
                    tx.type === "deposit" ||
                    tx.type === "bonus" ||
                    tx.type === "refund"
                      ? "tw-text-green-400"
                      : "tw-text-red-400"
                  }`}
                >
                  {tx.type === "deposit" ||
                  tx.type === "bonus" ||
                  tx.type === "refund"
                    ? "+"
                    : "-"}
                  {tx.amount.toLocaleString("vi-VN")}₫
                </p>
              </li>
            ))
          )}
        </ul>
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            onPageChange={handlePageChange}
            forcePage={currentPage - 1}
          />
        )}
      </div>
    </motion.div>
  );
}
