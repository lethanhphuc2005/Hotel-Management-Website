"use client";
import { Col } from "react-bootstrap";
import Image from "next/image";
import style from "@/app/page.module.css";
import roomtypeStyle from "@/app/roomtype/[parentSlug]/rcChild.module.css";
import { Service } from "@/types/service";
import { useState, useRef } from "react";
import { MainRoomClass } from "@/types/mainroomclass";
import { RoomClass } from "@/types/roomclass";
import { Discount } from "@/types/discount";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addRoomToCart } from "@/contexts/cartSlice";
import { useRoomSearch } from "@/hooks/useRoomSearch";
import { toast } from "react-toastify";
import { RootState } from "@/contexts/store";

export function MainRoomClassItem({ mrci }: { mrci: MainRoomClass }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useTransform(y, [0, 1], [15, -15]);
  const rotateY = useTransform(x, [0, 1], [-15, 15]);

  const shadowX = useTransform(x, [0, 1], [20, -20]);
  const shadowY = useTransform(y, [0, 1], [-20, 20]);

  const boxShadow = useTransform([shadowX, shadowY], ([sx, sy]) =>
    isHovered
      ? `${sx}px ${sy}px 30px rgba(255, 255, 255, 0.4)`
      : "0px 8px 20px rgba(0, 0, 0, 0.05)"
  );

  const setRefs = (node: HTMLDivElement | null) => {
    ref.current = node;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    animate(x, 0.5, { type: "spring", stiffness: 300, damping: 20 });
    animate(y, 0.5, { type: "spring", stiffness: 300, damping: 20 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    x.set(px);
    y.set(py);
  };

  return (
    <Col lg={4} md={6} style={{ perspective: 1000 }}>
      <motion.div
        ref={setRefs}
        className={style.roomCard}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.03 }}
        style={{
          rotateX,
          rotateY,
          boxShadow,
          transformStyle: "preserve-3d",
        }}
      >
        <div className={style.roomImageWrapper}>
          {mrci.images?.map((img, index) => (
            <motion.img
              key={index}
              src={`http://localhost:8000/images/${img.url}`}
              alt={mrci.name}
              className={style.roomImage}
              initial={{ scale: 1.05, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: index * 0.1 }}
            />
          ))}
        </div>

        <div className={style.roomOverlay}></div>

        <div className={style.roomContent}>
          <p className={style.roomLabel}>Phòng {mrci.name}</p>
          <div className={style.priceContainer}>
            <span className={style.priceLabel}>{mrci.description}</span>
          </div>
          <Link href={`/roomtype/${mrci._id}`}>
            <motion.div
              className={style.seeMore}
              whileHover={{
                backgroundColor: "#fab320",
                color: "#2a2f4a",
                scale: 1.1,
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0 }}
            >
              Xem thêm
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </Col>
  );
}

