import { FC } from "react";
import { formatCurrencyVN } from "@/utils/currencyUtils";

const PriceSummary: FC<{
  total: number;
  onSubmit: () => void;
}> = ({ total, onSubmit }) => (
  <div className="card p-4 bg-black border text-white">
    <h6 className="fw-bold" style={{ color: "#FAB320" }}>
      Tóm tắt giá
    </h6>
    <div className="row mb-2">
      <div className="col">Tạm tính</div>
      <div className="col text-end">{formatCurrencyVN(total)}</div>
    </div>
    <hr />
    <div className="row">
      <div className="col fw-bold">Tổng cộng</div>
      <div className="col text-end fw-bold fs-5" style={{ color: "#FAB320" }}>
        {formatCurrencyVN(total)}
      </div>
    </div>
    <button
      className="btn mt-4 w-100 text-black"
      style={{ backgroundColor: "#FAB320", height: "50px" }}
      onClick={onSubmit}
    >
      Hoàn tất đặt phòng
    </button>
  </div>
);

export default PriceSummary;
