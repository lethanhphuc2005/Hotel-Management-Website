"use client";

import React, { useState } from "react";
import styles from './danhgia.module.css';

const ReviewPage = () => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleStarClick = (star: number) => {
    setRating(star);
  };

  return (
    <div className={`container-md py-4 ${styles.wrapper}`}>
      <div className="text-center mb-4">
        <h3 className="fw-bold">Đánh Giá Sau Khi Sử Dụng Phòng</h3>
        <h5 style={{ color: "#FAB320" }}>The Song Apartment 5 Stars Vũng Tàu</h5>

      </div>

      {/* Room Images */}
      <div className="row mb-4">
        <div className="col-4">
          <img
            src="https://tse1.mm.bing.net/th/id/OIP.S5gYv_XqFDmSVjtb47B4igHaDt?w=1280&h=640&rs=1&pid=ImgDetMain/300x200?text=Phòng+Khách"
            alt="Hình ảnh phòng 1"
            className="img-fluid rounded"
            style={{ height: "200px", width: "100%", objectFit: "cover" }}
          />
        </div>
        <div className="col-4">
          <img
            src="https://tse3.mm.bing.net/th/id/OIF.i6UsiO9ADCJj4ecrhrE8pw?rs=1&pid=ImgDetMain/300x200?text=Phòng+Ngủ"
            alt="Hình ảnh phòng 2"
            className="img-fluid rounded"
            style={{ height: "200px", width: "100%", objectFit: "cover" }}
          />
        </div>
        <div className="col-4">
          <img
            src="https://tse2.mm.bing.net/th/id/OIP.T4EwEJi3PEIgRx-32kYVzAHaE8?rs=1&pid=ImgDetMain/300x200?text=Phòng+Tắm"
            alt="Hình ảnh phòng 3"
            className="img-fluid rounded"
            style={{ height: "200px", width: "100%", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* Room Details */}
      <div className={`${styles.bookingDetails} mb-4`}>
        <h5 className="fw-bold mb-3">Chi tiết đặt phòng của bạn</h5>

        <div className={styles.bookingGrid}>
          <div>
            <strong>Nhận phòng</strong>
            <div>14:00, 29/05/2025</div>
            <div>14:00 – 22:00</div>
          </div>
          <div>
            <strong>Trả phòng</strong>
            <div>12:00, 02/06/2025</div>
            <div>Cho đến 12:00</div>
          </div>
          <div>
            <strong>Tổng thời gian lưu trú:</strong>
            <div>4 đêm</div>
          </div>
        </div>

        <div className={styles.bookingNote}>
          <ul className="mb-0">
            <li><strong>Loại phòng:</strong> Căn hộ 2 phòng ngủ</li>
            <li><strong>Số khách:</strong> 5 khách</li>
          </ul>
        </div>

        <div className={styles.bookingExtras}>
          <p><strong>Trạng thái thanh toán:</strong> Đã thanh toán</p>
          <p><strong>Tiện nghi:</strong> Wi-Fi miễn phí, Chỗ đậu xe, Hồ bơi</p>
        </div>
      </div>

      {/* Review Section */}
      
       {/* Review Section */}
<div className={`card mb-4 ${styles.card}`}>
  <div className="card-body">
  <h5 className="card-title fs-5 text-white">Bình Luận Cá Nhân</h5>
 <textarea
  className={`form-control ${styles.blackInput}`}
  placeholder="Viết đánh giá của bạn..."
></textarea>


    {/* Star Rating */}
    <div>
      <p className="fs-6 text-white"><strong>Mức độ hài lòng:</strong></p>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`me-1 ${rating >= star ? "text-warning" : "text-secondary"}`}
          style={{ cursor: "pointer", fontSize: "1.25rem" }}
          onClick={() => handleStarClick(star)}
        >
          ★
        </span>
      ))}
    </div>
    <p className="fs-6">{rating} / 5 sao</p>

    {/* Gửi đánh giá */}
    <button
      className="btn mt-3 px-4 py-2 rounded-pill" style={{backgroundColor:'#FAB320'}}
      onClick={() => alert(`Bạn đã đánh giá ${rating} sao với bình luận: ${comment}`)}
    >
      Gửi đánh giá
    </button>
  </div>
</div>

          {/* Star Rating */}
         

      {/* Other Comments */}
    {/* Other Comments */}
<div className={`card ${styles.card} ${styles.commentDark}`}>
  <div className="card-body">
    <h5 className="card-title fs-5">Đánh giá Khác</h5>
    <ul className="list-group ">
      <li className={`list-group-item d-flex align-items-center ${styles.spacedItem}`}>
        <img
          src="https://tse4.mm.bing.net/th/id/OIP.tvaMwK3QuFxhTYg4PSNNVAHaHa?rs=1&pid=ImgDetMain/40?text=User+1"
          alt="Avatar 1"
          className="rounded-circle me-3"
          style={{ width: '40px', height: '40px' }}
        />
        <div>
          <p className="mb-1 fs-6">
            <strong>Nguyen Van A:</strong> Phòng đẹp, view biển tuyệt vời, nhưng dịch vụ ăn uống cần cải thiện.
          </p>
          <small className="textmuted">28/05/2025</small>
        </div>
      </li>
      <li className={`list-group-item d-flex align-items-center ${styles.spacedItem}`}>
        <img
          src="https://tse4.mm.bing.net/th/id/OIP.tvaMwK3QuFxhTYg4PSNNVAHaHa?rs=1&pid=ImgDetMain/40?text=User+2"
          alt="Avatar 2"
          className="rounded-circle me-3"
          style={{ width: '40px', height: '40px' }}
        />
        <div>
          <p className="mb-1 fs-6">
            <strong>Tran Thi B:</strong> Nhân viên nhiệt tình, không gian thoải mái, đáng để quay lại.
          </p>
          <small className="textmuted">27/05/2025</small>
        </div>
      </li>
    </ul>
  </div>
</div>

    </div>
  );
};

export default ReviewPage;

