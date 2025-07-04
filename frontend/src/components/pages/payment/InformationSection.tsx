const InformationSection = () => {
  return (
    <>
      <div className="card mb-4 p-4 bg-black border text-white">
        <h6 className="fw-bold" style={{ color: "#FAB320" }}>
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
        <h6 className="fw-bold" style={{ color: "#FAB320" }}>
          Lưu ý:
        </h6>
        <p className="mb-2">
          <i className="bi bi-check2-circle me-2"></i> Hủy miễn phí trước:{" "}
          <strong style={{ color: "#FAB320" }}>
            14:00, Thứ 5, 9 tháng 5, 2025
          </strong>
        </p>
        <p>
          <i className="bi bi-alarm me-2"></i> Từ 14:00 ngày 10 tháng 5:{" "}
          <strong style={{ color: "#FAB320" }}>VND 1.417.500</strong>
        </p>
      </div>
      <div className="card p-4 bg-black border text-white">
        <h6 className="fw-bold" style={{ color: "#FAB320" }}>
          Xem lại quy tắc chung:
        </h6>
        <ul className="list-unstyled">
          <li>
            <i className="bi bi-ban me-2"></i> Không hút thuốc
          </li>
          <li>
            <i className="bi bi-bluesky me-2"></i> Không thú cưng
          </li>
          <li>
            <i className="bi bi-hourglass-top me-2"></i> Thời gian nhận phòng từ
            14:00
          </li>
          <li>
            <i className="bi bi-hourglass-bottom me-2"></i> Thời gian trả phòng
            từ 12:00
          </li>
        </ul>
      </div>
    </>
  );
};

export default InformationSection;
