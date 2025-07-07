import { formatCurrencyVN } from "@/utils/currencyUtils";

export default function PriceSummary({
  total,
  discounts = [],
  onSubmit,
}: {
  total: number;
  discounts?: { name: string; reason: string; amount: number }[];
  onSubmit: () => void;
}) {
  const discountTotal = discounts.reduce((sum, d) => sum + d.amount, 0);
  const final = total - discountTotal;

  return (
    <div className="tw-bg-[#1f1f1f] tw-text-white tw-rounded-2xl tw-shadow-xl tw-p-6 tw-space-y-4 tw-mt-6">
      <h4 className="tw-text-xl tw-font-bold tw-text-[#FAB320] tw-mb-4">
        Tóm tắt giá
      </h4>

      <div className="tw-flex tw-justify-between">
        <span>Tổng tiền phòng:</span>
        <span>{formatCurrencyVN(total)}</span>
      </div>

      {discounts.length > 0 && (
        <div className="tw-border-t tw-border-white/10 tw-pt-2">
          <p className="tw-text-[#FAB320] tw-font-semibold tw-mb-2">
            Khuyến mãi áp dụng:
          </p>
          <ul className="tw-text-sm tw-space-y-1">
            {discounts.map((d, i) => (
              <li key={i} className="tw-flex tw-justify-between">
                <span>- {d.name}</span>
                <span>-{formatCurrencyVN(d.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="tw-border-t tw-border-white/10 tw-pt-4 tw-flex tw-justify-between tw-items-center">
        <span className="tw-font-bold tw-text-lg tw-text-[#FAB320]">
          Tổng thanh toán:
        </span>
        <span className="tw-font-bold tw-text-lg">
          {formatCurrencyVN(final)}
        </span>
      </div>

      <button
        onClick={onSubmit}
        className="tw-w-full tw-bg-[#FAB320] tw-text-black tw-font-bold tw-rounded-xl tw-py-3 hover:tw-bg-[#ffc844] tw-transition-all"
      >
        Xác nhận & Thanh toán
      </button>
    </div>
  );
}
