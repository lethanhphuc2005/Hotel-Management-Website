"use client";
import { RoomClass } from "@/types/roomClass";

export default function RoomInfo({
  roomClass,
  numChildrenUnder6 = 0,
  numchildrenOver6 = 0,
  numAdults = 1,
  hasWeekend = false,
  capacity,
}: {
  roomClass: RoomClass;
  numChildrenUnder6: number;
  numchildrenOver6: number;
  numAdults: number;
  hasWeekend: boolean;
  capacity: number;
}) {
  const showExtraBed = numChildrenUnder6 > 0;
  const totalGuests = numAdults + numChildrenUnder6 + numchildrenOver6;
  const isExtraBedNeeded = totalGuests > roomClass.capacity;

  return (
    <div>
      <p className="fs-5 fw-bold mb-2">{roomClass.name}</p>
      <p className="mb-1">Hướng: {roomClass.view}</p>
      <p className="mb-1">
        Số giường: {roomClass.bed.quantity} giường {roomClass.bed.type}
      </p>
      <p className="mb-1">Sức chứa: {roomClass.capacity} người</p>
      <p className="mb-1">Mô tả: {roomClass.description}</p>

      {roomClass.features && roomClass.features.length > 0 && (
        <p className="mb-1">
          Tiện nghi:
          {roomClass.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="badge bg-secondary ms-1">
              {feature.feature.name}
            </span>
          ))}
          {roomClass.features.length > 3 && (
            <span className="badge bg-secondary ms-1">
              +{roomClass.features.length - 3}
            </span>
          )}
        </p>
      )}

      <p className="mb-1 text-warning">
        <i className="bi bi-check2"></i> Miễn phí hủy
      </p>
      <p className="mb-1 text-warning">
        <i className="bi bi-check2"></i> Không cần thanh toán trước
      </p>

      {hasWeekend && (
        <p className="mb-1 text-warning">
          <i className="bi bi-check2"></i> Cuối tuần tính thêm phụ phí 50% đêm
        </p>
      )}

      {showExtraBed && (
        <p className="mb-1 text-warning">
          <i className="bi bi-check2"></i> Miễn phí cho trẻ dưới 7 tuổi ngủ cùng
          bố mẹ
        </p>
      )}

      {isExtraBedNeeded && (
        <p className="mb-1 text-warning">
          <i className="bi bi-check2"></i> Có thể chọn thêm giường phụ cho{" "}
          {totalGuests - roomClass.capacity} khách
        </p>
      )}
    </div>
  );
}
