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

// Assign a gradient per card index
const cardGradients = [
  "from-rose-400 to-pink-500",
  "from-pink-400 to-fuchsia-500",
  "from-purple-400 to-pink-500",
  "from-rose-500 to-red-400",
  "from-fuchsia-400 to-rose-500",
  "from-pink-500 to-rose-400",
  "from-rose-300 to-pink-400",
  "from-amber-400 to-rose-400",
];

const fmt = (s) => s?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "";
const buyLink = (gift) => `https://www.amazon.in/s?k=${encodeURIComponent(gift)}`;

export default function GiftResults({ result, onReset }) {
  const [scores,     setScores]     = useState(() => Object.fromEntries(result.recommendations.map((g) => [g.name, g.score])));
  const [voted,      setVoted]      = useState({});
  const [wishlisted, setWishlisted] = useState({});
  const [feedback,   setFeedback]   = useState({});

  const handleVote = async (giftName, vote) => {
    if (voted[giftName]) return;
    try {
      await apiFetch("/api/vote", {
        method: "POST",
        body: JSON.stringify({ gift_name: giftName, relationship: result.relationship, occasion: result.occasion, vote }),
      });
      setScores((p)   => ({ ...p, [giftName]: (p[giftName] || 0) + vote }));
      setVoted((p)    => ({ ...p, [giftName]: vote }));
      setFeedback((p) => ({ ...p, [giftName]: vote === 1 ? "So sweet! 💕" : "Got it 🌹" }));
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

  const emoji  = occasionEmojis[result.occasion] || "🎁";
  const sorted = [...result.recommendations].sort((a, b) => (scores[b.name] || 0) - (scores[a.name] || 0));

  return (
    <div className="w-full max-w-4xl mx-auto">

      {/* Results header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-3">{emoji}</div>
        <h2 className="font-serif text-4xl font-bold text-rose-700">Your Gift Ideas</h2>
        <p className="text-rose-400 text-sm mt-2">
          For your <span className="font-semibold text-rose-600">{fmt(result.relationship)}</span>
          {result.gender !== "any" && <span className="text-rose-400"> ({fmt(result.gender)})</span>}
          <span className="mx-2 text-rose-200">·</span>
          <span className="font-semibold text-rose-600">{fmt(result.occasion)}</span>
          <span className="mx-2 text-rose-200">·</span>
          <span className="font-semibold text-rose-600">{fmt(result.budget)} budget</span>
        </p>
        <div className="flex justify-center gap-4 mt-3 text-xs text-rose-400">
          <span>✨ {sorted.length} curated picks</span>
          <span>🛒 Buy links included</span>
          <span>💝 Rate to improve</span>
        </div>
      </div>

      {/* Gift cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {sorted.map((gift, i) => (
          <div key={gift.name}
            className="group relative bg-white/80 backdrop-blur-sm border border-rose-100
              rounded-3xl shadow-md hover:shadow-xl hover:shadow-rose-100
              transition-all duration-300 hover:-translate-y-1 overflow-hidden">

            {/* Top color bar */}
            <div className={`h-2 bg-gradient-to-r ${cardGradients[i % cardGradients.length]}`} />

            {/* Top Pick badge */}
            {i === 0 && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-rose-500 to-pink-500
                text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                ✨ Top Pick
              </div>
            )}

            <div className="p-5">
              {/* Gift icon + name */}
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cardGradients[i % cardGradients.length]}
                  flex items-center justify-center text-2xl shadow-md shrink-0`}>
                  🎁
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-sm leading-snug">{gift.name}</h3>
                  <div className={`inline-flex items-center gap-1 mt-1 text-xs font-bold px-2 py-0.5 rounded-full
                    ${(scores[gift.name]||0) > 0 ? "bg-rose-100 text-rose-600" :
                      (scores[gift.name]||0) < 0 ? "bg-gray-100 text-gray-400" : "bg-pink-50 text-pink-400"}`}>
                    ♥ {(scores[gift.name]||0) > 0 ? "+" : ""}{scores[gift.name]||0}
                  </div>
                </div>
              </div>

              {/* Feedback */}
              {feedback[gift.name] && (
                <p className="text-xs text-rose-400 italic mb-3">{feedback[gift.name]}</p>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleVote(gift.name, 1)} disabled={!!voted[gift.name]}
                  className={`flex-1 text-xs py-2 rounded-xl border font-medium transition cursor-pointer
                    ${voted[gift.name]===1
                      ? "bg-rose-500 text-white border-rose-500"
                      : "border-rose-200 text-rose-500 hover:bg-rose-50"}`}>
                  👍 Love
                </button>
                <button onClick={() => handleVote(gift.name, -1)} disabled={!!voted[gift.name]}
                  className={`flex-1 text-xs py-2 rounded-xl border font-medium transition cursor-pointer
                    ${voted[gift.name]===-1
                      ? "bg-gray-400 text-white border-gray-400"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                  👎 Nope
                </button>
              </div>

              <div className="flex gap-2 mt-2">
                <button onClick={() => handleWishlist(gift)}
                  className={`flex-1 text-xs py-2 rounded-xl border font-medium transition cursor-pointer
                    ${wishlisted[gift.name]
                      ? "bg-pink-500 text-white border-pink-500"
                      : "border-pink-200 text-pink-500 hover:bg-pink-50"}`}>
                  {wishlisted[gift.name] ? "💖 Saved" : "🤍 Save"}
                </button>
                <a href={buyLink(gift.name)} target="_blank" rel="noreferrer"
                  className="flex-1 text-xs py-2 rounded-xl border border-orange-200 text-orange-500
                    hover:bg-orange-50 transition text-center font-medium">
                  🛒 Buy Now
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search again */}
      <div className="text-center">
        <button onClick={onReset}
          className="inline-flex items-center gap-2 px-8 py-3 border-2 border-rose-300
            text-rose-500 hover:bg-rose-500 hover:text-white font-semibold rounded-2xl
            transition-all cursor-pointer text-sm tracking-wide shadow-sm hover:shadow-rose-200">
          ← Search Again 🌹
        </button>
      </div>
    </div>
  );
}
