import { formatCurrencyVN } from "@/utils/currencyUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function RoomPriceAndBooking({
  roomClassId,
  hasSearched,
  numberOfNights,
  basePrice,
  totalPrice,
}: {
  roomClassId: string;
  hasSearched?: boolean;
  numberOfNights: number;
  basePrice: number;
  totalPrice: number;
}) {

  return (
    <div className="ms-auto align-self-end mb-2 text-end">
      {hasSearched && (
        <div
          className="mb-3"
          style={{ fontSize: "14px", lineHeight: 1.4 }}
        ></div>
      )}
      <h5 className="fw-bold text-white">
        {hasSearched ? (
          <p>
            Tổng: {formatCurrencyVN(totalPrice)} /{numberOfNights} đêm
          </p>
        ) : (
          <p>Giá từ: {formatCurrencyVN(basePrice)} /đêm</p>
        )}
      </h5>
      <p style={{ fontSize: "12px" }}>Đã bao gồm thuế và phí</p>
      <Link
        href={`/room-class/${roomClassId}`}
        className=" tw-text-decoration-none tw-btn tw-btn-primary tw-px-4 tw-py-2 tw-rounded-xl tw-bg-primary tw-text-black tw-font-bold tw-align-items"
      >
        <button className="">
          Xem thêm
          <FontAwesomeIcon icon={faChevronRight} className="tw-ml-2" />
        </button>
      </Link>
    </div>
  );
}
