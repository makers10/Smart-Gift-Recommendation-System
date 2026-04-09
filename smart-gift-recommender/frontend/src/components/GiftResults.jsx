import { useState } from "react";

const occasionEmojis = {
  birthday: "🎂", wedding: "💍", baby_shower: "👶", graduation: "🎓",
  anniversary: "💑", farewell: "👋", promotion: "🏆", valentines: "❤️",
  mothers_day: "🌸", fathers_day: "👔",
  diwali: "🪔", holi: "🎨", navratri: "🪷", raksha_bandhan: "🪢",
  baisakhi: "🌾", ganesh_chaturthi: "🐘", onam: "🌺", ugadi: "🌿",
  eid: "🌙", eid_adha: "🐑", christmas: "🎄", easter: "🐣",
  chinese_new_year: "🐉", mid_autumn: "🥮", hanukkah: "🕎", rosh_hashanah: "🍎",
  new_year: "🎆", thanksgiving: "🦃", halloween: "🎃",
  housewarming: "🏠", get_well_soon: "💊", congratulations: "🎉", thank_you: "🙏", any: "🎁",
};

const fmt = (s) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const buyLink = (gift) =>
  `https://www.amazon.in/s?k=${encodeURIComponent(gift)}`;

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
      await fetch("http://localhost:8001/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gift_name: giftName,
          relationship: result.relationship,
          occasion: result.occasion,
          vote,
        }),
      });
      setScores((prev) => ({ ...prev, [giftName]: (prev[giftName] || 0) + vote }));
      setVoted((prev) => ({ ...prev, [giftName]: vote }));
      setFeedback((prev) => ({ ...prev, [giftName]: vote === 1 ? "Thanks for the 👍!" : "Got it, we'll improve 👎" }));
    } catch {}
  };

  const handleWishlist = async (gift) => {
    if (wishlisted[gift.name]) return;
    try {
      await fetch("http://localhost:8001/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gift_name: gift.name,
          relationship: result.relationship,
          occasion: result.occasion,
          budget: result.budget,
        }),
      });
      setWishlisted((prev) => ({ ...prev, [gift.name]: true }));
    } catch {}
  };

  const emoji = occasionEmojis[result.occasion] || "🎁";
  const sorted = [...result.recommendations].sort((a, b) => (scores[b.name] || 0) - (scores[a.name] || 0));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-violet-700 text-center">{emoji} Gift Recommendations</h2>
      <p className="text-center text-xs text-gray-500">
        For <span className="font-medium text-gray-700">{fmt(result.relationship)}</span>
        {result.gender !== "any" && <> ({fmt(result.gender)})</>}
        {" · "}<span className="font-medium text-gray-700">{fmt(result.occasion)}</span>
        {" · "}<span className="font-medium text-gray-700">{fmt(result.budget)} budget</span>
      </p>

      <ul className="space-y-3">
        {sorted.map((gift) => (
          <li key={gift.name} className="bg-violet-50 border-l-4 border-violet-500 rounded-xl px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-lg">🎁</span>
                <span className="text-sm font-medium text-gray-800 truncate">{gift.name}</span>
              </div>

              {/* Score badge */}
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0
                ${(scores[gift.name] || 0) > 0 ? "bg-green-100 text-green-700" :
                  (scores[gift.name] || 0) < 0 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}>
                {(scores[gift.name] || 0) > 0 ? "+" : ""}{scores[gift.name] || 0}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {/* Vote buttons */}
              <button
                onClick={() => handleVote(gift.name, 1)}
                disabled={!!voted[gift.name]}
                className={`text-xs px-2 py-1 rounded-lg border transition cursor-pointer
                  ${voted[gift.name] === 1 ? "bg-green-500 text-white border-green-500" : "border-gray-300 hover:bg-green-50 text-gray-600"}`}
              >👍</button>
              <button
                onClick={() => handleVote(gift.name, -1)}
                disabled={!!voted[gift.name]}
                className={`text-xs px-2 py-1 rounded-lg border transition cursor-pointer
                  ${voted[gift.name] === -1 ? "bg-red-400 text-white border-red-400" : "border-gray-300 hover:bg-red-50 text-gray-600"}`}
              >👎</button>

              {/* Wishlist */}
              <button
                onClick={() => handleWishlist(gift)}
                className={`text-xs px-2 py-1 rounded-lg border transition cursor-pointer
                  ${wishlisted[gift.name] ? "bg-pink-500 text-white border-pink-500" : "border-gray-300 hover:bg-pink-50 text-gray-600"}`}
              >{wishlisted[gift.name] ? "❤️ Saved" : "🤍 Save"}</button>

              {/* Buy Now */}
              <a
                href={buyLink(gift.name)}
                target="_blank"
                rel="noreferrer"
                className="text-xs px-2 py-1 rounded-lg border border-orange-300 text-orange-600 hover:bg-orange-50 transition ml-auto"
              >🛒 Buy</a>
            </div>

            {feedback[gift.name] && (
              <p className="text-xs text-violet-500 mt-1">{feedback[gift.name]}</p>
            )}
          </li>
        ))}
      </ul>

      <button
        onClick={onReset}
        className="w-full border-2 border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white font-semibold py-3 rounded-xl transition cursor-pointer"
      >← Search Again</button>
    </div>
  );
}
