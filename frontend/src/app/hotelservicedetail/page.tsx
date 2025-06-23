// src/pages/SpaServiceDetail.jsx
import React from "react";
import styles from "./hotelservicedetail.module.css";

const SpaServiceDetail = () => {
  return (
    <div>
      {/* Hero */}
      <section className={`${styles.hero} text-center`}>
        <h1 className="display-5 text-uppercase container ">
          Dịch vụ bữa sáng <br />
          buffet cao cấp
        </h1>
      </section>

      {/* Content */}
      <div className="container my-5">
        <div className="row mb-4">
          <div className="col-md-7">
            <h2 className={styles.sectionTitle}>Thông tin chi tiết</h2>
            <p>
              Thưởng thức bữa sáng đẳng cấp với thực đơn phong phú từ Âu sang Á,
              nguyên liệu tươi ngon và không gian sang trọng.
            </p>
            <ul className="list-unstyled">
              <li className={styles.serviceFeature}>
                <i className="bi bi-check-circle"></i> Không gian yên tĩnh
              </li>
              <li className={styles.serviceFeature}>
                <i className="bi bi-check-circle"></i> Nhân viên chuyên nghiệp
              </li>
            </ul>
            <div className="mb-5">
              <h3 className={styles.sectionTitle}>Bảng giá và thời gian</h3>
              <table className={`table ${styles.priceTable}`}>
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Giá</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>6:00 - 8:00</td>
                    <td>150.000Đ</td>
                  </tr>
                  <tr>
                    <td>6:00 - 10:00</td>
                    <td>250.000Đ</td>
                  </tr>
                  <tr>
                    <td>6:00 - 10:00</td>
                    <td>400.000Đ</td>
                  </tr>
                </tbody>
              </table>
              <button className={`btn mt-3 ${styles.btnBook}`}>Đặt ngay</button>
            </div>
          </div>
          <div className="col-md-5">
            <div className="row g-2">
              <div className="col-6">
                <img
                  className={`img-fluid rounded ${styles.serviceImg}`}
                  src="/img/phong19.jpg"
                  alt="spa"
                />
              </div>
              <div className="col-6">
                <img
                  className={`img-fluid rounded ${styles.serviceImg}`}
                  src="/img/phong19.jpg"
                  alt="spa"
                />
              </div>
              <div className="col-6">
                <img
                  className={`img-fluid rounded ${styles.serviceImg}`}
                  src="/img/phong19.jpg"
                  alt="room"
                />
              </div>
              <div className="col-6">
                <img
                  className={`img-fluid rounded ${styles.serviceImg}`}
                  src="/img/phong19.jpg"
                  alt="room"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mb-5 row">
          {/* Gợi ý dịch vụ khác */}
          <div className="col-md-7">
            <h3 className={styles.sectionTitle}>Gợi ý dịch vụ khác</h3>
            <div className={`row g-3 ${styles.thumbImage}`}>
              <div className="col-4">
                <img
                  src="/img/banner3.jpg"
                  alt="Buffet sáng"
                  className="img-fluid rounded"
                />
                <div className="mt-2 text-center">Buffet sáng</div>
              </div>
              <div className="col-4">
                <img
                  src="/img/phong18.jpg"
                  alt="Hồ bơi"
                  className="img-fluid rounded"
                />
                <div className="mt-2 text-center">Hồ bơi</div>
              </div>
              <div className="col-4">
                <img
                  src="/img/phong16.jpg"
                  alt="Spa thư giãn"
                  className="img-fluid rounded"
                />
                <div className="mt-2 text-center">Spa thư giãn</div>
              </div>
            </div>
          </div>
          
          {/* Đánh giá khách hàng */}
          <div className="col-md-5 p">
            <h3 className={styles.sectionTitle}>Đánh giá khách hàng</h3>
            <div className="mb-3 d-flex align-items-start ms-3">
              <img
                src="/img/user.jpg"
                alt="user"
                className="rounded-circle me-3"
                width={48}
                height={48}
              />
              <div>
                <strong>Hà Linh</strong>
                <div>
                  <span className="text-warning">★★★★★</span>
                  <span className="text-muted ms-2">3 giờ trước</span>
                </div>
                <div>Tham hạnh tháp, hỗ hành dễ hối gần tắc sâm.</div>
              </div>
            </div>
            <div className="mb-3 d-flex align-items-start ms-3">
              <img
                src="/img/user.jpg"
                alt="user"
                className="rounded-circle me-3"
                width={48}
                height={48}
              />
              <div>
                <strong>Minh Tuấn</strong>
                <div>
                  <span className="text-warning">★★★★★</span>
                  <span className="text-muted ms-2">4 giờ trước</span>
                </div>
                <div>Tham hạnh tháp, hỗ hành dễ hối dày tốc tắc.</div>
              </div>
            </div>
            <div className="mb-3 d-flex align-items-start ms-3">
              <img
                src="/img/user.jpg"
                alt="user"
                className="rounded-circle me-3"
                width={48}
                height={48}
              />
              <div>
                <strong>Thảo An</strong>
                <div>
                  <span className="text-warning">★★★★★</span>
                  <span className="text-muted ms-2">5 giờ trước</span>
                </div>
                <div>Kỹ thuật viên chuyên nghiệp, dịch vụ tuyệt vời.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaServiceDetail;
