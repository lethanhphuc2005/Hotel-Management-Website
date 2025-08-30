import type { NextConfig } from "next";

const isProdStyle = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: isProdStyle,
  },
  experimental: {
    optimizeCss: !isProdStyle,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
