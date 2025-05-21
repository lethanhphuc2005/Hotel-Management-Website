import React from "react";
import styles from "./roomDetail.module.css";

const roomDetail = () => {
  return (
    <div className={styles.pageContainer}>
      {/* Header */}

      {/* Main Content */}
      <div className={styles.container}>
        <h1 className={styles.title}>STANDARD ROOM - VIEW BIỂN</h1>
        <div className={styles.imageContainer}>
          <img
            src="img/lau1.jpg"
            alt="Main Room View"
            className={styles.mainImage}
          />
          <div className={styles.smallImageGrid}>
            <img
              src="img/lau1.jpg"
              alt="Room View"
              className={styles.smallImage}
            />
            <img
              src="img/lau1.jpg"
              alt="Room View"
              className={styles.smallImage}
            />
            <img
              src="img/lau1.jpg"
              alt="Room View"
              className={styles.smallImage}
            />
            <img
              src="img/lau1.jpg"
              alt="Room View"
              className={styles.smallImage}
            />
          </div>
        </div>

        <div className={styles.details}>
          <div className={styles.leftSection}>
            <p className={styles.roomNumber}>Phòng số 01</p>
            <p className={styles.roomInfo}>
              2 phòng ngủ - 2 giường - 1 phòng tắm | Vị trí: Tầng 1 | Diện tích:
              25m² | Trạng thái: Còn phòng{" "}
              <span className={styles.availableIcon}>
                <i className="bi bi-check-circle"></i>
              </span>
            </p>
            <div className={styles.rating}>
              <span className={styles.ratingIcons}>
                🌿 Được khách yêu thích 🌿
              </span>
              <span className={styles.ratingText}>
                Khách đánh giá đây là một trong những căn phòng được yêu
                thích nhất trên The Moon
              </span>
              <div className={styles.ratingScoreWrapper}>
                <span className={styles.ratingScore}>4,9/5</span>
                <span className={styles.stars}>★★★★★</span>
              </div>
              <div className={styles.ratingCountWrapper}>
              <span className={styles.ratingCount}>111</span>
              <span className={styles.feadback}>Đánh giá</span>
              </div>
            </div>
            <br />
            <p className={styles.sectionTitle}>GIỚI THIỆU VỀ CHỖ NGÀY</p>
            <p className={styles.sectionText}>
              Một tổ nhỏ để nghỉ ngơi sau những ngày bận rộn làm việc, mua sắm
              hoặc ghé thăm các bảo tàng và phòng trưng bày ở Milan. Phòng ấm
              cúng và đầy màu sắc với khả năng sử dụng nhà bếp, máy giặt và máy
              sấy, wifi. Cách Brera, Khu phố Tàu và tàu điện ngầm xanh và hoa cà
              hai phút đi bộ.
            </p>
          </div>

        <div className={styles.rightSection}>
  <div className={styles.price}></div>
  <div className={styles.infoSection}>
    <p className={styles.priceText}>400.000 VNĐ / Đêm</p>
    <div className={styles.bookingDetails}>
      <div className={styles.checkInOutRow}>
        <div className={styles.bookingItem}>
          <label>NHẬN PHÒNG</label>
          <input type="date" className={styles.dateInput} />
        </div>
        <div className={styles.bookingItem}>
          <label>TRẢ PHÒNG</label>
          <input type="date" className={styles.dateInput} />
        </div>
      </div>
      <div className={styles.guestRow}>
        <div className={styles.bookingItem}>
          <label className={styles.note}>KHÁCH</label>
          <select className={styles.guestSelect}>
            <option value="1">1 khách</option>
            <option value="2">2 khách</option>
            <option value="3">3 khách</option>
            <option value="4">4 khách</option>
            
          </select>
        </div>
      </div>
    </div>
    <button className={styles.bookButton}>ĐẶT</button>
  </div>
</div>
        </div>
        <hr className={styles.line} />

        <div className={styles.additionalInfo}>
          <div className={styles.highlightsSection}>
            <h3 className={styles.sectionTitle}>NƠI NÀY CÓ NHỮNG GÌ CHO BẠN</h3>
            <div className={styles.iconList}>
              <div className={styles.column}>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-lock-fill"></i>
                  </span>{" "}
                  Khóa ở cửa phòng ngủ
                </div>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-basket-fill"></i>
                  </span>{" "}
                  Bếp
                </div>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-archive-fill"></i>
                  </span>
                  Tủ lạnh
                </div>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-fan"></i>
                  </span>{" "}
                  Máy điều hòa
                </div>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-wrench-adjustable-circle"></i>
                  </span>{" "}
                  Máy sấy tóc
                </div>
              </div>
              <div className={styles.column}>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-image"></i>
                  </span>{" "}
                  Hướng nhìn ra biển
                </div>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-wifi"></i>
                  </span>{" "}
                  Wifi
                </div>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-box2-heart-fill"></i>
                  </span>{" "}
                  Máy giặt
                </div>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-fire"></i>
                  </span>{" "}
                  Bình chữa cháy
                </div>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-mailbox"></i>
                  </span>{" "}
                  Lò vi sóng
                </div>
              </div>
              <div className={styles.column}>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-align-top"></i>
                  </span>{" "}
                  Màn chắng sáng cho phòng
                </div>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-droplet-fill"></i>
                  </span>{" "}
                  Nước nóng
                </div>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-inbox"></i>
                  </span>{" "}
                  Bồn tắm
                </div>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-hourglass-split"></i>
                  </span>{" "}
                  Ấm đun nước
                </div>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-diagram-3-fill"></i>
                  </span>{" "}
                  Móc và phơi đồ
                </div>
              </div>
            </div>
          </div>
          <hr className={styles.line} />
          <div className={styles.reviewsSection}>
            <h3 className={styles.sectionTitle}>NHỮNG ĐÁNH GIÁ CỦA KHÁCH HÀNG</h3>
            <div className={styles.reviewContainer}>
              <div className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <img
                    src="/img/about.jpg"
                    alt="avatar"
                    className={styles.reviewAvatar}
                  />
                  <div>
                    {" "}
                    <p className={styles.reviewAuthor}>Nguyễn Huy Hoàng</p>
                    <p className={styles.reviewRating}>★★★★★ 1 tuần trước</p>
                  </div>
                </div>

                <p className={styles.reviewText}>
                  Sạch sẽ, sạch, rất sạch, view biển tuyệt vời, nhân viên nhiệt
                  tình...
                </p>
              </div>
              <div className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <img
                    src="/img/about.jpg"
                    alt="avatar"
                    className={styles.reviewAvatar}
                  />
                  <div>
                    {" "}
                    <p className={styles.reviewAuthor}>Nguyễn Huy Hoàng</p>
                    <p className={styles.reviewRating}>★★★★★ 1 tuần trước</p>
                  </div>
                </div>
                <p className={styles.reviewText}>
                  Sạch sẽ, sạch, rất sạch, view biển tuyệt vời, nhân viên nhiệt
                  tình...
                </p>
              </div>

              <div className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <img
                    src="/img/about.jpg"
                    alt="avatar"
                    className={styles.reviewAvatar}
                  />
                  <div>
                    {" "}
                    <p className={styles.reviewAuthor}>Nguyễn Huy Hoàng</p>
                    <p className={styles.reviewRating}>★★★★★ 1 tuần trước</p>
                  </div>
                </div>

                <p className={styles.reviewText}>
                  Sạch sẽ, sạch, rất sạch, view biển tuyệt vời, nhân viên nhiệt
                  tình...
                </p>
              </div>
              <div className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <img
                    src="/img/about.jpg"
                    alt="avatar"
                    className={styles.reviewAvatar}
                  />
                  <div>
                    {" "}
                    <p className={styles.reviewAuthor}>Nguyễn Huy Hoàng</p>
                    <p className={styles.reviewRating}>★★★★★ 1 tuần trước</p>
                  </div>
                </div>

                <p className={styles.reviewText}>
                  Sạch sẽ, sạch, rất sạch, view biển tuyệt vời, nhân viên nhiệt
                  tình...
                </p>
              </div>
            </div>
          </div>
          <hr className={styles.line1} />
          <div className={styles.knowSection}>
            <h3 className={styles.sectionTitle}>NHỮNG ĐIỀU CẦN BIẾT</h3>
            <div className={styles.knowList}>
              <div className={styles.knowColumn}>
                <h4 className={styles.columnTitle}>Nội quy phòng</h4>
                <div className={styles.knowItem}>Nhận phòng: 14:00 - 22:00</div>
                <div className={styles.knowItem}>Trả phòng: 12:00</div>
                <div className={styles.knowItem}>Tối đa 4 khách</div>
                <div className={styles.knowItem}>Không hút thuốc</div>
                <div className={styles.knowItem}>Không được mang thú cưng</div>
              </div>
              <div className={styles.knowColumn}>
                <h4 className={styles.columnTitle}>An toàn và chỗ ở</h4>
                <div className={styles.knowItem}>Có máy báo khói</div>
                <div className={styles.knowItem}>Máy phát hiện khí CO</div>
                <div className={styles.knowItem}>
                  Có sơ đồ thoát hiểm sau cửa phòng
                </div>
                <div className={styles.knowItem}>
                  Cửa sổ và ban công được lắp an toàn
                </div>
                <div className={styles.knowItem}>
                  Hành lý được đặt camera an ninh 24/7
                </div>
              </div>
              <div className={styles.knowColumn}>
                <h4 className={styles.columnTitle}>Chính sách hủy</h4>
                <div className={styles.knowItem}>
                  Miễn phí hủy trong vòng 48 giờ sau khi đặt
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default roomDetail;
