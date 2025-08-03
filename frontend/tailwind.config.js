// tailwind.config.js
module.exports = {
  prefix: "tw-", // Tiền tố cho các lớp Tailwind
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}", // nếu bạn để component trong src/
  ],
   safelist: [
    // Text colors
    'tw-text-yellow-500',
    'tw-text-gray-300',
    'tw-text-sm',
    'tw-text-sm/3',

    // Backgrounds
    'tw-bg-black',
    'tw-bg-black/50',
    'tw-bg-white',
    'tw-bg-yellow-500',

    // Others
    'tw-list-disc',
    'tw-rounded-xl',
    'tw-shadow',
    'tw-p-4',
    'tw-font-semibold',
    'tw-mb-4',
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
        playfair: ["var(--font-playfair-display)", "serif"],
        lora: ["var(--font-lora)", "serif"],
        geistMono: ["var(--font-geist-mono)", "monospace"],
        vietnamese: ["var(--font-vietnamese)", "sans-serif"],
      },
    },
  },
};
