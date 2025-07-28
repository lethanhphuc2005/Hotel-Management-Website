import { formatCurrencyVN } from "@/utils/currencyUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function RoomPriceAndBooking({
  roomClassId,
  hasSearched,
  numberOfNights,
  numberOfAdults = 1,
  numChildrenUnder6 = 0,
  numchildrenOver6 = 0,
  totalPrice,
  basePrice,
}: {
  roomClassId: string;
  hasSearched?: boolean;
  numberOfNights: number;
  numberOfAdults?: number;
  numChildrenUnder6?: number;
  numchildrenOver6?: number;
  totalPrice: number;
  basePrice: number;
}) {
  return (
    <div className="ms-auto align-self-end mb-2 text-end">
      {hasSearched && (
        <div className="mb-3" style={{ fontSize: "14px", lineHeight: 1.4 }}>
          <div className="mb-1">
            {numberOfNights} đêm, {numberOfAdults} người lớn
          </div>
          <div>
            {numChildrenUnder6 > 0 && `${numChildrenUnder6} trẻ 0-6 `}
            {numchildrenOver6 > 0 && `, ${numchildrenOver6} trẻ 7-17`}
          </div>
        </div>
      )}
      <h5 className="fw-bold text-white">
        {hasSearched ? (
          <p>Tổng: {formatCurrencyVN(totalPrice)}</p>
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
