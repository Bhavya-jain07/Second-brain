/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
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
        // dashboard. Values come from CSS variables (see index.css) so a
        // single `.dark` class toggle flips the whole palette without
        // touching any component. The rgb(var(...) / <alpha-value>)
        // pattern is required for Tailwind's opacity modifiers (e.g.
        // `text-swiss-bg/40`) to work with CSS-variable-based colors.
        swiss: {
          bg: "rgb(var(--swiss-bg) / <alpha-value>)",
          ink: "rgb(var(--swiss-ink) / <alpha-value>)",
          accent: "rgb(var(--swiss-accent) / <alpha-value>)",
          muted: "rgb(var(--swiss-muted) / <alpha-value>)",
          faint: "rgb(var(--swiss-faint) / <alpha-value>)",
          line: "rgb(var(--swiss-line) / <alpha-value>)",
          panel: "rgb(var(--swiss-panel) / <alpha-value>)",
          card: "rgb(var(--swiss-card) / <alpha-value>)",
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
