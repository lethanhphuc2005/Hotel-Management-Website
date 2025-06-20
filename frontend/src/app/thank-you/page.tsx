"use client";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ThankYou() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/"); // Chuyển về trang chủ sau 5s
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        backgroundColor: "#111",
        color: "#fff",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <CheckCircleIcon
          style={{
            width: 100,
            height: 100,
            color: "#1abc9c",
            margin: "0 auto",
          }}
        />
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4"
          style={{ color: "#FAB320", fontWeight: 700 }}
        >
          Cảm ơn bạn đã đặt phòng!
        </motion.h1>
        <p className="mt-3 fs-5">
          Chúng tôi đã gửi xác nhận vào email của bạn.
        </p>
        <p className="text-white-50 mt-2">
          Bạn sẽ được chuyển về trang chủ trong giây lát...
        </p>
        <Link href="/">
          <motion.button
            className="btn btn-primary mt-4"
            style={{
              padding: "0.5rem 2rem",
              fontSize: "1.2rem",
              color: "black",
              backgroundColor: "#FAB320",
              border: "none",
              borderRadius: "5px",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Quay về trang chủ
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
