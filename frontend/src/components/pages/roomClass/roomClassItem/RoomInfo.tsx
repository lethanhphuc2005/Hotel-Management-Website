import { RoomClass } from "@/types/roomClass";

export default function RoomInfo({
  roomClass,
  numChildrenUnder6 = 0,
  numchildrenOver6 = 0,
  numAdults = 1,
}: {
  roomClass: RoomClass;
  numChildrenUnder6?: number;
  numchildrenOver6?: number;
  numAdults?: number;
}) {
  const extraBedTeens = Math.max(
    0,
    numchildrenOver6 - (roomClass.bed_amount * 2 - numAdults)
  );
  const showExtraBed =
    numChildrenUnder6 > 0 &&
    numAdults + numchildrenOver6 === roomClass.bed_amount * 2;

  return (
    <div>
      <p className="fs-5 fw-bold mb-2">{roomClass.name}</p>
      <p className="mb-1">Hướng: {roomClass.view}</p>
      <p className="mb-1">Số giường: {roomClass.bed_amount} giường {roomClass.bed_type}</p>
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

      {showExtraBed && (
        <p className="mb-1 text-warning">
          <i className="bi bi-check2"></i> Miễn phí cho trẻ dưới 7 tuổi ngủ cùng
          bố mẹ
        </p>
      )}
      {extraBedTeens > 0 && (
        <p className="mb-1 text-warning">
          <i className="bi bi-check2"></i> Phụ thu thêm giường: 100.000đ/đêm
        </p>
      )}
    </div>
  );
}
