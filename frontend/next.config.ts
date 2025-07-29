import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["localhost", "res.cloudinary.com"], // ✅ thêm domain bạn đang dùng
  },
};

export default nextConfig;
