const occasionEmojis = {
  birthday: "🎂", wedding: "💍", baby_shower: "👶", graduation: "🎓",
  anniversary: "💑", farewell: "👋", promotion: "🏆", valentines: "❤️",
  mothers_day: "🌸", fathers_day: "👔", diwali: "🪔", christmas: "🎄",
  eid: "🌙", new_year: "🎆", housewarming: "🏠", get_well_soon: "💊",
  congratulations: "🎉", thank_you: "🙏", any: "🎁",
};

export default function GiftResults({ result, onReset }) {
  if (!result) return null;

  const emoji = occasionEmojis[result.occasion] || "🎁";

  return (
    <div className="gift-results">
      <h2>{emoji} Gift Recommendations</h2>
      <p className="subtitle">
        For your <strong>{result.relationship.replace(/_/g, " ")}</strong> on their{" "}
        <strong>{result.occasion.replace(/_/g, " ")}</strong> — Budget:{" "}
        <strong>{result.budget}</strong>
      </p>

      <ul className="gift-list">
        {result.recommendations.map((gift, i) => (
          <li key={i} className="gift-item">
            <span className="gift-icon">🎁</span>
            <span>{gift}</span>
          </li>
        ))}
      </ul>

      <button className="reset-btn" onClick={onReset}>
        ← Search Again
      </button>
    </div>
  );
}
