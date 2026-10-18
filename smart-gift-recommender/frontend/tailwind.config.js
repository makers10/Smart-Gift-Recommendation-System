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

        // Neutral greys — text hierarchy, dividers
        neutral: {
          0:   "#ffffff",
          50:  "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
        },

        // Champagne Gold — sparingly
        gold: {
          100: "#fef9ec",
          200: "#fdf0c8",
          300: "#f8d878",
          400: "#f0b429",
          500: "#d4941c",
        },

        // ── GIFTVERSE FUTURISTIC PALETTE ─────────────────────────────
        midnight: {
          950: "#02040a",
          900: "#060b18",
          850: "#091024",
          800: "#0e1738",
          700: "#152252",
        },
        cyber: {
          cyan: "#00f2fe",
          cyanBright: "#38bdf8",
          cyanDark: "#0284c7",
          violet: "#8b5cf6",
          violetBright: "#a855f7",
          pink: "#ff007a",
          pinkBright: "#f43f5e",
        },
      },

      // ── TYPOGRAPHY ─────────────────────────────────────────────────────
      fontFamily: {
        // Cormorant Garamond — luxury editorial serif for display headings
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        // Inter / Plus Jakarta Sans — legible modern sans-serif
        sans:  ["'Plus Jakarta Sans'", "'Inter'", "system-ui", "sans-serif"],
        display: ["'Outfit'", "'Plus Jakarta Sans'", "sans-serif"],
      },

      // Letter-spacing utilities
      letterSpacing: {
        widest: "0.16em",
        ultra: "0.25em",
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
        "neon-cyan": "0 0 30px -4px rgba(0, 242, 254, 0.45)",
        "neon-violet": "0 0 30px -4px rgba(139, 92, 246, 0.45)",
        "neon-pink": "0 0 30px -4px rgba(255, 0, 122, 0.45)",
        "glass-glow": "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
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

      animation: {
        shimmer: "shimmer 3s infinite linear",
        pulseSubtle: "pulseSubtle 4s ease-in-out infinite",
        borderBeam: "borderBeam calc(var(--duration)*1s) infinite linear",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.04)" },
        },
        borderBeam: {
          "100%": { "offset-distance": "100%" },
        },
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
