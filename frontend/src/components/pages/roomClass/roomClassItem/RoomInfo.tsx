import { RoomClass } from "@/types/roomClass";

export default function RoomInfo({
  rci,
  numChildrenUnder6 = 0,
  numchildrenOver6 = 0,
  numAdults = 1,
  showExtraBedOver6,
}: {
  rci: RoomClass;
  numChildrenUnder6?: number;
  numchildrenOver6?: number;
  numAdults?: number;
  showExtraBedOver6?: boolean;
}) {
  const showExtraBed =
    numChildrenUnder6 > 0 &&
    numAdults + numchildrenOver6 === rci.bed_amount * 2;

  return (
    <div>
      <p className="fs-5 fw-bold mb-2">{rci.name}</p>
      <p className="mb-1">Hướng: {rci.view}</p>
      <p className="mb-1">Số giường: {rci.bed_amount} giường đôi</p>
      <p className="mb-1">Sức chứa: {rci.capacity} người</p>
      <p className="mb-1">Mô tả: {rci.description}</p>

      {rci.features && rci.features.length > 0 && (
        <p className="mb-1">
          Tiện nghi:
          {rci.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="badge bg-secondary ms-1">
              {feature.feature_id.name}
            </span>
          ))}
          {rci.features.length > 3 && (
            <span className="badge bg-secondary ms-1">
              +{rci.features.length - 3}
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
      {showExtraBedOver6 && (
        <p className="mb-1 text-warning">
          <i className="bi bi-check2"></i> Phụ thu thêm giường: 100.000đ/đêm
        </p>
      )}
    </div>
  );
}
