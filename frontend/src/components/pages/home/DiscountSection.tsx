import { Discount } from "@/types/discount";
import { motion } from "framer-motion";
import { Col } from "react-bootstrap";
import style from "@/app/page.module.css";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import AnimatedButton from "@/components/common/Button";

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
          <AnimatedButton className="tw-px-8 tw-py-2">
            Xem thêm
          </AnimatedButton>
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
        <a href="#" className={style.seeAll}>
          Xem tất cả <i className="bi bi-arrow-right"></i>
        </a>
      </div>
      {dcl.map((dc: Discount) => (
        <DiscountItem dci={dc} key={dc.id} />
      ))}
    </motion.div>
  );
}
