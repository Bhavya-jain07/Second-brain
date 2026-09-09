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
        // Swiss / International Typographic Style tokens — used for the
        // dashboard (bold grid, minimal color, no gradients/shadows).
        swiss: {
          bg: "#f5f4f0",
          ink: "#111111",
          accent: "#e8391c",
          muted: "#6b6a66",
          faint: "#a19f96",
          line: "#d8d6ce",
          panel: "#f0efe9",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        pixel: ['"Press Start 2P"', "monospace"],
        retro: ["VT323", "monospace"],
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
