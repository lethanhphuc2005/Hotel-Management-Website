import { Discount } from "@/types/discount";
import { motion } from "framer-motion";
import { Col } from "react-bootstrap";
import style from "@/styles/base/page.module.css";
import { useScrollAnimation } from "@/hooks/logic/useScrollAnimation";
import { formatDate } from "@/utils/dateUtils";
import { formatCurrencyVN } from "@/utils/currencyUtils";
import { capitalizeFirst } from "@/utils/stringUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCalendarDays,
  faPercent,
  faTag,
  faUsers,
  faGift,
  faHotel,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";

const typeIconMap: Record<string, any> = {
  early_bird: faCalendarDays,
  last_minute: faClock,
  length_of_stay: faHotel,
  promo_code: faTag,
  seasonal: faGift,
  multi_room: faUsers,
  user_level: faPercent,
};

function renderConditions(dci: Discount) {
  const c = dci.conditions || {};
  const items: string[] = [];

  switch (dci.type) {
    case "early_bird":
      if (c.min_advance_days)
        items.push(`Đặt trước ít nhất ${c.min_advance_days} ngày`);
      break;
    case "last_minute":
      if (c.max_advance_days)
        items.push(`Đặt trong vòng ${c.max_advance_days} ngày`);
      break;
    case "length_of_stay":
      if (c.min_stay_nights) items.push(`Tối thiểu ${c.min_stay_nights} đêm`);
      if (c.max_stay_nights) items.push(`Tối đa ${c.max_stay_nights} đêm`);
      break;
    case "multi_room":
      if (c.min_rooms) items.push(`Từ ${c.min_rooms} phòng trở lên`);
      break;
    case "user_level":
      if (Array.isArray(c.user_levels) && c.user_levels.length > 0) {
        items.push(
          `Áp dụng cho thành viên hạng: ${c.user_levels
            .map((level: String) => {
              switch (level) {
                case "bronze":
                  return "Đồng";
                case "silver":
                  return "Bạc";
                case "gold":
                  return "Vàng";
                case "diamond":
                  return "Kim Cương";
                default:
                  return capitalizeFirst(level.toString());
              }
            })
            .join(", ")}`
        );
      }
      break;
    default:
      break;
  }

  return items.length > 0 ? (
    <div className="mt-3">
      <h6 className="text-uppercase fw-bold">Điều kiện áp dụng</h6>
      <ul className="list-unstyled small">
        {items.map((i, idx) => (
          <li key={idx}>• {i}</li>
        ))}
      </ul>
    </div>
  ) : null;
}

export function DiscountItem({ dci }: { dci: Discount }) {
  return (
    <Col lg={4} md={6} className="mb-4">
      <motion.div
        whileHover={{ scale: 1.03 }}
        className={`card d-flex flex-column h-100 shadow-sm border-0 ${style.offerCard}`}
        style={{ cursor: "pointer", overflow: "hidden" }}
      >
        <div className="position-relative">
          {dci.image && (
            <Image
              width={400}
              height={220}
              loading="lazy"
              src={dci.image.url}
              alt={dci.name}
              className="card-img-top"
              style={{ height: "220px", objectFit: "cover" }}
            />
          )}
          <span className="badge bg-danger position-absolute top-0 start-0 m-2">
            Giảm{" "}
            {dci.value_type === "percent"
              ? `${dci.value * 100}%`
              : `${formatCurrencyVN(dci.value)}`}
          </span>
        </div>
        <div
          className="card-body text-white d-flex flex-column"
          style={{ backgroundColor: "rgb(31, 31, 31)", flexGrow: 1 }}
        >
          <div className="mb-2 d-flex align-items-center gap-2 text-warning">
            <FontAwesomeIcon icon={typeIconMap[dci.type] || faTag} />
            <small className="text-uppercase fw-bold">
              {dci.type.replace(/_/g, " ")}
            </small>
          </div>
          <div className="flex-grow-1">
            <h5 className="card-title">{dci.name}</h5>
            <p className="card-text">{dci.description}</p>
            <ul className="list-unstyled small">
              <li>
                <strong>Từ:</strong> {formatDate(dci.valid_from)}
              </li>
              <li>
                <strong>Đến:</strong> {formatDate(dci.valid_to)}
              </li>
            </ul>
            {renderConditions(dci)}
          </div>
        </div>
      </motion.div>
    </Col>
  );
}

export default function DiscountList({
  dcl,
  title,
}: {
  dcl: Discount[];
  title?: string;
}) {
  const [ref, controls] = useScrollAnimation(0.2, false);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={controls}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="mt-5 mb-5 d-flex row"
    >
      <div className={style.headerContainer}>
        <h2 className={style.sectionTitle}>{title}</h2>
        <Link href="/discount" className={style.seeAll}>
          Xem tất cả <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
      {dcl.map((dc: Discount) => (
        <DiscountItem dci={dc} key={dc.id} />
      ))}
    </motion.div>
  );
}
