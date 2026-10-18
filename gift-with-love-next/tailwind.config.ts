import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          light: "#FFFDF8",
          DEFAULT: "#FCF9F2",
          warm: "#F5EFE6",
          dark: "#ECE4D6",
        },
        burgundy: {
          50: "#FFF1F2",
          100: "#FFE4E6",
          200: "#FECDD3",
          300: "#FDA4AF",
          400: "#FB7185",
          500: "#E11D48",
          600: "#BE123C",
          700: "#9F1239",
          800: "#881337",
          900: "#700F2B",
          950: "#4C0519",
        },
        champagne: {
          50: "#FDFBF7",
          100: "#F9F4EB",
          200: "#F2E8D5",
          300: "#E8D8BA",
          400: "#DCBF96",
          500: "#C99E67",
        },
        gold: {
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      animation: {
        "shimmer": "shimmer 2.5s infinite linear",
        "spotlight": "spotlight 2s ease .75s 1 forwards",
        "pulse-subtle": "pulseSubtle 4s ease-in-out infinite",
        "drift-slow": "driftSlow 20s ease-in-out infinite alternate",
        "border-beam": "borderBeam calc(var(--duration)*1s) infinite linear",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
        driftSlow: {
          "0%": { transform: "translate(0, 0) rotate(0deg)" },
          "50%": { transform: "translate(30px, -20px) rotate(4deg)" },
          "100%": { transform: "translate(-20px, 30px) rotate(-3deg)" },
        },
      },
      boxShadow: {
        "luxury": "0 20px 40px -15px rgba(112, 15, 43, 0.08), 0 0 1px 1px rgba(136, 19, 55, 0.05)",
        "luxury-lg": "0 25px 50px -12px rgba(112, 15, 43, 0.12), 0 0 1px 1px rgba(136, 19, 55, 0.08)",
        "glow": "0 0 25px -5px rgba(225, 29, 72, 0.25)",
        "glow-gold": "0 0 30px -5px rgba(245, 158, 11, 0.3)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        luxuryGifting: {
          "primary": "#881337",
          "secondary": "#FFE4E6",
          "accent": "#F59E0B",
          "neutral": "#292524",
          "base-100": "#FCF9F2",
          "info": "#3ABFF8",
          "success": "#10B981",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
    ],
  },
};

export default config;