export function DiscountItem({ dci }: { dci: Discount }) {
  return (
    <Col lg={4} md={6} className="mb-4">
      <motion.div
        whileHover={{ scale: 1.03 }}
        className={`card h-100 shadow-sm border-0 ${style.offerCard}`}
        style={{ cursor: "pointer", overflow: "hidden" }}
      >
        <div className="position-relative">
          <motion.img
            src={`http://localhost:8000/images/${dci.image}`}
            alt={dci.name}
            className="card-img-top"
            style={{ height: "220px", objectFit: "cover" }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <span className="badge bg-danger position-absolute top-0 start-0 m-2">
            Giảm {dci.value}%
          </span>
        </div>
        <div
          className="card-body text-white"
          style={{ backgroundColor: "rgb(31, 31, 31)" }}
        >
          <h5 className="card-title">{dci.name}</h5>
          <p className="card-text">{dci.description}</p>
          <ul className="list-unstyled small">
            <li>
              <strong>Từ:</strong>{" "}
              {new Date(dci.start_day).toLocaleDateString()}
            </li>
            <li>
              <strong>Đến:</strong> {new Date(dci.end_day).toLocaleDateString()}
            </li>
            <li>
              <strong>Giới hạn:</strong> {dci.limit}
            </li>
          </ul>
          <motion.a
            className={`btn-sm mt-2 ${style.seeMore}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0 }}
          >
            Xem chi tiết →
          </motion.a>
        </div>
      </motion.div>
    </Col>
  );
}

export function ServiceItem({ svi }: { svi: Service }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={style.serviceCard}>
      <div style={{ position: "relative", width: "100%", height: 180 }}>
        <Image
          src={`http://localhost:8000/images/${svi.image}`}
          alt={svi.name}
          layout="fill"
          objectFit="cover"
          className={style.serviceImage}
        />
      </div>
      <div className="p-3">
        <h5 className="text-truncate" style={{ fontWeight: 600 }}>
          {svi.name}
        </h5>

        <div className="mb-4 mt-3 d-flex align-items-center gap-1">
          <span role="img" aria-label="clock">
            <i className="bi bi-bookmark-check-fill"></i>
          </span>
          <span
            className="text-truncate"
            style={{ marginLeft: 8, color: "white" }}
          >
            {svi.description}
          </span>
        </div>
        <a>
          <motion.button
            className={`w-100`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Xem chi tiết
          </motion.button>
        </a>
      </div>
    </div>
  );
}

export function RoomClassItem({
  rci,
  numberOfNights,
  totalGuests,
  hasSearched,
  numberOfAdults,
  numberOfChildren,
  startDate,
  endDate,
  numChildrenUnder6,
  numAdults,
  showExtraBedOver6,
}: {
  rci: RoomClass;
  numberOfNights: number;
  totalGuests: number;
  hasSearched?: boolean;
  numberOfAdults?: number;
  numberOfChildren?: number;
  startDate?: Date;
  endDate?: Date;
  numChildrenUnder6?: number;
  numAdults?: number;
  showExtraBedOver6?: boolean;
  features?: string[];
}) {
  const [liked, setLiked] = useState(false);
  const dispatch = useDispatch();
  const {
    guests,
    startDate: selectedStartDate,
    endDate: selectedEndDate,
  } = useRoomSearch();
  const adults = numberOfAdults;
  const childrenUnder6 = guests.children.age0to6;
  const childrenOver6 = guests.children.age7to17;
  const cartRooms = useSelector((state: RootState) => state.cart.rooms);

  const basePrice = rci.price_discount > 0 ? rci.price_discount : rci.price;

  const isSaturdayNight = hasSaturdayNight(startDate, endDate);
  const finalTotal = basePrice * numberOfNights * (isSaturdayNight ? 1.5 : 1);
  const handleAddToCart = () => {
    // Kiểm tra ngày đã chọn chưa
    if (!hasSearched || !selectedStartDate || !selectedEndDate) {
      toast.error(
        "Vui lòng chọn ngày nhận và trả phòng trước khi thêm vào giỏ hàng!"
      );
      return;
    }
    const checkInISO = startDate?.toLocaleDateString("vi-VN") || "";
    const checkOutISO = endDate?.toLocaleDateString("vi-VN") || "";
    // 🔍 Kiểm tra trùng phòng đã có trong giỏ hàng
    const isDuplicate = cartRooms.some(
      (room) =>
        room.name.includes(rci.name) &&
        room.view === rci.view &&
        room.checkIn === checkInISO &&
        room.checkOut === checkOutISO
    );

    if (isDuplicate) {
      toast.error("Phòng này bạn đã thêm vào giỏ hàng rồi!");
      return;
    }
    dispatch(
      addRoomToCart({
        id: rci._id + "-" + Date.now(),
        name: rci.name,
        img: rci.images[0]?.url || "",
        desc: `${adults ?? 1} người lớn${
          numberOfChildren ? `, ${numberOfChildren} trẻ em` : ""
        }, ${rci.bed_amount} giường đôi`,
        price: rci.price_discount > 0 ? rci.price_discount : rci.price,
        nights: numberOfNights,
        checkIn: startDate?.toLocaleDateString("vi-VN") || "",
        checkOut: endDate?.toLocaleDateString("vi-VN") || "",
        adults: adults ?? 1,
        childrenUnder6: childrenUnder6,
        childrenOver6: childrenOver6,
        bedAmount: rci.bed_amount,
        view: rci.view,
        total: finalTotal,
        hasSaturdayNight: isSaturdayNight,
        features: rci.features.map((f) => f.feature_id.name),
      })
    );
    toast.success("Đã thêm phòng vào giỏ hàng!");
  };

  // Hàm kiểm tra có đêm Thứ 7 không
  function hasSaturdayNight(start?: Date, end?: Date) {
    if (!start || !end) return false;
    const current = new Date(start);
    while (current < end) {
      if (current.getDay() === 6) return true;
      current.setDate(current.getDate() + 1);
    }
    return false;
  }

  let totalPrice = rci.price;
  if (numberOfNights > 0) {
    if (hasSaturdayNight(startDate, endDate)) {
      totalPrice = rci.price * numberOfNights * 1.5;
    } else {
      totalPrice = rci.price * numberOfNights;
    }
  }

  const handleLikeClick = () => {
    setLiked((prev) => !prev);
  };

  // Xử lý logic kê thêm giường xếp
  const showExtraBed =
    (numChildrenUnder6 ?? 0) > 0 &&
    rci.bed_amount === 1 &&
    (numAdults ?? 0) === 2;

  return (
    <>
      <div
        className="col border rounded-4 d-flex p-3 gap-3 position-relative"
        style={{ height: "280px" }}
      >
        <button
          type="button"
          className={roomtypeStyle.cartButton}
          onClick={handleAddToCart}
        >
          <i className={`bi bi-bag-plus-fill ${roomtypeStyle.cartIcon}`}></i>
        </button>
        <div className="position-relative">
          <a href={`/roomdetail/${rci._id}`}>
            <img
              src={`/img/${rci.images[0].url}`}
              alt=""
              className="rounded-4 h-100"
              style={{ width: "250px" }}
            />
          </a>
          <button
            type="button"
            className="btn btn-light position-absolute top-0 end-0 m-1 rounded-circle shadow"
            onClick={handleLikeClick}
          >
            <i
              className={`bi bi-heart-fill ${
                liked ? "text-danger" : "text-dark"
              }`}
            ></i>
          </button>
        </div>
        <div>
          <div className="d-flex gap-3">
            <p className="fs-5 fw-bold mb-2">{rci.name}</p>
            <span
              className="d-flex gap-1 mt-2"
              style={{ color: "#FAB320", fontSize: "12px" }}
            >
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
            </span>
          </div>
          {/* <p className='mb-1'>Trạng thái: {item.TrangThai}</p> */}
          <p className="mb-1">
            Hướng: {rci.view.charAt(0).toUpperCase() + rci.view.slice(1)}
          </p>
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
          <p className="mb-1" style={{ color: "#FAB320" }}>
            <i className="bi bi-check2" style={{ color: "#FAB320" }}></i> Miễn
            phí hủy
          </p>
          <p className="mb-1" style={{ color: "#FAB320" }}>
            <i className="bi bi-check2" style={{ color: "#FAB320" }}></i> Không
            cần thanh toán trước - thanh toán tại lễ tân
          </p>
          {showExtraBed && (
            <p className="mb-1" style={{ color: "#FAB320" }}>
              <i className="bi bi-check2" style={{ color: "#FAB320" }}></i> Miễn
              phí cho trẻ em dưới 7 tuổi khi nằm chung với bố mẹ.
            </p>
          )}
          {showExtraBedOver6 && (
            <p className="mb-1" style={{ color: "#FAB320" }}>
              <i className="bi bi-check2" style={{ color: "#FAB320" }}></i> Thêm
              giường xếp và phụ thu 100.000đ/đêm
            </p>
          )}
        </div>
        <div className="ms-auto align-self-end mb-2 text-end">
          {hasSearched && (
            <p style={{ fontSize: "14px" }}>
              {`${numberOfNights} đêm, ${numberOfAdults} người lớn` +
                (numberOfChildren && numberOfChildren > 0
                  ? `, ${numberOfChildren} trẻ em`
                  : "")}
            </p>
          )}
          <h5 style={{ color: "white", fontWeight: "bold" }}>
            VND {totalPrice.toLocaleString("vi-VN")}
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
      </div>
    </>
  );
}
