const BASE = "http://localhost:3001";

// Generate a persistent user ID stored in localStorage
export function getUserId() {
  let uid = localStorage.getItem("gift_user_id");
  if (!uid) {
    uid = "user_" + Math.random().toString(36).slice(2, 11) + Date.now();
    localStorage.setItem("gift_user_id", uid);
  }
  return uid;
}

export function authHeaders() {
  return {
    "Content-Type": "application/json",
    "x-user-id": getUserId(),
  };
}

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });
  return res;
}
