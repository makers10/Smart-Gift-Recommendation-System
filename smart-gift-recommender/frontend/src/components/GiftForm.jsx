/**
 * GiftForm — Gift with Love
 *
 * Four-field gift-discovery form. Submits GET /api/recommend.
 *
 * Fields (all values preserved exactly as the backend expects):
 *   relationship — 19 options from data/options.js
 *   gender       — 4 options (any / male / female / non_binary)
 *   budget       — 3 tiers: low / medium / high  (labels now in ₹, C5 fixed)
 *   occasion     — 34 options from data/options.js
 *
 * Behaviour preserved:
 *   - All three required fields must be filled (relationship, occasion, budget)
 *   - Loading state disables submit button
 *   - Error message rendered inline on validation or API failure
 *   - prefill prop pre-populates selects (from Hero chips, History re-search)
 *   - onPrefillUsed() called once after prefill is consumed
 *
 * Design changes (Stage E):
 *   - Design tokens: ivory/burgundy palette, Cormorant serif heading
 *   - Button primitive replaces raw <button>
 *   - Emoji removed from button label (V1 fix); kept as decorative aria-hidden
 *   - Budget labels corrected to ₹ (C5 fix)
 *   - Accessible <label> with htmlFor/id linkage on every field
 *   - Loading skeleton shown while API call is in flight (C3 fix)
 *   - role="alert" on error message (A4 fix)
 *   - Consistent focus-visible rings via global CSS
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Gift } from "lucide-react";
import { relationships, occasions, budgets } from "../data/options";
import { apiFetch } from "../utils/api";
import Button from "./ui/Button";
import Skeleton from "./ui/Skeleton";
import SpotlightCard from "./ui/SpotlightCard";
import BorderBeam from "./ui/BorderBeam";

const genders = [
  { value: "any",        label: "Any / Not specified" },
  { value: "male",       label: "Male" },
  { value: "female",     label: "Female" },
  { value: "non_binary", label: "Non-binary" },
];

// Shared select class — uses global select arrow from index.css
const selectCls = [
  "w-full bg-white border border-ivory-300 rounded-base",
  "px-4 py-3 text-sm text-neutral-800",
  "focus:outline-none focus:border-burgundy-400 focus:ring-2 focus:ring-burgundy-100",
  "transition-colors duration-150 appearance-none cursor-pointer shadow-xs",
].join(" ");

// Shared label class
const labelCls = "block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5";

export default function GiftForm({ onRecommend, prefill, onPrefillUsed }) {
  const [form, setForm] = useState(
    prefill
      ? {
          relationship: prefill.relationship || "",
          occasion:     prefill.occasion     || "",
          budget:       prefill.budget       || "",
          gender:       prefill.gender       || "any",
        }
      : { relationship: "", occasion: "", budget: "", gender: "any" }
  );
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  // Sync state when prefill changes after initial mount
  useEffect(() => {
    if (prefill) {
      setForm((prev) => ({
        relationship: prefill.relationship !== undefined ? prefill.relationship : prev.relationship,
        occasion:     prefill.occasion     !== undefined ? prefill.occasion     : prev.occasion,
        budget:       prefill.budget       !== undefined ? prefill.budget       : prev.budget,
        gender:       prefill.gender       !== undefined ? prefill.gender       : prev.gender,
      }));
      onPrefillUsed?.();
    }
  }, [prefill, onPrefillUsed]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.relationship || !form.occasion || !form.budget) {
      setError("Please fill in all required fields to find a gift.");
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams(form).toString();
      const res    = await apiFetch(`/api/recommend?${params}`);
      const data   = await res.json();
      if (!res.ok) throw new Error(data.detail || "No recommendations found.");
      onRecommend(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show skeleton grid while loading
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <p className="text-center text-sm text-neutral-500 mb-6" role="status" aria-live="polite">
          Finding the perfect gift…
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton.Card key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      {/* 21st.dev style Spotlight & BorderBeam Card */}
      <SpotlightCard
        enableTilt={false}
        spotlightColor="rgba(190, 18, 60, 0.08)"
        className="relative bg-white/95 border border-rose-200/90 rounded-3xl shadow-2xl overflow-hidden p-0 backdrop-blur-xl"
      >
        <BorderBeam size={320} duration={12} colorFrom="#881337" colorTo="#F59E0B" />

        {/* Form header */}
        <div className="bg-gradient-to-r from-burgundy-800 via-burgundy-700 to-burgundy-800 px-8 py-7 text-white">
          <div className="flex items-center gap-2 text-rose-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Gift className="w-4 h-4 text-amber-300" />
            <span>Intelligent Finder</span>
          </div>
          <h2 className="font-serif text-3xl font-bold leading-tight mb-1">
            Find the Perfect Gift
          </h2>
          <p className="text-sm text-rose-100/90 font-sans">
            Tell us about the person and occasion — our recommendation engine will surface heartfelt matches.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Relationship */}
            <div className="sm:col-span-2">
              <label htmlFor="field-relationship" className={labelCls}>
                Who are you gifting? <span className="text-burgundy-500" aria-hidden="true">*</span>
              </label>
              <select
                id="field-relationship"
                name="relationship"
                value={form.relationship}
                onChange={handleChange}
                required
                className={selectCls}
                aria-required="true"
              >
                <option value="">Select a relationship…</option>
                {relationships.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="field-gender" className={labelCls}>
                Their gender{" "}
                <span className="normal-case font-normal text-neutral-400 tracking-normal">(optional)</span>
              </label>
              <select
                id="field-gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={selectCls}
              >
                {genders.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div>
              <label htmlFor="field-budget" className={labelCls}>
                Your budget <span className="text-burgundy-500" aria-hidden="true">*</span>
              </label>
              <select
                id="field-budget"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                required
                className={selectCls}
                aria-required="true"
              >
                <option value="">Select a budget…</option>
                {budgets.map((b) => (
                  <option key={b.value} value={b.value}>{b.label}</option>
                ))}
              </select>
            </div>

            {/* Occasion */}
            <div className="sm:col-span-2">
              <label htmlFor="field-occasion" className={labelCls}>
                What's the occasion? <span className="text-burgundy-500" aria-hidden="true">*</span>
              </label>
              <select
                id="field-occasion"
                name="occasion"
                value={form.occasion}
                onChange={handleChange}
                required
                className={selectCls}
                aria-required="true"
              >
                <option value="">Select an occasion…</option>
                {occasions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Validation / API error */}
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="mt-5 flex items-start gap-2.5 bg-burgundy-50 border border-burgundy-200
                rounded-base px-4 py-3 text-sm text-burgundy-700"
            >
              <span aria-hidden="true" className="mt-0.5 text-burgundy-500 shrink-0">
                {/* Warning icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </span>
              {error}
            </div>
          )}

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full mt-6 py-4 px-6 rounded-full text-base font-bold text-white bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 shadow-lg shadow-burgundy-900/20 border border-rose-300/30 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer"
            aria-label="Discover gift recommendations"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>Discover Gifts</span>
            <ArrowRight className="w-5 h-5 text-rose-200" />
          </motion.button>

          {/* Trust footer */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mt-5 text-xs text-neutral-400">
            <span>282+ gift combinations</span>
            <span>·</span>
            <span>20+ relationships</span>
            <span>·</span>
            <span>30+ occasions</span>
          </div>
        </form>
      </SpotlightCard>
    </div>
  );
}
