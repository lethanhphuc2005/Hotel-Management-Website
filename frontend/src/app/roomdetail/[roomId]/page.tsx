"use client";
import { useData } from "@/hooks/useData";
import styles from "./roomDetail.module.css";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Thumbs, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/pagination";
import { Mousewheel } from "swiper/modules";
import style from "./roomDetail.module.css"; // Đảm bảo đúng đường dẫn
import axios from "axios";

interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}
interface Comment {
  _id: string;
  room_class_id: string;
  parent_id: string | null;
  user_id: User;
  content: string;
  createdAt: string; // Ngày tạo bình luận
  updatedAt: string; // Ngày cập nhật bình luận
  rating?: number; // thêm dòng này
}

// Định nghĩa interface cho review
interface Review {
  author: string;
  rating: number;
  date: string;
  content: string;
  // Thêm các trường khác nếu có
}

interface FeatureItem {
  _id: string;
  room_class_id: string;
  feature_id: {
    _id: string;
    name: string;
    description: string;
    image: string; // Nếu có icon, đường dẫn ảnh hoặc tên icon
  };
}
const RoomDetail = () => {
  const params = useParams();
  const roomId = params.roomId as string; // roomId chính là id trên URL
  const { roomclass } = useData();
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [showAskModal, setShowAskModal] = useState(false);
  const [question, setQuestion] = useState("");
  const [openFAQIndex, setOpenFAQIndex] = useState<{
    col: number;
    idx: number;
  } | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [roomClasses, setRoomClasses] = useState([]);
  const [reviews, setReviews] = useState<Review[]>([]); // Thêm state cho reviews
  const [features, setFeatures] = useState<FeatureItem[]>([]); // Thêm state cho features
  // const [comments, setComments] = useState<Comment[]>([]);
  // console.log(comments)

  // Lấy room như cũ
  const room = roomclass.find((item) => item._id === roomId);
  const images = room?.images || [];
  const comments = room?.comments || []; // Lấy comments từ room
  console.log("comments:", comments);
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

  useEffect(() => {
    fetch("http://localhost:8000/v1/room-class/user")
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // Xem cấu trúc dữ liệu trả về
        // Xử lý tiếp ở bước 2
      });
  }, []);

  useEffect(() => {
    // Giả sử bạn có API để lấy đánh giá của phòng
    axios
      .get(`http://localhost:8000/v1/reviews?roomId=${roomId}`)
      .then((res: any) => setReviews(res.data.data))
      .catch((err) => console.error(err));
  }, [roomId]);

  useEffect(() => {
    // Lấy danh sách tiện ích của phòng
    axios
      .get(`http://localhost:8000/v1/room-class/${roomId}/features`)
      .then((res: any) => setFeatures(res.data.data))
      .catch((err) => console.error(err));
  }, [roomId]);

 

  const ratedComments: Comment[] = comments
  .filter((cmt) => cmt.rating !== undefined && cmt.rating !== null)
  .map((cmt) => ({
    ...cmt,
    parent_id: cmt.parent_id ?? null, // đảm bảo không undefined
  })) as Comment[];
  const ratingCount: number = ratedComments.length;
  const avgRating: number =
    ratingCount === 0
      ? 0
      : ratedComments.reduce((sum, cmt) => sum + (cmt.rating ?? 0), 0) /
        ratingCount;

  if (!room) return <div>Room not found</div>;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <div className={styles.swiperContainer}>
            <div className={styles.mainWrapper}>
              <Swiper
                loop={true}
                autoplay={{ delay: 5000 }}
                modules={[Autoplay, Thumbs, Pagination]}
                pagination={{ clickable: true }} // Bật cục tròn chuyển slide
                className={styles.mainSwiper}
                thumbs={{ swiper: thumbsSwiper }}
              >
                {images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={`/img/${img.url}`}
                      alt={`Room Image ${index + 1}`}
                      className={styles.mainImage}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className={styles.thumbWrapper}>
              <Swiper
                onSwiper={setThumbsSwiper}
                direction="vertical"
                spaceBetween={10}
                slidesPerView={5}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[Thumbs, Mousewheel]}
                mousewheel={true}
                className={styles.thumbSwiper}
              >
                {images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={`/img/${img.url}`}
                      alt={`Thumb ${index + 1}`}
                      className={styles.thumbImage}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
        <h1 className={styles.title}>{room.name}</h1>
        <div className={styles.details}>
          <div className={styles.leftSection}>
            {/* <p className={styles.roomNumber}>Phòng số 01</p> */}
            <p className={styles.roomInfo}>
              {room
                ? `${room.bed_amount} giường - Sức chứa ${
                    room.capacity
                  } khách | View: ${room.view} | Trạng thái: ${
                    room.status ? "Còn phòng" : "Hết phòng"
                  }`
                : ""}
              <span className={styles.availableIcon}>
                <i className="bi bi-check-circle"></i>
              </span>
              <br />
              {room.description}
            </p>
            <div className={styles.rating}>
              <span className={styles.ratingIcons}>
                🌿 Được khách yêu thích 🌿
              </span>
              <span className={styles.ratingText}>
                Khách đánh giá đây là một trong những căn phòng được yêu thích
                nhất trên The Moon
              </span>
              <div className={styles.ratingScoreWrapper}>
                <span className={styles.ratingScore}>
                  {avgRating === 0 ? 0 : avgRating.toFixed(1)}/5
                </span>
                <span className={styles.stars}>
                  {"★★★★★".slice(0, Math.round(avgRating))}
                  {"☆☆☆☆☆".slice(0, 5 - Math.round(avgRating))}
                </span>
              </div>
              <div className={styles.ratingCountWrapper}>
                <span className={styles.ratingCount}>{ratingCount}</span>
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
              <p className={styles.priceText}>
                {room ? `${room.price.toLocaleString()} VNĐ / Đêm` : ""}
              </p>
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
          <h3 className={styles.sectionTitle}>NƠI NÀY CÓ NHỮNG GÌ CHO BẠN</h3>

          {room.features && room.features.length > 0 ? (
            <div className={styles.highlightsSection}>
              <div className={styles.iconList}>
                {room.features.map((item) => (
                  <div key={item._id} className={styles.iconItem}>
                    <span className={styles.icon}>
                      {item.feature_id?.image ? (
                        <i className={item.feature_id.image}></i>
                      ) : (
                        <i></i> // icon mặc định nếu không có
                      )}
                    </span>
                    {item.feature_id?.name || "Không có tên"}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>Chưa có tiện ích nào.</div>
          )}

          <hr className={styles.line} />
          <div className={styles.reviewsSection}>
            <h3 className={styles.sectionTitle}>
              NHỮNG ĐÁNH GIÁ CỦA KHÁCH HÀNG
            </h3>
            <div className={styles.reviewContainer}>
              {reviews.length > 0 ? ( // Kiểm tra xem có đánh giá nào không
                reviews.map((review, idx) => (
                  <div key={idx} className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <img
                        src="/img/about.jpg"
                        alt="avatar"
                        className={styles.reviewAvatar}
                      />
                      <div>
                        <p className={styles.reviewAuthor}>{review.author}</p>
                        <p className={styles.reviewRating}>
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}{" "}
                          <span className={styles.reviewDate}>
                            {new Date(review.date).toLocaleDateString("vi-VN")}
                          </span>
                        </p>
                      </div>
                    </div>

                    <p className={styles.reviewText}>{review.content}</p>
                  </div>
                ))
              ) : (
                <p className={styles.noReviews}>
                  Chưa có đánh giá nào cho phòng này.
                </p>
              )}
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
                    Xem các câu bình luận
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
                              style={{
                                flexDirection: "column",
                                cursor: "pointer",
                              }}
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
                                    className={`${styles.faqAnswer} ${
                                      openFAQIndex &&
                                      openFAQIndex.col === colIdx &&
                                      openFAQIndex.idx === idx
                                        ? styles.open
                                        : ""
                                    } w-100 mt-2 text-secondary`}
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
                      Bình luận của khách hàng
                    </h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setShowFAQModal(false)}
                    ></button>
                  </div>
                  <div className={`modal-body ${styles.custommodalbody}`}>
                    {comments.length === 0 && <div>Chưa có bình luận nào</div>}
                    {comments.map((cmt) => (
                      <div key={cmt._id} style={{ marginBottom: 16 }}>
                        <b>
                          {cmt.user_id?.first_name} {cmt.user_id?.last_name}
                        </b>
                        <div>Nội dung: {cmt.content}</div>
                        <div>
                          Thời gian:{" "}
                          {new Date(cmt.createdAt).toLocaleString("vi-VN")}
                        </div>
                        <hr />
                      </div>
                    ))}
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
                      Câu hỏi của bạn <span style={{ color: "red" }}>*</span>
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
