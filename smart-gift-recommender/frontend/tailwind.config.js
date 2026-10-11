/**
 * Tailwind CSS configuration for Gift with Love.
 *
 * Brand palette, typography, and utility tokens are defined here so every
 * component can use consistent class names (e.g. bg-ivory-100, text-burgundy-600).
 * The source of truth for token values is src/tokens.js — values here must stay
 * in sync with that file.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      // ── COLORS ─────────────────────────────────────────────────────────
      colors: {
        // Ivory / Cream backgrounds
        ivory: {
          50:  "#fdfaf6",
          100: "#faf5ef",   // default page background
          200: "#f5ede0",
          300: "#ecdcc8",
        },

        // Deep Burgundy — primary brand color
        burgundy: {
          50:  "#fdf2f4",
          100: "#fce7eb",
          200: "#f9c6ce",
          300: "#f28fa0",
          400: "#e85c79",
          500: "#c2274b",   // primary buttons, active states
          600: "#9f1239",   // headings, brand text
          700: "#7e0f2e",
          800: "#5f0a22",
          900: "#3d0615",
        },

        // Rose — secondary accent (keep existing rose scale for compatibility)
        rose: {
          50:  "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
        },

        // Champagne Gold — sparingly
        gold: {
          100: "#fef9ec",
          200: "#fdf0c8",
          300: "#f8d878",
          400: "#f0b429",
          500: "#d4941c",
        },
      },

      // ── TYPOGRAPHY ─────────────────────────────────────────────────────
      fontFamily: {
        // Cormorant Garamond — luxury editorial serif for display headings
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        // Inter — legible sans-serif for body and UI text
        sans:  ["'Inter'", "system-ui", "sans-serif"],
      },

      // Letter-spacing utilities
      letterSpacing: {
        widest: "0.16em",
      },

      // ── SHADOWS ────────────────────────────────────────────────────────
      boxShadow: {
        xs:          "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        sm:          "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        md:          "0 6px 16px -4px rgb(0 0 0 / 0.08), 0 2px 8px -2px rgb(0 0 0 / 0.04)",
        lg:          "0 10px 28px -6px rgb(0 0 0 / 0.10), 0 4px 12px -4px rgb(0 0 0 / 0.06)",
        xl:          "0 20px 48px -12px rgb(0 0 0 / 0.14), 0 8px 24px -6px rgb(0 0 0 / 0.08)",
        brand:       "0 4px 16px -4px rgb(194 39 75 / 0.28)",
        "brand-lg":  "0 8px 28px -6px rgb(194 39 75 / 0.22)",
      },

      // ── BORDER RADIUS ──────────────────────────────────────────────────
      borderRadius: {
        // Keep Tailwind defaults; add named aliases for design-token clarity
        card:    "0.75rem",   // 12px — standard card
        panel:   "1rem",      // 16px — panels, modals
        feature: "1.25rem",   // 20px — feature cards
      },

      // ── BACKGROUND IMAGES ──────────────────────────────────────────────
      backgroundImage: {
        // Warm ivory gradient used on the page background
        "ivory-gradient": "linear-gradient(135deg, #fdfaf6 0%, #faf5ef 50%, #f5ede0 100%)",
        // Subtle grain texture (kept extremely subtle, opacity controlled in CSS)
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
      },
    },
  },

  plugins: [
    // Scrollbar-hide utility
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": { display: "none" },
        },
      });
    },
  ],
};
