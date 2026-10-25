/**
 * Gift with Love — Design Tokens
 *
 * Single source of truth for the brand's visual language.
 * These values are referenced in:
 *   - tailwind.config.js  (theme.extend — Tailwind utility classes)
 *   - index.css           (CSS custom properties — for non-Tailwind contexts)
 *   - Components          (import tokens directly where inline styles are unavoidable)
 *
 * Palette intent:
 *   ivory/cream   — warm page backgrounds; convey luxury, warmth
 *   burgundy      — primary brand color; authority, depth, romance
 *   rose/blush    — secondary accents; warmth, approachability
 *   gold          — sparingly used highlights; premium feel
 *   neutral       — text hierarchy, borders, dividers
 */

// ─── COLORS ───────────────────────────────────────────────────────────────────

export const colors = {
  // Ivory / Cream backgrounds
  ivory: {
    50:  "#fdfaf6",   // lightest page background
    100: "#faf5ef",   // default page background (replaces #faf7f4)
    200: "#f5ede0",   // subtle section contrast
    300: "#ecdcc8",   // dividers, card borders
  },

  // Deep Burgundy — primary brand color
  burgundy: {
    50:  "#fdf2f4",   // lightest tint (hover backgrounds)
    100: "#fce7eb",   // light tint
    200: "#f9c6ce",   // soft accent
    300: "#f28fa0",   // medium
    400: "#e85c79",   // bold accent
    500: "#c2274b",   // primary action (buttons, links)
    600: "#9f1239",   // primary brand — headings, nav active
    700: "#7e0f2e",   // deep brand
    800: "#5f0a22",   // darkest — high-contrast text
    900: "#3d0615",   // near-black for maximum contrast
  },

  // Rose / Blush — secondary accent
  rose: {
    50:  "#fff1f2",
    100: "#ffe4e6",
    200: "#fecdd3",
    300: "#fda4af",
    400: "#fb7185",
    500: "#f43f5e",
    600: "#e11d48",
  },

  // Champagne Gold — use sparingly
  gold: {
    100: "#fef9ec",   // background tint
    200: "#fdf0c8",   // light accent
    300: "#f8d878",   // medium gold
    400: "#f0b429",   // rich gold
    500: "#d4941c",   // deep gold for text/icons
  },

  // Neutral — text, borders, surfaces
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

  // ── LUXURY SEMANTIC TOKENS ──────────────────────────────────────
  espresso: {
    DEFAULT: "#17131A",
    dark:    "#100D13",
    light:   "#231B24",
  },
  champagne: {
    DEFAULT: "#E9D7B8",
    light:   "#F5EADB",
    dark:    "#D4BE97",
    glow:    "rgba(233, 215, 184, 0.25)",
  },
  luxury: {
    main:      "#17131A",
    secondary: "#1F161E",
    card:      "#261722",
    elevated:  "#331C2C",
    text:      "#FFF7E9",
    muted:     "#D8CABA",
    border:    "#4A1830",
    gold:      "#C69A55",
    champagne: "#E9D7B8",
    burgundy:  "#4A1830",
  },
};

// ─── TYPOGRAPHY ───────────────────────────────────────────────────────────────

export const typography = {
  fontFamily: {
    // Cormorant Garamond — luxury editorial serif for display headings
    serif: ["'Cormorant Garamond'", "Georgia", "serif"],
    // Inter — clean, highly legible sans-serif for all body and UI text
    sans:  ["'Inter'", "system-ui", "sans-serif"],
  },
  fontSize: {
    xs:   ["0.75rem",  { lineHeight: "1rem" }],           // 12px
    sm:   ["0.875rem", { lineHeight: "1.375rem" }],        // 14px
    base: ["1rem",     { lineHeight: "1.625rem" }],        // 16px
    lg:   ["1.125rem", { lineHeight: "1.75rem" }],         // 18px
    xl:   ["1.25rem",  { lineHeight: "1.875rem" }],        // 20px
    "2xl":["1.5rem",   { lineHeight: "2rem" }],            // 24px
    "3xl":["1.875rem", { lineHeight: "2.375rem" }],        // 30px
    "4xl":["2.25rem",  { lineHeight: "2.75rem" }],         // 36px
    "5xl":["3rem",     { lineHeight: "1.15" }],            // 48px
    "6xl":["3.75rem",  { lineHeight: "1.1" }],             // 60px
    "7xl":["4.5rem",   { lineHeight: "1.05" }],            // 72px
  },
  fontWeight: {
    light:    "300",
    normal:   "400",
    medium:   "500",
    semibold: "600",
    bold:     "700",
  },
  letterSpacing: {
    tight:   "-0.02em",
    normal:  "0em",
    wide:    "0.04em",
    wider:   "0.08em",
    widest:  "0.16em",
  },
};

