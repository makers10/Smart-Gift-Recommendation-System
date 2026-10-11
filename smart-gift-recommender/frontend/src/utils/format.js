/**
 * Shared formatting utilities for Gift with Love.
 *
 * Centralises helpers that were previously duplicated across
 * GiftResults, History, Wishlist, Dashboard, and Marketplace.
 */

/**
 * Converts a snake_case or kebab-case string to Title Case.
 * Returns an empty string for null / undefined inputs.
 *
 * @example
 *   fmt("mothers_day")   → "Mothers Day"
 *   fmt("best_friend")   → "Best Friend"
 *   fmt(undefined)       → ""
 */
export function fmt(s) {
  if (!s) return "";
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Maps occasion keys (as used in the API and options.js) to a representative
 * emoji character. Used in History entries, GiftResults headers, and anywhere
 * an occasion needs a compact visual indicator.
 *
 * Note: these are presentational only. All emoji-bearing strings should also
 * carry accessible text for screen readers (handled at the call site).
 */
export const occasionEmojis = {
  birthday:           "🎂",
  wedding:            "💍",
  baby_shower:        "👶",
  graduation:         "🎓",
  anniversary:        "💑",
  farewell:           "👋",
  promotion:          "🏆",
  valentines:         "❤️",
  mothers_day:        "🌸",
  fathers_day:        "👔",
  // Indian festivals
  diwali:             "🪔",
  holi:               "🎨",
  navratri:           "🪷",
  raksha_bandhan:     "🪢",
  baisakhi:           "🌾",
  ganesh_chaturthi:   "🐘",
  onam:               "🌺",
  ugadi:              "🌿",
  // Islamic festivals
  eid:                "🌙",
  eid_adha:           "🐑",
  // Christian festivals
  christmas:          "🎄",
  easter:             "🐣",
  // East Asian festivals
  chinese_new_year:   "🐉",
  mid_autumn:         "🥮",
  diwali_of_south:    "✨",
  // Jewish festivals
  hanukkah:           "🕎",
  rosh_hashanah:      "🍎",
  // Western / global
  new_year:           "🎆",
  thanksgiving:       "🦃",
  halloween:          "🎃",
  // Life events
  housewarming:       "🏠",
  get_well_soon:      "💊",
  congratulations:    "🎉",
  thank_you:          "🙏",
  any:                "🎁",
};

/**
 * Formats a UTC/ISO date string into a readable local date+time string.
 * Defaults to the en-IN locale used by History; pass a locale override if needed.
 *
 * @param {string} dt  — ISO date string from the API
 * @param {string} [locale="en-IN"]
 * @returns {string}
 */
export function formatDate(dt, locale = "en-IN") {
  if (!dt) return "";
  const d = new Date(dt);
  return d.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Builds an Amazon India search URL for a given gift name.
 * Keeps buy-link logic in one place so it can be updated globally.
 *
 * @param {string} giftName
 * @returns {string}
 */
export function amazonLink(giftName) {
  return `https://www.amazon.in/s?k=${encodeURIComponent(giftName)}`;
}
