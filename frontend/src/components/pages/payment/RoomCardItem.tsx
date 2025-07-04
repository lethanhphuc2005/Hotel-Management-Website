import { FC } from "react";
import { getRoomTotalPrice } from "@/contexts/cartSelector";
import { formatDate } from "@/utils/dateUtils";
import { useDispatch } from "react-redux";
import { removeRoomFromCart } from "@/contexts/cartSlice"; // Adjust the import path as needed

interface RoomCartItemProps {
  room: any;
  onRemove?: (roomId: string) => void;
}

const RoomCartItem: FC<RoomCartItemProps> = ({ room, onRemove }) => {
  if (!room) return null;

  const handleRemove = () => {
    if (onRemove) {
      onRemove(room.id); // Gọi callback từ cha
    }
  };

  return (
    <div className="card mb-4 bg-black border text-white">
      <img
        className="card-img-top p-3"
        src="/img/r1.jpg"
        alt="room"
        style={{ height: "300px", objectFit: "cover" }}
      />
      <div className="card-body">
        <h5 className="card-title mb-3" style={{ color: "#FAB320" }}>
          {room.name} - {room.price.toLocaleString("vi-VN")} VNĐ/đêm
        </h5>
        <div className="mb-2">
          {room.features && room.features.length > 0 && (
            <p className="mb-1">
              Tiện nghi:
              {room.features.slice(0, 3).map((feature: any, index: number) => (
                <span key={index} className="badge bg-secondary ms-1">
                  {feature}
                </span>
              ))}
              {room.features.length > 3 && (
                <span className="badge bg-secondary ms-1">
                  +{room.features.length - 3}
                </span>
              )}
            </p>
          )}
        </div>
        <p className="mb-1">
          Nhận phòng: <strong>{formatDate(room.checkIn)}</strong>
        </p>
        <p className="mb-1">
          Trả phòng: <strong>{formatDate(room.checkOut)}</strong>
        </p>
        <p className="mb-1">
          Số đêm:{" "}
          <strong>
            {room.nights} đêm - {room.bedAmount} giường đôi
          </strong>
        </p>
        <p className="mb-1">
          {room.services && room.services.length > 0 && (
            <>
              Dịch vụ:
              {room.services.map((service: any, index: number) => (
                <span key={index} className="badge bg-secondary ms-1">
                  {service.name} - {service.quantity}x -{" "}
                  {service.price.toLocaleString("vi-VN")} VNĐ
                </span>
              ))}
            </>
          )}
        </p>
        <p className="mb-1">
          Số khách:{" "}
          <strong>
            {room.adults} người lớn,{" "}
            {room.childrenOver6 ? room.childrenOver6 : 0} trẻ em,{" "}
            {room.childrenUnder6 ? room.childrenUnder6 : 0} trẻ nhỏ
          </strong>
        </p>
        <p className="mb-1">
          Tổng giá:{" "}
          <strong>{getRoomTotalPrice(room).toLocaleString("vi-VN")} VNĐ</strong>
        </p>
        <p className="mb-1">
          Phụ thu cuối tuần:{" "}
          <strong>
            {room.hasSaturdayNight || room.hasSundayNight
              ? "+50% phụ thu do có đêm cuối tuần"
              : "Không có phụ thu"}
          </strong>
        </p>
        <button
          className="btn btn-outline-danger w-100 mt-2"
          onClick={handleRemove}
        >
          Xóa khỏi giỏ
        </button>
      </div>
    </div>
  );
};

export default RoomCartItem;