// ─── SPACING ──────────────────────────────────────────────────────────────────
// Tailwind's default spacing scale (4px base) is sufficient.
// These named aliases make intent clearer in component code.

export const spacing = {
  px:    "1px",
  0:     "0",
  0.5:   "0.125rem",  // 2px
  1:     "0.25rem",   // 4px
  1.5:   "0.375rem",  // 6px
  2:     "0.5rem",    // 8px
  3:     "0.75rem",   // 12px
  4:     "1rem",      // 16px
  5:     "1.25rem",   // 20px
  6:     "1.5rem",    // 24px
  8:     "2rem",      // 32px
  10:    "2.5rem",    // 40px
  12:    "3rem",      // 48px
  16:    "4rem",      // 64px
  20:    "5rem",      // 80px
  24:    "6rem",      // 96px
};

// ─── BORDER RADIUS ────────────────────────────────────────────────────────────

export const borderRadius = {
  none:  "0",
  sm:    "0.25rem",   // 4px  — small chips, tags
  base:  "0.5rem",    // 8px  — inputs, small buttons
  md:    "0.75rem",   // 12px — cards, panels
  lg:    "1rem",      // 16px — modal dialogs
  xl:    "1.25rem",   // 20px — feature cards
  "2xl": "1.5rem",    // 24px — hero elements
  full:  "9999px",    // pills, avatars
};

// ─── SHADOWS ──────────────────────────────────────────────────────────────────

export const boxShadow = {
  none:  "none",
  xs:    "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  sm:    "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
  base:  "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
  md:    "0 6px 16px -4px rgb(0 0 0 / 0.08), 0 2px 8px -2px rgb(0 0 0 / 0.04)",
  lg:    "0 10px 28px -6px rgb(0 0 0 / 0.10), 0 4px 12px -4px rgb(0 0 0 / 0.06)",
  xl:    "0 20px 48px -12px rgb(0 0 0 / 0.14), 0 8px 24px -6px rgb(0 0 0 / 0.08)",
  // Brand-tinted shadow for primary action elements
  brand: "0 4px 16px -4px rgb(194 39 75 / 0.28)",
  "brand-lg": "0 8px 28px -6px rgb(194 39 75 / 0.22)",
};

// ─── TRANSITIONS ──────────────────────────────────────────────────────────────

export const transitionDuration = {
  fast:   "120ms",
  base:   "180ms",
  slow:   "280ms",
  slower: "400ms",
};

export const transitionEasing = {
  default: "cubic-bezier(0.4, 0, 0.2, 1)",
  in:      "cubic-bezier(0.4, 0, 1, 1)",
  out:     "cubic-bezier(0, 0, 0.2, 1)",
  spring:  "cubic-bezier(0.34, 1.56, 0.64, 1)",
};

// ─── BREAKPOINTS ──────────────────────────────────────────────────────────────
// Mirror Tailwind's defaults for reference; not imported into tailwind.config
// (Tailwind manages its own breakpoints — these are for documentation / JS use).

export const breakpoints = {
  sm:  "640px",
  md:  "768px",
  lg:  "1024px",
  xl:  "1280px",
  "2xl": "1536px",
};

// ─── FOCUS RING ───────────────────────────────────────────────────────────────
// Applied as Tailwind utilities in components. Defined here for consistency.

export const focusRing = {
  // Use on interactive elements: outline + offset in brand burgundy
  className: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-500 focus-visible:ring-offset-2",
};
