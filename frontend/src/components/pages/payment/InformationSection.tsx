"use client";

import { formatDate } from "@/utils/dateUtils";
import { formatCurrencyVN } from "@/utils/currencyUtils";

interface CancelItem {
  label: string;
  from: Date;
  to: Date | null;
  feePercent: number;
  description: string;
}

interface Props {
  cancelPolicyTimeline: CancelItem[];
  total_price: number;
}

const InformationSection = ({ cancelPolicyTimeline, total_price }: Props) => {
  return (
    <>
      <div className="card mb-4 p-4 bg-black border text-white">
        <h6 className="fw-bold tw-text-primary">
          Mách nhỏ:
        </h6>
        <ul className="mb-0 list-unstyled">
          <li>
            <i className="bi bi-stars me-2"></i> Căn hộ sạch bong
          </li>
          <li>
            <i className="bi bi-cash me-2"></i> Giá tốt nhất hôm nay
          </li>
          <li>
            <i className="bi bi-credit-card-fill me-2"></i> Thanh toán ngay để
            có phòng ưng ý
          </li>
          <li>
            <i className="bi bi-check2-circle me-2"></i> Miễn phí: hủy, đổi
            ngày, đặt lại phòng
          </li>
        </ul>
      </div>

      <div className="card mb-4 p-4 bg-black border text-white">
        <h6 className="fw-bold tw-text-primary">
          Chính sách hủy phòng:
        </h6>
        <div className="tw-text-sm">
          {cancelPolicyTimeline.map((item, idx) => (
            <div key={idx} className="mb-2">
              <p className="mb-1">
                <i className="bi bi-alarm me-2"></i>
                Từ{" "}
                <strong className="tw-text-primary">
                  {formatDate(item.from)}
                </strong>{" "}
                đến{" "}
                <strong className="tw-text-primary">
                  {item.to ? formatDate(item.to) : "khi nhận phòng"}
                </strong>
                :
              </p>
              <p>
                <i className="bi bi-currency-exchange me-2"></i>
                {item.description}
                {item.feePercent > 0 && (
                  <span>
                    {" "}
                    Số tiền huỷ:{" "}
                    <strong className="text-danger">
                      {formatCurrencyVN((item.feePercent / 100) * total_price)}
                    </strong>
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-black border text-white">
        <h6 className="fw-bold tw-text-primary">
          Quy tắc chung:
        </h6>
        <ul className="list-unstyled">
          <li>
            <i className="bi bi-ban me-2"></i> Không hút thuốc
          </li>
          <li>
            <i className="bi bi-bluesky me-2"></i> Không thú cưng
          </li>
          <li>
            <i className="bi bi-hourglass-top me-2"></i> Nhận phòng từ 14:00
          </li>
          <li>
            <i className="bi bi-hourglass-bottom me-2"></i> Trả phòng trước
            12:00
          </li>
        </ul>
      </div>
    </>
  );
};

export default InformationSection;
