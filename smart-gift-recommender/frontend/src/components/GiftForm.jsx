import { useState } from "react";
import { relationships, occasions, budgets } from "../data/options";

const genders = [
  { value: "any", label: "Any / Not specified" },
  { value: "male", label: "Male 👨" },
  { value: "female", label: "Female 👩" },
  { value: "non_binary", label: "Non-binary 🌈" },
];

export default function GiftForm({ onRecommend }) {
  const [form, setForm] = useState({ relationship: "", occasion: "", budget: "", gender: "any" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const res = await fetch(`http://localhost:3001/api/recommend?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "No results found.");
      onRecommend(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sel = `mt-1 w-full border border-rose-200 rounded-xl px-4 py-2.5 text-sm
    focus:outline-none focus:ring-2 focus:ring-rose-300 bg-rose-50/50
    text-gray-700 transition placeholder-rose-300`;

  const fields = [
    { label: "💝 Who are you gifting?", name: "relationship", options: relationships, placeholder: "-- Choose your person --" },
    { label: "⚧ Their gender", name: "gender", options: genders, placeholder: null },
    { label: "🌹 What's the occasion?", name: "occasion", options: occasions, placeholder: "-- Choose the occasion --" },
    { label: "💰 Your budget", name: "budget", options: budgets, placeholder: "-- Choose your budget --" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl font-bold text-rose-700">Find the Perfect Gift</h2>
        <p className="text-rose-400 text-xs mt-1 tracking-wide">Every gift tells a love story ✨</p>
      </div>

      {fields.map((f) => (
        <div key={f.name}>
          <label className="block text-xs font-semibold text-rose-500 tracking-wide uppercase mb-1">{f.label}</label>
          <select name={f.name} value={form[f.name]} onChange={handleChange} className={sel}>
            {f.placeholder && <option value="">{f.placeholder}</option>}
            {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      ))}

      {error && (
        <p className="text-rose-500 text-xs text-center bg-rose-50 rounded-xl py-2 px-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600
          disabled:opacity-50 text-white font-semibold py-3 rounded-2xl transition-all
          shadow-lg shadow-rose-200 hover:shadow-rose-300 text-sm tracking-wide cursor-pointer"
      >
        {loading ? "Finding the perfect gift... 💭" : "Discover Gifts 🎁"}
      </button>
    </form>
  );
}
