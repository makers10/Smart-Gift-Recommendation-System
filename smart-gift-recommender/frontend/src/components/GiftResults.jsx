const occasionEmojis = {
  birthday: "🎂", wedding: "💍", baby_shower: "👶", graduation: "🎓",
  anniversary: "💑", farewell: "👋", promotion: "🏆", valentines: "❤️",
  mothers_day: "🌸", fathers_day: "👔",
  diwali: "🪔", holi: "🎨", navratri: "🪷", raksha_bandhan: "🪢",
  baisakhi: "🌾", ganesh_chaturthi: "🐘", onam: "🌺", ugadi: "🌿",
  eid: "🌙", eid_adha: "🐑",
  christmas: "🎄", easter: "🐣",
  chinese_new_year: "🐉", mid_autumn: "🥮",
  hanukkah: "🕎", rosh_hashanah: "🍎",
  new_year: "🎆", thanksgiving: "🦃", halloween: "🎃",
  housewarming: "🏠", get_well_soon: "💊",
  congratulations: "🎉", thank_you: "🙏", any: "🎁",
};

const formatLabel = (str) =>
  str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function GiftResults({ result, onReset }) {
  if (!result) return null;
  const emoji = occasionEmojis[result.occasion] || "🎁";

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-violet-700 text-center">
        {emoji} Gift Recommendations
      </h2>

      <p className="text-center text-sm text-gray-500">
        For your <span className="font-medium text-gray-700">{formatLabel(result.relationship)}</span> on{" "}
        <span className="font-medium text-gray-700">{formatLabel(result.occasion)}</span> —{" "}
        Budget: <span className="font-medium text-gray-700">{formatLabel(result.budget)}</span>
      </p>

      <ul className="space-y-3">
        {result.recommendations.map((gift, i) => (
          <li
            key={i}
            className="flex items-center gap-3 bg-violet-50 border-l-4 border-violet-500 rounded-lg px-4 py-3 text-sm text-gray-700"
          >
            <span className="text-lg">🎁</span>
            <span>{gift}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onReset}
        className="w-full border-2 border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white font-semibold py-3 rounded-xl transition text-base cursor-pointer"
      >
        ← Search Again
      </button>
    </div>
  );
}
