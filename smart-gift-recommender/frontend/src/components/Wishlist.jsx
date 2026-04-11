import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

const fmt = (s) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await apiFetch("/api/wishlist");
      setItems(await res.json());
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchWishlist(); }, []);

  const remove = async (id) => {
    await apiFetch(`/api/wishlist/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl shadow-rose-100 w-full max-w-md p-8 border border-rose-100">
      <div className="text-center mb-6">
        <div className="text-4xl mb-1">💌</div>
        <h2 className="font-serif text-2xl font-bold text-rose-700">My Wishlist</h2>
        <p className="text-rose-400 text-xs mt-1 tracking-wide">Gifts you've fallen in love with</p>
      </div>

      {loading && <p className="text-center text-rose-300 text-sm py-8">Loading your saved gifts... 💕</p>}
      {!loading && items.length === 0 && (
        <div className="text-center py-10">
          <div className="text-5xl mb-3">🌹</div>
          <p className="text-rose-400 text-sm">No saved gifts yet.</p>
          <p className="text-rose-300 text-xs mt-1">Go find something beautiful 💝</p>
        </div>
      )}

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id}
            className="flex items-center justify-between bg-gradient-to-r from-rose-50 to-pink-50
              border border-rose-100 rounded-2xl px-4 py-3 shadow-sm hover:shadow-rose-100 hover:shadow-md transition-all">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800 truncate">🎁 {item.gift_name}</p>
              <p className="text-xs text-rose-400 mt-0.5">
                {fmt(item.relationship)} · {fmt(item.occasion)} · {fmt(item.budget)}
              </p>
            </div>
            <div className="flex gap-2 shrink-0 ml-3">
              <a href={`https://www.amazon.in/s?k=${encodeURIComponent(item.gift_name)}`}
                target="_blank" rel="noreferrer"
                className="text-xs px-2 py-1 rounded-full border border-orange-200 text-orange-500 hover:bg-orange-50 transition">
                🛒
              </a>
              <button onClick={() => remove(item.id)}
                className="text-xs px-2 py-1 rounded-full border border-rose-200 text-rose-400 hover:bg-rose-50 transition cursor-pointer">
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
