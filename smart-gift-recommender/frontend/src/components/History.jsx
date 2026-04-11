import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

const fmt = (s) => s?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "";

const occasionEmojis = {
  birthday:"🎂",wedding:"💍",baby_shower:"👶",graduation:"🎓",anniversary:"💑",
  farewell:"👋",promotion:"🏆",valentines:"❤️",mothers_day:"🌸",fathers_day:"👔",
  diwali:"🪔",holi:"🎨",navratri:"🪷",raksha_bandhan:"🪢",baisakhi:"🌾",
  ganesh_chaturthi:"🐘",onam:"🌺",ugadi:"🌿",eid:"🌙",eid_adha:"🐑",
  christmas:"🎄",easter:"🐣",chinese_new_year:"🐉",mid_autumn:"🥮",
  hanukkah:"🕎",rosh_hashanah:"🍎",new_year:"🎆",thanksgiving:"🦃",halloween:"🎃",
  housewarming:"🏠",get_well_soon:"💊",congratulations:"🎉",thank_you:"🙏",any:"🎁",
};

export default function History({ onReSearch }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await apiFetch("/api/history");
      setItems(await res.json());
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchHistory(); }, []);

  const remove = async (id) => {
    await apiFetch(`/api/history/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearAll = async () => {
    await apiFetch("/api/history", { method: "DELETE" });
    setItems([]);
  };

  const formatDate = (dt) => {
    if (!dt) return "";
    const d = new Date(dt);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl shadow-rose-100 w-full max-w-md p-8 border border-rose-100">
      <div className="text-center mb-6">
        <div className="text-4xl mb-1">🕰️</div>
        <h2 className="font-serif text-2xl font-bold text-rose-700">My Search History</h2>
        <p className="text-rose-400 text-xs mt-1 tracking-wide">Only your own searches — private to you</p>
      </div>

      {loading && <p className="text-center text-rose-300 text-sm py-8">Loading your history... 💕</p>}

      {!loading && items.length === 0 && (
        <div className="text-center py-10">
          <div className="text-5xl mb-3">🌹</div>
          <p className="text-rose-400 text-sm">No searches yet.</p>
          <p className="text-rose-300 text-xs mt-1">Start finding gifts 💝</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="flex justify-end mb-3">
          <button onClick={clearAll}
            className="text-xs text-rose-400 border border-rose-200 px-3 py-1 rounded-full hover:bg-rose-50 transition cursor-pointer">
            🗑️ Clear All
          </button>
        </div>
      )}

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id}
            className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100 rounded-2xl px-4 py-3 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base">{occasionEmojis[item.occasion] || "🎁"}</span>
                  <span className="text-sm font-semibold text-gray-800">{fmt(item.occasion)}</span>
                  <span className="text-xs text-rose-400">for {fmt(item.relationship)}</span>
                  {item.gender && item.gender !== "any" && (
                    <span className="text-xs bg-pink-100 text-pink-500 px-2 py-0.5 rounded-full">{fmt(item.gender)}</span>
                  )}
                  <span className="text-xs bg-rose-100 text-rose-500 px-2 py-0.5 rounded-full">{fmt(item.budget)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{formatDate(item.created_at)}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => onReSearch({ relationship: item.relationship, occasion: item.occasion, budget: item.budget, gender: item.gender })}
                  className="text-xs px-2 py-1 rounded-full border border-rose-300 text-rose-500 hover:bg-rose-100 transition cursor-pointer"
                  title="Search again">
                  🔁
                </button>
                <button onClick={() => remove(item.id)}
                  className="text-xs px-2 py-1 rounded-full border border-rose-200 text-rose-400 hover:bg-rose-50 transition cursor-pointer">
                  ✕
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
