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
    },
  },
  plugins: [],
};
