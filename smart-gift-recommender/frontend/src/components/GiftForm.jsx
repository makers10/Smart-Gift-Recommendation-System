import { useState } from "react";
import { relationships, occasions, budgets } from "../data/options";
import { apiFetch } from "../utils/api";

const genders = [
  { value: "any",        label: "Any / Not specified" },
  { value: "male",       label: "Male 👨" },
  { value: "female",     label: "Female 👩" },
  { value: "non_binary", label: "Non-binary 🌈" },
];

export default function GiftForm({ onRecommend, prefill, onPrefillUsed }) {
  const [form, setForm] = useState(
    prefill
      ? { relationship: prefill.relationship||"", occasion: prefill.occasion||"", budget: prefill.budget||"", gender: prefill.gender||"any" }
      : { relationship: "", occasion: "", budget: "", gender: "any" }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  if (prefill && onPrefillUsed) onPrefillUsed();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.relationship || !form.occasion || !form.budget) {
      setError("Please fill in all fields, darling 💕");
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams(form).toString();
      const res  = await apiFetch(`/api/recommend?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "No results found.");
      onRecommend(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sel = `mt-1.5 w-full border-2 border-rose-100 rounded-2xl px-4 py-3 text-sm
    focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100
    bg-white/80 text-gray-700 transition-all appearance-none cursor-pointer shadow-sm`;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl shadow-rose-100 border border-rose-100 overflow-hidden">

        {/* Form header banner */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-6 text-white text-center">
          <div className="text-4xl mb-2">🎁</div>
          <h2 className="font-serif text-3xl font-bold">Find the Perfect Gift</h2>
          <p className="text-rose-100 text-sm mt-1 tracking-wide">Every gift tells a love story ✨</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Relationship */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-rose-500 tracking-widest uppercase mb-1">
                💝 Who are you gifting?
              </label>
              <select name="relationship" value={form.relationship} onChange={handleChange} className={sel}>
                <option value="">-- Choose your person --</option>
                {relationships.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-rose-500 tracking-widest uppercase mb-1">
                ⚧ Their gender
              </label>
              <select name="gender" value={form.gender} onChange={handleChange} className={sel}>
                {genders.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-xs font-bold text-rose-500 tracking-widest uppercase mb-1">
                💰 Your budget
              </label>
              <select name="budget" value={form.budget} onChange={handleChange} className={sel}>
                <option value="">-- Choose your budget --</option>
                {budgets.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>

            {/* Occasion */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-rose-500 tracking-widest uppercase mb-1">
                🌹 What's the occasion?
              </label>
              <select name="occasion" value={form.occasion} onChange={handleChange} className={sel}>
                <option value="">-- Choose the occasion --</option>
                {occasions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 text-rose-500 text-sm text-center">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-rose-500 to-pink-500
              hover:from-rose-600 hover:to-pink-600 disabled:opacity-50
              text-white font-bold py-4 rounded-2xl transition-all text-base tracking-wide
              shadow-xl shadow-rose-200 hover:shadow-rose-300 hover:scale-[1.02] cursor-pointer">
            {loading ? "Finding the perfect gift... 💭" : "✨ Discover Gifts 🎁"}
          </button>

          {/* Trust badges */}
          <div className="flex justify-center gap-6 mt-5 text-xs text-rose-400">
            <span>🔒 Private & Secure</span>
            <span>💝 282+ Gift Ideas</span>
            <span>🛒 Buy Links Included</span>
          </div>
        </form>
      </div>
    </div>
  );
}
