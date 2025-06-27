// tailwind.config.js
module.exports = {
  prefix: "tw-", // Tiền tố cho các lớp Tailwind
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Nếu dùng Next.js
    "./app/**/*.{js,ts,jsx,tsx}", // Nếu dùng Next.js với app directory
    "./components/**/*.{js,ts,jsx,tsx}", // Nếu có thư mục components
  ],
  theme: {
    extend: {
      animation: {
        typing: "typing 2.5s steps(22)",
      },
      keyframes: {
        typing: {
          from: { width: "0" },
          to: { width: "100%" },
        },
      },
      colors: {
        primary: "#FAB320", // Vàng thương hiệu
        dark: "#111", // Nền tối sang trọng
        primaryHover: "#FACC15",
      },

      boxShadow: {
        glow: "0 0 15px #FAB320",
      },
      fontFamily: {
        playfair: ['"Playfair Display"', "serif"],
        poppins: ['"Poppins"', "sans-serif"],
        lora: ['"Lora"', "serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
