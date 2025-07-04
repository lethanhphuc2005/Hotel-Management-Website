import { FC, JSX } from "react";
import { motion } from "framer-motion";
import { formatCurrencyVN } from "@/utils/currencyUtils";

interface Method {
  label: string;
  value: string;
  icon: JSX.Element;
}

interface PaymentMethodsProps {
  methods: Method[];
  selectedMethod: string;
  onSelect: (method: string) => void;
  walletBalance: number;
}

const PaymentMethods: FC<PaymentMethodsProps> = ({
  methods,
  selectedMethod,
  onSelect,
  walletBalance,
}) => {
  return (
    <div className="card p-4 mt-4 bg-black border text-white mb-4">
      <h6 className="fw-bold mb-4" style={{ color: "#FAB320" }}>
        Phương thức thanh toán
      </h6>
      <div className="d-flex flex-column gap-3">
        {methods.map((method) => (
          <motion.label
            key={method.value}
            className="payment-option border p-3 rounded d-flex align-items-center gap-3"
            animate={
              selectedMethod === method.value ? "selected" : "unselected"
            }
            variants={{
              selected: {
                backgroundColor: "#FAB320",
                color: "black",
                borderColor: "#FAB320",
              },
              unselected: {
                backgroundColor: "transparent",
                color: "white",
                borderColor: "white",
              },
            }}
            onClick={() => onSelect(method.value)}
            style={{ cursor: "pointer" }}
          >
            <input
              type="radio"
              value={method.value}
              className="form-check-input mt-0"
              checked={selectedMethod === method.value}
              onChange={() => onSelect(method.value)}
            />
            {method.icon}
            <span className="fw-semibold">{method.label}</span>
            {method.value === "wallet" && (
              <span className="tw-text-secondary ms-auto">
                {formatCurrencyVN(walletBalance)}
              </span>
            )}
          </motion.label>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
