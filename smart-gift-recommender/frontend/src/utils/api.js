/**
 * API utility — centralized fetch wrapper for the Gift with Love backend.
 *
 * The base URL is read from the Vite environment variable VITE_API_URL.
 * Set it in .env.development (local), .env.production (production), or any
 * other Vite env file. Falls back to localhost:3001 so existing dev behavior
 * is unchanged if no env file is present.
 */
const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

/**
 * Returns a persistent, anonymous user ID stored in localStorage.
 * This ID is sent as the x-user-id header so the backend can associate
 * search history, wishlist, and marketplace actions with the same browser session.
 */
export function getUserId() {
  let uid = localStorage.getItem("gift_user_id");
  if (!uid) {
    uid = "user_" + Math.random().toString(36).slice(2, 11) + Date.now();
    localStorage.setItem("gift_user_id", uid);
  }
  return uid;
}

/** Returns the standard auth headers including Content-Type and x-user-id. */
export function authHeaders() {
  return {
    "Content-Type": "application/json",
    "x-user-id": getUserId(),
  };
}

/**
 * Thin fetch wrapper that prepends BASE, merges auth headers, and returns
 * the raw Response so callers can handle status codes themselves.
 *
 * @param {string} path     — API path, e.g. "/api/recommend"
 * @param {RequestInit} [options] — standard fetch options
 * @returns {Promise<Response>}
 */
export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });
  return res;
}
