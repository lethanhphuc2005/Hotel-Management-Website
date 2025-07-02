"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { showNumberInputDialog, showPaymentMethodDialog } from "@/utils/swal"; // Giả định bạn đã có CustomSwal
import { toast } from "react-toastify";
import { formatCurrencyVN } from "@/utils/currencyUtils";

interface WalletTransaction {
  id: string;
  amount: number;
  type: "DEPOSIT" | "WITHDRAW";
  description: string;
  date: string;
}

export default function WalletSection({ userId }: { userId: string }) {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  useEffect(() => {
    setBalance(4500000);
    setTransactions([
      {
        id: "tx1",
        amount: 1000000,
        type: "DEPOSIT",
        description: "Nạp tiền vào ví",
        date: "2025-06-25",
      },
      {
        id: "tx2",
        amount: 200000,
        type: "WITHDRAW",
        description: "Thanh toán đặt phòng",
        date: "2025-06-26",
      },
    ]);
  }, [userId]);

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
    console.log("Selected payment method:", method);
    if (amountStr) {
      const amount = Number(amountStr);
      const newBalance = balance + amount;
      const newTransaction: WalletTransaction = {
        id: `tx_${Date.now()}`,
        amount,
        type: "DEPOSIT",
        description: "Nạp tiền vào ví",
        date: new Date().toISOString().split("T")[0],
      };

      setBalance(newBalance);
      setTransactions((prev) => [newTransaction, ...prev]);
      toast.success(`Nạp ${formatCurrencyVN(amount)} thành công!`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="tw-space-y-6"
    >
      <div className="tw-flex tw-items-center tw-justify-between">
        <h2 className="tw-text-2xl tw-font-bold tw-text-primary">
          Ví của tôi
        </h2>
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
          {formatCurrencyVN(balance)}
        </p>
      </div>

      <div className="tw-bg-black/60 tw-rounded-xl tw-p-6 tw-shadow-xl tw-border tw-border-gray-700">
        <h3 className="tw-text-xl tw-font-semibold tw-text-white mb-4">
          Lịch sử giao dịch
        </h3>
        <ul className="tw-space-y-3">
          {transactions.length === 0 ? (
            <p className="tw-text-gray-400">Chưa có giao dịch nào.</p>
          ) : (
            transactions.map((tx) => (
              <li
                key={tx.id}
                className="tw-border-b tw-border-gray-600 tw-pb-3 tw-flex tw-justify-between tw-items-center"
              >
                <div>
                  <p className="tw-text-white">{tx.description}</p>
                  <p className="tw-text-xs tw-text-gray-400">{tx.date}</p>
                </div>
                <p
                  className={`tw-text-sm tw-font-semibold ${
                    tx.type === "DEPOSIT"
                      ? "tw-text-green-400"
                      : "tw-text-red-400"
                  }`}
                >
                  {tx.type === "DEPOSIT" ? "+" : "-"}
                  {tx.amount.toLocaleString("vi-VN")}₫
                </p>
              </li>
            ))
          )}
        </ul>
      </div>
    </motion.div>
  );
}
