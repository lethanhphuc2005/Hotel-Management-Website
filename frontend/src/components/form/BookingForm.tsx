import { FC } from "react";

interface BookingFormProps {
  name: string;
  setName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  request?: string;
  setRequest: (val: string) => void;
}

const BookingForm: FC<BookingFormProps> = ({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  request = "",
  setRequest,
}) => {
  return (
    <div className="card mb-4 p-4 bg-black border text-white">
      <h5>Nhập thông tin chi tiết của bạn</h5>
      <div className="d-flex gap-2 border p-3 rounded mt-2 mb-5">
        <i className="bi bi-exclamation-circle-fill"></i>
        <p className="mb-0">
          Gần xong rồi! Chỉ cần điền phần thông tin{" "}
          <span style={{ color: "red" }}>*</span> bắt buộc
        </p>
      </div>
      <form>
        <div className="row">
          <div className="mb-3">
            <label className="form-label">
              Họ và tên <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              className="form-control bg-black text-white"
              placeholder="VD: Lê Thành Phúc"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">
            Số điện thoại <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="tel"
            className="form-control bg-black text-white"
            placeholder="VD: 0123456789"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">
            Địa chỉ email <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="email"
            className="form-control bg-black text-white"
            placeholder="VD: example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Yêu cầu đặc biệt</label>
          <textarea
            className="form-control bg-black text-white"
            placeholder="VD: Tôi cần một phòng yên tĩnh, không có tiếng ồn"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
