"use client";
import styles from "./roomDetail.module.css";
import React, { useState, useEffect } from "react";

const RoomDetail = () => {
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [showAskModal, setShowAskModal] = useState(false);
  const [question, setQuestion] = useState("");
  const [openFAQIndex, setOpenFAQIndex] = useState<{ col: number; idx: number } | null>(null);

  const faqColumns = [
    [
      {
        question: "Họ có phục vụ bữa sáng không?",
        answer: "Chỗ nghỉ có phục vụ bữa sáng với thực đơn đa dạng.",
      },
      {
        question: "Chỗ nghỉ có dịch vụ đưa đón sân bay không?",
        answer: "Có, bạn có thể đặt dịch vụ đưa đón sân bay với phụ phí.",
      },
      {
        question: "Chỗ nghỉ có spa không?",
        answer: "Chỗ nghỉ có dịch vụ spa cho khách.",
      },
      {
        question: "Chỗ nghỉ có nhà hàng không?",
        answer: "Có nhà hàng phục vụ các món ăn địa phương và quốc tế.",
      },
      {
        question: "Chỗ nghỉ có chính sách Wi-Fi ra sao?",
        answer: "Wi-Fi miễn phí toàn bộ khuôn viên.",
      },
    ],
    [
      {
        question: "Hồ bơi có hoạt động không?",
        answer: "Hồ bơi mở cửa từ 6h đến 22h hàng ngày.",
      },
      {
        question: "Tôi có thể đặt phòng gia đình ở đây không?",
        answer: "Có phòng gia đình với nhiều lựa chọn.",
      },
      {
        question: "Phòng gym có hoạt động không?",
        answer: "Phòng gym hoạt động 24/7.",
      },
      {
        question: "Chỗ nghỉ có chỗ đỗ xe không?",
        answer: "Có bãi đỗ xe miễn phí cho khách.",
      },
      {
        question: "Có tiện nghi BBQ không?",
        answer: "Có khu vực BBQ ngoài trời.",
      },
    ],
  ];

  // Khóa cuộn body khi mở modal
  useEffect(() => {
    if (showFAQModal || showAskModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Cleanup khi component unmount
    return () => document.body.classList.remove("overflow-hidden");
  }, [showFAQModal, showAskModal]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setShowFAQModal(false);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}

      {/* Main Content */}
      <div className={styles.container}>
        <h1 className={styles.title}>STANDARD ROOM - VIEW BIỂN</h1>
        <div className={styles.imageContainer}>
          <img
            src="/img/r1.jpg"
            alt="Main Room View"
            className={styles.mainImage}
          />
          <div className={styles.smallImageGrid}>
            <img
              src="/img/r2.jpg"
              alt="Room View"
              className={styles.smallImage}
            />
            <img
              src="/img/r3.jpg"
              alt="Room View"
              className={styles.smallImage}
            />
            <img
              src="/img/r4.jpg"
              alt="Room View"
              className={styles.smallImage}
            />
            <img
              src="/img/r5.jpg"
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
              25m² | Trạng thái: Còn phòng
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
            <p className={styles.sectionTitle}>GIỚI THIỆU VỀ CHỖ NÀY</p>
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
                  </span>
                  Khóa ở cửa phòng ngủ
                </div>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-basket-fill"></i>
                  </span>
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
                  </span>
                  Máy điều hòa
                </div>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-wrench-adjustable-circle"></i>
                  </span>
                  Máy sấy tóc
                </div>
              </div>
              <div className={styles.column}>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-image"></i>
                  </span>
                  Hướng nhìn ra biển
                </div>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-wifi"></i>
                  </span>
                  Wifi
                </div>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-box2-heart-fill"></i>
                  </span>
                  Máy giặt
                </div>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-fire"></i>
                  </span>
                  Bình chữa cháy
                </div>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-mailbox"></i>
                  </span>
                  Lò vi sóng
                </div>
              </div>
              <div className={styles.column}>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-align-top"></i>
                  </span>
                  Màn chắng sáng cho phòng
                </div>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-droplet-fill"></i>
                  </span>
                  Nước nóng
                </div>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-inbox"></i>
                  </span>
                  Bồn tắm
                </div>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-hourglass-split"></i>
                  </span>
                  Ấm đun nước
                </div>
                <div className={styles.iconItem}>
                  <span className={styles.icon}>
                    <i className="bi bi-diagram-3-fill"></i>
                  </span>
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
          {/* Thắc mắc của du khách - Bootstrap */}
          <section className="my-4">
            <h3 className="fw-bold mb-4" style={{ fontSize: "20px" }}>
              THẮC MẮC CỦA DU KHÁCH
            </h3>
            <div className="row h-100">
              <div className="col-md-4">
                <div
                  className="border rounded-3 p-4 d-flex flex-column align-items-center justify-content-center shadow-sm bg-black"
                  style={{ height: "316px" }}
                >
                  <div className="fw-bold fs-5 text-center mb-3">
                    Bạn vẫn đang tìm kiếm?
                  </div>
                  <button
                    className={`mb-3 ${styles.btnAsk}`}
                    onClick={() => setShowAskModal(true)}
                  >
                    Đặt câu hỏi
                  </button>
                  <div
                    className="text-white text-center"
                    style={{ fontSize: "15px" }}
                  >
                    Chúng tôi có thể giải đáp tức thì hầu hết các thắc mắc
                  </div>
                  <button
                    type="button"
                    className="btn btn-link mt-2 text-decoration-none"
                    style={{ color: "#FAB320" }}
                    onClick={() => setShowFAQModal(true)}
                  >
                    Xem các câu hỏi khác (20)
                  </button>
                </div>
              </div>
              {/* Thêm 2 box FAQ như hình */}
              <div className="col-md-8">
                <div className="row">
                  {faqColumns.map((col, colIdx) => (
                    <div className="col-md-6 mb-3" key={colIdx}>
                      <div className="border rounded-3 p-3 bg-black">
                        <ul className="list-unstyled mb-0">
                          {col.map((item, idx) => (
                            <li
                              key={idx}
                              className={`d-flex align-items-center py-3${
                                idx < col.length - 1 ? " border-bottom" : ""
                              }`}
                              style={{ flexDirection: "column", cursor: "pointer" }}
                              onClick={() =>
                                setOpenFAQIndex(
                                  openFAQIndex &&
                                    openFAQIndex.col === colIdx &&
                                    openFAQIndex.idx === idx
                                    ? null
                                    : { col: colIdx, idx }
                                )
                              }
                            >
                              <div className="w-100 d-flex align-items-center">
                                <i className="bi bi-chat-dots me-2"></i>
                                <span>{item.question}</span>
                                <span className="ms-auto">
                                  <i
                                    className={`bi bi-chevron-${
                                      openFAQIndex &&
                                      openFAQIndex.col === colIdx &&
                                      openFAQIndex.idx === idx
                                        ? "down"
                                        : "right"
                                    }`}
                                  ></i>
                                </span>
                              </div>
                              {openFAQIndex &&
                                openFAQIndex.col === colIdx &&
                                openFAQIndex.idx === idx && (
                                  <div
                                    className={`${styles.faqAnswer} ${openFAQIndex && openFAQIndex.col === colIdx && openFAQIndex.idx === idx ? styles.open : ""} w-100 mt-2 text-secondary`}
                                    style={{
                                      fontSize: 14,
                                      background: "#181818",
                                      borderRadius: 6,
                                      padding: "10px 12px",
                                    }}
                                  >
                                    {item.answer}
                                  </div>
                                )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* FAQ Modal */}
            {showFAQModal && (
              <>
                <div
                  className={styles.faqSidebarBackdrop}
                  onClick={handleBackdropClick}
                ></div>
                <div
                  className={styles.faqSidebarModal}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="modal-header">
                    <h5 className="modal-title fw-bold">
                      Thắc mắc của khách hàng
                    </h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setShowFAQModal(false)}
                    ></button>
                  </div>
                  <div className={`modal-body ${styles.custommodalbody}`}>
                    {/* Danh sách các câu hỏi và trả lời */}
                    <div className="mb-4 mt-4">
                      <div className="fw-semibold mb-1">
                        <i className="bi bi-chat-dots me-2"></i>
                        Căn này có mấy toilet v ạ
                      </div>
                      <div
                        className="text-secondary"
                        style={{ fontSize: 13 }}
                      >
                        ngày 18 tháng 4 năm 2023
                      </div>
                      <div className="rounded p-2 mt-1 mb-1">
                        Dạ loại căn hộ Superior có 2 wc ạ
                      </div>
                      <div className="d-flex gap-3 ps-2">
                        <span style={{ cursor: "pointer", color: "#FAB320" }}>
                          Hữu ích
                        </span>
                        <span style={{ cursor: "pointer", color: "#FAB320" }}>
                          Không hữu ích
                        </span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="fw-semibold mb-1">
                        <i className="bi bi-chat-dots me-2"></i>
                        Mình hỗ trợ check in sớm k ạ
                      </div>
                      <div
                        className="text-secondary"
                        style={{ fontSize: 13 }}
                      >
                        ngày 28 tháng 2 năm 2023
                      </div>
                      <div className="rounded p-2 mt-1 mb-1">
                        Dạ, thời gian nhận phòng của mình là 14h, nếu có sớm thì
                        bên mình sẽ liên hệ bạn nhé
                      </div>
                      <div className="d-flex gap-3 ps-2">
                        <span style={{ cursor: "pointer", color: "#FAB320" }}>
                          Hữu ích
                        </span>
                        <span style={{ cursor: "pointer", color: "#FAB320" }}>
                          Không hữu ích
                        </span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="fw-semibold mb-1">
                        <i className="bi bi-chat-dots me-2"></i>
                        Cho mình hỏi. phòng này còn ko ạ
                      </div>
                      <div
                        className="text-secondary"
                        style={{ fontSize: 13 }}
                      >
                        ngày 8 tháng 2 năm 2023
                      </div>
                      <div className="rounded p-2 mt-1 mb-1">
                        Dạ mình còn nhé ạ
                      </div>
                      <div className="d-flex gap-3 ps-2">
                        <span style={{ cursor: "pointer", color: "#FAB320" }}>
                          Hữu ích
                        </span>
                        <span style={{ cursor: "pointer", color: "#FAB320" }}>
                          Không hữu ích
                        </span>
                      </div>
                    </div>

                    {/* ...Thêm các câu hỏi khác nếu muốn... */}
                  </div>
                  <div
                    className="modal-footer p-3 border-top"
                    style={{ height: "80px" }}
                  >
                    <button
                      className="w-100 border-0 text-black rounded"
                      style={{ backgroundColor: "#FAB320", height: "45px" }}
                      onClick={() => setShowAskModal(true)}
                    >
                      Đặt câu hỏi
                    </button>
                  </div>
                </div>
              </>
            )}
            {/* Đặt câu hỏi Modal */}
            {showAskModal && (
              <>
                <div
                  className={styles.faqSidebarBackdrop}
                  onClick={(e) => {
                    if (e.target === e.currentTarget) setShowAskModal(false);
                    setShowFAQModal(false);
                  }}
                ></div>
                <div
                  className={styles.faqSidebarModal}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="modal-header border-0 pb-0">
                    <h5 className="modal-title fw-bold mb-4">Đặt câu hỏi</h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setShowAskModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-2 fw-semibold">
                      Câu hỏi của bạn{" "}
                      <span style={{ color: "red" }}>*</span>
                    </div>
                    <textarea
                      className={`form-control mb-2 text-white ${styles.customTextarea}`}
                      rows={3}
                      maxLength={300}
                      placeholder="ví dụ: có dịch vụ dọn phòng không?"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    />
                    <div
                      className="mb-2 text-end"
                      style={{ fontSize: 13, color: "#888" }}
                    >
                      {300 - question.length} ký tự
                    </div>
                    <div className="mb-3" style={{ fontSize: 15 }}>
                      <i className="bi bi-info-circle me-2"></i>
                      Nếu chúng tôi không thể trả lời câu hỏi của bạn ngay, bạn
                      có thể chuyển câu hỏi đến chỗ nghỉ. Vui lòng{" "}
                      <a href="#" style={{ color: "#FAB320" }}>
                        tuân thủ hướng dẫn của chúng tôi
                      </a>{" "}
                      và không đề cập đến bất kỳ thông tin cá nhân nào.
                    </div>
                  </div>
                  <div
                    className="modal-footer p-3 border-top"
                    style={{ height: "80px" }}
                  >
                    <button
                      className="w-100 border-0 text-black rounded"
                      style={{ backgroundColor: "#FAB320", height: "45px" }}
                      disabled={!question.trim()}
                      onClick={() => {
                        // Xử lý gửi câu hỏi ở đây
                        setShowAskModal(false);
                        setQuestion("");
                      }}
                    >
                      Đặt câu hỏi
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
          <br />
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

export default RoomDetail;
