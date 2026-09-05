/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f2ff",
          100: "#ece8ff",
          200: "#d9d1ff",
          300: "#b9abff",
          400: "#9779ff",
          500: "#7c4dff",
          600: "#6c2bfa",
          700: "#5c1fdb",
          800: "#4c1bb0",
          900: "#3f1a8c",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        float: "float 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
