import { formatCurrencyVN } from "@/utils/currencyUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { AnimatedButtonPrimary } from "@/components/common/Button";

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
    <div className="align-self-end mb-2 text-end">
      <h5 className="fw-bold text-white mb-0 tw-inline-block tw-whitespace-nowrap">
        {hasSearched ? (
          <>
            Tổng: {formatCurrencyVN(totalPrice)} <br /> /{numberOfNights} đêm
          </>
        ) : (
          <>Giá từ: {formatCurrencyVN(basePrice)} /đêm</>
        )}
      </h5>
      <p className="tw-text-xs tw-inline-block">Đã bao gồm thuế và phí</p>
      <Link
        href={`/room-class/${roomClassId}`}
        className="text-decoration-none"
      >
        <AnimatedButtonPrimary className="tw-p-2 tw-inline-block tw-whitespace-nowrap">
          <FontAwesomeIcon icon={faChevronRight} className="me-2" />
          Xem chi tiết
        </AnimatedButtonPrimary>
      </Link>
    </div>
  );
}
