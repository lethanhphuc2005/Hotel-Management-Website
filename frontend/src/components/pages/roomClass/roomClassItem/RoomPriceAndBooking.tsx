export default function RoomPriceAndBooking({
  hasSearched,
  numberOfNights,
  numberOfAdults = 1,
  numChildrenUnder6 = 0,
  numchildrenOver6 = 0,
  totalPrice,
  basePrice,
}: {
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
        VND{" "}
        {hasSearched
          ? totalPrice.toLocaleString("vi-VN")
          : basePrice.toLocaleString("vi-VN")}
      </h5>
      <p style={{ fontSize: "12px" }}>Đã bao gồm thuế và phí</p>
      <button
        className="border-0 rounded text-black"
        style={{
          height: "40px",
          width: "150px",
          backgroundColor: "#FAB320",
        }}
      >
        Đặt phòng <i className="bi bi-chevron-right"></i>
      </button>
    </div>
  );
}
