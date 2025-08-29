"use client";
import { MainRoomClass } from "@/types/mainRoomClass";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Col } from "react-bootstrap";
import style from "@/styles/base/page.module.css";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/logic/useScrollAnimation";
import { AnimatedButton } from "@/components/common/Button";

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
          <motion.img
            src={mrci.image.url}
            alt={mrci.name}
            className={style.roomImage}
            initial={{ scale: 1.05, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          />
        </div>

        <div className={style.roomOverlay}></div>

        <div className={style.roomContent}>
          <p className={style.roomLabel}>Phòng {mrci.name}</p>
          <div className={style.priceContainer}>
            <span className={style.priceLabel}>{mrci.description}</span>
          </div>
          <Link href={`/room-class?mainRoomClassId=${mrci.id}`}>
            <AnimatedButton className="tw-px-8 tw-py-2">
              Xem thêm
            </AnimatedButton>
          </Link>
        </div>
      </motion.div>
    </Col>
  );
}

export default function MainRoomClassList({
  mrcl,
  title,
}: {
  mrcl: MainRoomClass[];
  title?: string;
}) {
  const [ref, controls] = useScrollAnimation(0.2, false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={controls}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="mt-3 mb-3 d-flex row g-0"
    >
      <div className={style.headerContainer}>
        <h2 className={style.sectionTitle}>{title}</h2>
        <Link href="/room-class" className={style.seeAll}>
          Xem tất cả <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
      {mrcl.map((mrc: MainRoomClass) => (
        <MainRoomClassItem mrci={mrc} key={mrc.id} />
      ))}
    </motion.div>
  );
}
