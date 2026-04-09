import { useEffect, useState } from "react";

const fmt = (s) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await fetch("http://localhost:8001/api/wishlist");
      const data = await res.json();
      setItems(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchWishlist(); }, []);

  const remove = async (id) => {
    await fetch(`http://localhost:8001/api/wishlist/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
      <h2 className="text-xl font-semibold text-violet-700 text-center mb-4">❤️ My Wishlist</h2>

      {loading && <p className="text-center text-gray-400 text-sm">Loading...</p>}
      {!loading && items.length === 0 && (
        <p className="text-center text-gray-400 text-sm">No saved gifts yet. Go find some 🎁</p>
      )}

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between bg-pink-50 border-l-4 border-pink-400 rounded-xl px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-800">🎁 {item.gift_name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {fmt(item.relationship)} · {fmt(item.occasion)} · {fmt(item.budget)}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <a
                href={`https://www.amazon.in/s?k=${encodeURIComponent(item.gift_name)}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs px-2 py-1 rounded-lg border border-orange-300 text-orange-600 hover:bg-orange-50 transition"
              >🛒 Buy</a>
              <button
                onClick={() => remove(item.id)}
                className="text-xs px-2 py-1 rounded-lg border border-red-300 text-red-500 hover:bg-red-50 transition cursor-pointer"
              >✕</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
