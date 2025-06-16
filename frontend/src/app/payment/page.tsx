import style from "./payment.module.css"
export default function PayMent() {
    return (
        <div className="container" style={{ marginTop: "120px", marginBottom: "100px" }}>
            <div className="row">
                {/* Left Column - Form & Notes */}
                <div className="col-md-7">
                    <div className="card mb-4 p-4 bg-black border text-white">
                        <h5>Nhập thông tin chi tiết của bạn</h5>
                        <div className="d-flex gap-2 border p-3 rounded mt-2 mb-5">
                            <i className="bi bi-exclamation-circle-fill"></i>
                            <p className="mb-0">Gần xong rồi! Chỉ cần điền phần thông tin <span style={{color: "red"}}>*</span> bắt buộc <br />
                                Vui lòng nhập thông tin của bạn bằng kí tự Latin để chỗ nghỉ có thể hiểu được</p>
                        </div>
                        <form className={style.form}>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Họ <span style={{color: "red"}}>*</span></label>
                                        <input type="text" className="form-control bg-black text-white" placeholder="VD: Nguyễn" />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Tên <span style={{color: "red"}}>*</span></label>
                                        <input type="text" className="form-control bg-black text-white" placeholder="VD: Văn A" />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Số điện thoại <span style={{color: "red"}}>*</span></label>
                                <input type="tel" className="form-control bg-black text-white" placeholder="VD: 0123456789" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Địa chỉ email <span style={{color: "red"}}>*</span></label>
                                <input type="email" className="form-control bg-black text-white" placeholder="VD: example@gmail.com" />
                            </div>
                        </form>
                    </div>

                    <div className="card mb-4 p-4 bg-black border text-white">
                        <h6 className="fw-bold" style={{ color: "#FAB320" }}>Mách nhỏ:</h6>
                        <ul className="mb-0 list-unstyled">
                            <li><i className="bi bi-stars me-2"></i> Căn hộ sạch bong</li>
                            <li><i className="bi bi-cash me-2"></i> Giá tốt nhất hôm nay</li>
                            <li><i className="bi bi-credit-card-fill me-2"></i> Thanh toán ngay để có phòng ưng ý</li>
                            <li><i className="bi bi-check2-circle me-2"></i> Miễn phí: hủy, đổi ngày, đặt lại phòng</li>
                        </ul>
                    </div>

                    <div className="card mb-4 p-4 bg-black border text-white">
                        <h6 className="fw-bold" style={{ color: "#FAB320" }}>Lưu ý:</h6>
                        <p className="mb-2"><i className="bi bi-check2-circle me-2"></i> Hủy miễn phí trước:  <strong style={{ color: "#FAB320" }}>14:00, Thứ 5, 9 tháng 5, 2025</strong></p>
                        <p><i className="bi bi-alarm me-2"></i> Từ 14:00 ngày 10 tháng 5: <strong style={{ color: "#FAB320" }}>VND 1.417.500</strong></p>
                    </div>

                    <div className="card p-4 bg-black border text-white">
                        <h6 className="fw-bold" style={{ color: "#FAB320" }}>Xem lại quy tắc chung:</h6>
                        <ul className="list-unstyled">
                            <li><i className="bi bi-ban me-2"></i> Không hút thuốc</li>
                            <li><i className="bi bi-bluesky me-2"></i> Không thú cưng</li>
                            <li><i className="bi bi-hourglass-top me-2"></i> Thời gian nhận phòng từ 14:00</li>
                            <li><i className="bi bi-hourglass-bottom me-2"></i> Thời gian trả phòng từ 12:00</li>
                        </ul>
                    </div>
                </div>

                {/* Right Column - Room Info & Price */}
                <div className="col-md-5">
                    <div className="card mb-4 bg-black border text-white">
                        <img className="card-img-top p-3" src="/img/r1.jpg" alt="room" style={{ height: "300px", objectFit: "cover" }} />
                        <div className="card-body">
                            <h5 className="card-title mb-3">Phòng Deluxe - 3 beds - View Sea</h5>
                            <div className="mb-2">
                                <span className="badge bg-success me-1">WiFi miễn phí</span>
                                <span className="badge bg-success me-1">Chỗ đậu xe</span>
                                <span className="badge bg-success">Hồ bơi</span>
                            </div>
                            <p className="mb-1">Nhận phòng: <strong>Thứ 7, 10 tháng 5</strong> từ 14:00</p>
                            <p className="mb-1">Trả phòng: <strong>Thứ 4, 14 tháng 5</strong> đến 12:00</p>
                            <p className="mb-1">Số đêm: <strong>4 đêm - 2 giường đôi</strong></p>
                            <p className="mb-1">Loại phòng: <strong>Deluxe</strong></p>
                            <p className="mb-1">Số khách: <strong>5 khách</strong></p>
                        </div>
                    </div>
                    <div className="card p-4 mt-4 bg-black border text-white mb-4">
                        <h6 className="fw-bold mb-4" style={{ color: "#FAB320" }}>Phương thức thanh toán</h6>

                        <div className="d-flex flex-column gap-3">
                            <label className="payment-option border p-3 rounded d-flex align-items-center gap-3">
                                <input type="radio" name="paymentMethod" value="momo" className="form-check-input mt-0" />
                                <img src="/img/momo.png" alt="Momo" style={{ width: "32px", height: "32px" }} />
                                <span className="fw-semibold">Thanh toán qua Momo</span>
                            </label>

                            <label className="payment-option border p-3 rounded d-flex align-items-center gap-3">
                                <input type="radio" name="paymentMethod" value="vnpay" className="form-check-input mt-0" />
                                <img src="/img/vnpay.jpg" alt="VNPAY" style={{ width: "32px", height: "32px" }} />
                                <span className="fw-semibold">Thanh toán qua VNPAY</span>
                            </label>

                            <label className="payment-option border p-3 rounded d-flex align-items-center gap-3">
                                <input type="radio" name="paymentMethod" value="cash" className="form-check-input mt-0" />
                                <i className="bi bi-cash-coin fs-4 text-success"></i>
                                <span className="fw-semibold">Thanh toán tiền mặt tại nơi ở</span>
                            </label>
                        </div>
                    </div>

                    <div className="card p-4 bg-black border text-white">
                        <h6 className="fw-bold">Tóm tắt giá</h6>
                        <div className="row mb-2">
                            <div className="col">Tạm tính</div>
                            <div className="col text-end">VND 1.600.000</div>
                        </div>
                        <div className="row mb-2">
                            <div className="col">Phí dịch vụ</div>
                            <div className="col text-end text-success">Miễn phí</div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col fw-bold">Tổng cộng</div>
                            <div className="col text-end fw-bold fs-5" style={{color: "#FAB320"}}>VND 1.600.000</div>
                        </div>
                        <button className="btn mt-4 w-100 text-black" style={{backgroundColor: "#FAB320", height: "50px"}}>Hoàn tất đặt phòng</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
