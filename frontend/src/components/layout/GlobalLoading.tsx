"use client";

import { motion, AnimatePresence, easeInOut } from "framer-motion";
import Image from "next/image";
import styles from "@/styles/layout/globalLoading.module.css";
import { useLoading } from "@/contexts/LoadingContext";
import { useEffect, useState } from "react";

export default function GlobalLoading() {
  const { loading } = useLoading();
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => {
        setShowOverlay(false);
      }, 800); // Phù hợp với thời gian exit
      return () => clearTimeout(timeout);
    } else {
      setShowOverlay(true);
    }
  }, [loading]);

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 1 }}
          animate={{ opacity: loading ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: easeInOut }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{
              y: -40,
              opacity: 0,
              rotate: 8,
              scale: 0.7,
              transition: { duration: 0.5, ease: easeInOut },
            }}
            transition={{ duration: 0.4, ease: easeInOut }}
          >
            <Image
              src="/img/logo-doc.png"
              alt="Logo"
              width={80}
              height={80}
              className={styles.logo}
            />
          </motion.div>

          <div className={styles.dotContainer}>
            <motion.div className={styles.dot} layoutId="dot1" />
            <motion.div className={styles.dot} layoutId="dot2" />
            <motion.div className={styles.dot} layoutId="dot3" />
          </div>

          <motion.p
            className={styles.text}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.5, duration: 0.4, ease: easeInOut }}
          >
            Đang tải dữ liệu...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
