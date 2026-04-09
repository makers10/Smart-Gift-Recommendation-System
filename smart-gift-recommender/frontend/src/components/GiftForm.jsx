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
      const res = await fetch(`http://localhost:8001/api/recommend?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "No results found.");
      onRecommend(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectClass =
    "mt-1 w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 bg-gray-50 transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-semibold text-violet-700 text-center mb-2">Find the Perfect Gift</h2>

      <div>
        <label className="block text-sm font-medium text-gray-600">Who are you gifting?</label>
        <select name="relationship" value={form.relationship} onChange={handleChange} className={selectClass}>
          <option value="">-- Select Relationship --</option>
          {relationships.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">What's the occasion?</label>
        <select name="occasion" value={form.occasion} onChange={handleChange} className={selectClass}>
          <option value="">-- Select Occasion --</option>
          {occasions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">What's your budget?</label>
        <select name="budget" value={form.budget} onChange={handleChange} className={selectClass}>
          <option value="">-- Select Budget --</option>
          {budgets.map((b) => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white font-semibold py-3 rounded-xl transition text-base cursor-pointer"
      >
        {loading ? "Finding gifts..." : "Get Recommendations 🎁"}
      </button>
    </form>
  );
}
