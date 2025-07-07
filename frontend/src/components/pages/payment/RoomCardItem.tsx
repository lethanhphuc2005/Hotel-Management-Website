import { FC } from "react";
import { getRoomTotalPrice } from "@/contexts/cartSelector";
import { formatCurrencyVN } from "@/utils/currencyUtils";

interface RoomCartItemProps {
  room: any;
  onRemove?: (roomId: string) => void;
}

const RoomCartItem: FC<RoomCartItemProps> = ({ room, onRemove }) => {
  if (!room) return null;
  console.log("RoomCartItem rendered with room:", room);
  const handleRemove = () => {
    if (onRemove) {
      onRemove(room.id);
    }
  };

  return (
    <div className="tw-bg-[#1a1a1a] tw-text-white tw-rounded-xl tw-shadow-lg tw-p-4 tw-mb-4 tw-flex tw-gap-4 tw-border tw-border-white/20">
      {/* Thumbnail nhỏ góc trái */}
      <div className="tw-w-28 tw-h-full tw-flex-shrink-0 tw-rounded-lg tw-overflow-hidden tw-text-center">
        <img
          src="/img/r1.jpg"
          alt="room"
          className="tw-w-full tw-h-20 tw-object-cover tw-mb-2"
        />
        <button
          onClick={handleRemove}
          className="tw-text-red-500 tw-border tw-border-red-500 tw-px-4 tw-py-2 tw-rounded tw-text-xs hover:tw-bg-red-500 hover:tw-text-white tw-transition-all"
        >
          Xoá khỏi giỏ
        </button>
      </div>

      {/* Nội dung */}
      <div className="tw-flex-1 tw-space-y-1">
        <h3 className="tw-text-primary tw-font-semibold tw-text-base">
          {room.name} - {formatCurrencyVN(room.price)}/đêm
        </h3>
        <p className="tw-text-sm">
          Nhận: <strong>{room.checkIn}</strong>
        </p>
        <p className="tw-text-sm">
          Trả: <strong>{room.checkOut}</strong>
        </p>
        <p className="tw-text-sm">
          Dịch vụ:{" "}
          <strong>
            {room.services
              ? room.services
                  .map((s: any) => `${s.name} - ${formatCurrencyVN(s.price)}`)
                  .join(", ")
              : "Không có dịch vụ"}
          </strong>
        </p>
        <p className="tw-text-sm">
          {room.nights} đêm - {room.bedAmount} giường đôi
        </p>
        <p className="tw-text-sm">
          Khách:{" "}
          <strong>
            {room.adults} người lớn, {room.childrenOver6 || 0} trẻ em,{" "}
            {room.childrenUnder6 || 0} trẻ nhỏ
          </strong>
        </p>

        <p className="tw-text-sm">
          Tổng: <strong>{formatCurrencyVN(getRoomTotalPrice(room))}</strong>
        </p>

        <p className="tw-text-sm tw-text-primary">
          {room.hasSaturdayNight || room.hasSundayNight
            ? "+50% phụ thu do cuối tuần"
            : "Không phụ thu"}
        </p>
      </div>
    </div>
  );
};

export default RoomCartItem;
