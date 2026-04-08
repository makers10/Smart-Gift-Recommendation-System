import { useState } from "react";
import { relationships, occasions, budgets } from "../data/options";

export default function GiftForm({ onRecommend }) {
  const [form, setForm] = useState({ relationship: "", occasion: "", budget: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.relationship || !form.occasion || !form.budget) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams(form).toString();
      const res = await fetch(`http://localhost:5000/api/recommend?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No results found.");
      onRecommend(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="gift-form">
      <h2>Find the Perfect Gift</h2>

      <label>Who are you gifting?
        <select name="relationship" value={form.relationship} onChange={handleChange}>
          <option value="">-- Select Relationship --</option>
          {relationships.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </label>

      <label>What's the occasion?
        <select name="occasion" value={form.occasion} onChange={handleChange}>
          <option value="">-- Select Occasion --</option>
          {occasions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>

      <label>What's your budget?
        <select name="budget" value={form.budget} onChange={handleChange}>
          <option value="">-- Select Budget --</option>
          {budgets.map((b) => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Finding gifts..." : "Get Recommendations 🎁"}
      </button>
    </form>
  );
}
