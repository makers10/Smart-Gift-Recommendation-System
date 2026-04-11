import { useState } from "react";
import { apiFetch } from "../utils/api";

const occasionEmojis = {
  birthday:"🎂",wedding:"💍",baby_shower:"👶",graduation:"🎓",anniversary:"💑",
  farewell:"👋",promotion:"🏆",valentines:"❤️",mothers_day:"🌸",fathers_day:"👔",
  diwali:"🪔",holi:"🎨",navratri:"🪷",raksha_bandhan:"🪢",baisakhi:"🌾",
  ganesh_chaturthi:"🐘",onam:"🌺",ugadi:"🌿",eid:"🌙",eid_adha:"🐑",
  christmas:"🎄",easter:"🐣",chinese_new_year:"🐉",mid_autumn:"🥮",
  hanukkah:"🕎",rosh_hashanah:"🍎",new_year:"🎆",thanksgiving:"🦃",halloween:"🎃",
  housewarming:"🏠",get_well_soon:"💊",congratulations:"🎉",thank_you:"🙏",any:"🎁",
};

const fmt = (s) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const buyLink = (gift) => `https://www.amazon.in/s?k=${encodeURIComponent(gift)}`;

export default function GiftResults({ result, onReset }) {
  const [scores, setScores] = useState(() =>
    Object.fromEntries(result.recommendations.map((g) => [g.name, g.score]))
  );
  const [voted, setVoted] = useState({});
  const [wishlisted, setWishlisted] = useState({});
  const [feedback, setFeedback] = useState({});

  const handleVote = async (giftName, vote) => {
    if (voted[giftName]) return;
    try {
      await apiFetch("/api/vote", {
        method: "POST",
        body: JSON.stringify({ gift_name: giftName, relationship: result.relationship, occasion: result.occasion, vote }),
      });
      setScores((p) => ({ ...p, [giftName]: (p[giftName] || 0) + vote }));
      setVoted((p) => ({ ...p, [giftName]: vote }));
      setFeedback((p) => ({ ...p, [giftName]: vote === 1 ? "So sweet of you! 💕" : "We'll do better 🌹" }));
    } catch {}
  };

  const handleWishlist = async (gift) => {
    if (wishlisted[gift.name]) return;
    try {
      await apiFetch("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({ gift_name: gift.name, relationship: result.relationship, occasion: result.occasion, budget: result.budget }),
      });
      setWishlisted((p) => ({ ...p, [gift.name]: true }));
    } catch {}
  };

  const emoji = occasionEmojis[result.occasion] || "🎁";
  const sorted = [...result.recommendations].sort((a, b) => (scores[b.name] || 0) - (scores[a.name] || 0));

  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <div className="text-4xl mb-1">{emoji}</div>
        <h2 className="font-serif text-2xl font-bold text-rose-700">Your Gift Ideas</h2>
        <p className="text-rose-400 text-xs mt-1">
          For your <span className="font-semibold">{fmt(result.relationship)}</span>
          {result.gender !== "any" && <> ({fmt(result.gender)})</>}
          {" · "}{fmt(result.occasion)}{" · "}{fmt(result.budget)} budget
        </p>
      </div>

      <ul className="space-y-3">
        {sorted.map((gift, i) => (
          <li key={gift.name}
            className="relative bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100
              rounded-2xl px-4 py-3 shadow-sm hover:shadow-md hover:shadow-rose-100 transition-all">
            {i === 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full shadow">
                ✨ Top Pick
              </span>
            )}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xl">🎁</span>
                <span className="text-sm font-semibold text-gray-800 truncate">{gift.name}</span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0
                ${(scores[gift.name]||0)>0?"bg-rose-100 text-rose-600":(scores[gift.name]||0)<0?"bg-gray-100 text-gray-400":"bg-pink-50 text-pink-400"}`}>
                {(scores[gift.name]||0)>0?"+":""}{scores[gift.name]||0} ♥
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => handleVote(gift.name, 1)} disabled={!!voted[gift.name]}
                className={`text-xs px-3 py-1 rounded-full border transition cursor-pointer
                  ${voted[gift.name]===1?"bg-rose-500 text-white border-rose-500":"border-rose-200 hover:bg-rose-50 text-rose-500"}`}>
                👍 Love it
              </button>
              <button onClick={() => handleVote(gift.name, -1)} disabled={!!voted[gift.name]}
                className={`text-xs px-3 py-1 rounded-full border transition cursor-pointer
                  ${voted[gift.name]===-1?"bg-gray-400 text-white border-gray-400":"border-gray-200 hover:bg-gray-50 text-gray-500"}`}>
                👎 Nope
              </button>
              <button onClick={() => handleWishlist(gift)}
                className={`text-xs px-3 py-1 rounded-full border transition cursor-pointer
                  ${wishlisted[gift.name]?"bg-pink-500 text-white border-pink-500":"border-pink-200 hover:bg-pink-50 text-pink-500"}`}>
                {wishlisted[gift.name] ? "💖 Saved" : "🤍 Save"}
              </button>
              <a href={buyLink(gift.name)} target="_blank" rel="noreferrer"
                className="text-xs px-3 py-1 rounded-full border border-orange-200 text-orange-500 hover:bg-orange-50 transition ml-auto">
                🛒 Buy Now
              </a>
            </div>
            {feedback[gift.name] && <p className="text-xs text-rose-400 mt-1.5 italic">{feedback[gift.name]}</p>}
          </li>
        ))}
      </ul>

      <button onClick={onReset}
        className="w-full border-2 border-rose-300 text-rose-500 hover:bg-rose-500 hover:text-white
          font-semibold py-3 rounded-2xl transition-all cursor-pointer text-sm tracking-wide">
        ← Search Again 🌹
      </button>
    </div>
  );
}
