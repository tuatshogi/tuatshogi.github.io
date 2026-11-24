/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sumi: "#0F172A",
        navy: "#0F3350",
        warmWhite: "#F8FAF8",
        paper: "#FFFFFF",
        ink: "#272A2A",
        line: "#D9DEDA",
        gold: "#B5974C",
      },
      fontFamily: {
        mincho: ["Shippori Mincho", "Noto Serif JP", "serif"],
        sans: ["Shippori Mincho", "Noto Serif JP", "serif"],
      },
      maxWidth: {
        site: "1200px",
      },
    },
  },
  plugins: [],
};
