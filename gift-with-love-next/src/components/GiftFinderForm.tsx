"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, ArrowRight, CheckCircle2, SlidersHorizontal, Gift } from "lucide-react";
import BorderBeam from "./ui/BorderBeam";
import SpotlightCard from "./ui/SpotlightCard";

interface GiftFinderFormProps {
  onDiscover?: (formData: GiftSearchParams) => void;
  initialRelationship?: string;
  initialOccasion?: string;
}

export interface GiftSearchParams {
  relationship: string;
  gender: string;
  budget: string;
  occasion: string;
}

const RELATIONSHIP_OPTIONS = [
  { value: "mom", label: "Mom" },
  { value: "partner", label: "Partner / Spouse" },
  { value: "best_friend", label: "Best Friend" },
  { value: "sister", label: "Sister" },
  { value: "dad", label: "Dad" },
  { value: "brother", label: "Brother" },
  { value: "colleague", label: "Office Colleague" },
  { value: "parents", label: "Parents" },
  { value: "grandma", label: "Grandma" },
  { value: "grandpa", label: "Grandpa" },
  { value: "boss", label: "Boss / Manager" },
  { value: "teenager", label: "Teenager" },
  { value: "anyone", label: "Anyone / General" },
];

const GENDER_OPTIONS = [
  { value: "any", label: "Any / Not specified" },
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "non_binary", label: "Non-binary" },
];

const BUDGET_OPTIONS = [
  { value: "under-500", label: "Under ₹500 (Modest & sweet)" },
  { value: "500-1000", label: "₹500 – ₹1,000 (Thoughtful)" },
  { value: "1000-2500", label: "₹1,000 – ₹2,500 (Generous)" },
  { value: "2500-5000", label: "₹2,500 – ₹5,000 (Artisanal / Premium)" },
  { value: "above-5000", label: "₹5,000+ (Luxury Keepsake)" },
];

const OCCASION_OPTIONS = [
  { value: "birthday", label: "Birthday 🎂" },
  { value: "wedding", label: "Wedding 💍" },
  { value: "anniversary", label: "Anniversary 💐" },
  { value: "graduation", label: "Graduation 🎓" },
  { value: "mothers_day", label: "Mother's Day 🌸" },
  { value: "fathers_day", label: "Father's Day 👔" },
  { value: "valentines", label: "Valentine's Day ❤️" },
  { value: "diwali", label: "Diwali 🪔" },
  { value: "christmas", label: "Christmas 🎄" },
  { value: "eid", label: "Eid 🌙" },
  { value: "housewarming", label: "Housewarming 🏠" },
  { value: "promotion", label: "Promotion 🏆" },
  { value: "thank_you", label: "Thank You 🙏" },
];

export const GiftFinderForm: React.FC<GiftFinderFormProps> = ({
  onDiscover,
  initialRelationship = "mom",
  initialOccasion = "birthday",
}) => {
  const [relationship, setRelationship] = useState(initialRelationship);
  const [gender, setGender] = useState("any");
  const [budget, setBudget] = useState("1000-2500");
  const [occasion, setOccasion] = useState(initialOccasion);
  const [isLoading, setIsLoading] = useState(false);
  const [mockResults, setMockResults] = useState<any[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = { relationship, gender, budget, occasion };

    if (onDiscover) {
      onDiscover(payload);
    }

    // Interactive demonstration delay for luxury tactile feel
    setTimeout(() => {
      setIsLoading(false);
      setMockResults([
        {
          title: "Personalized Constellation Map Frame",
          category: "Artisanal Keepsake",
          price: "₹1,850",
          matchScore: "98% Match",
          desc: "Custom brass engraving capturing the exact night sky alignment of your special date and location.",
        },
        {
          title: "Single-Origin Dark Chocolate & Botanical Tea Box",
          category: "Gourmet Experience",
          price: "₹1,400",
          matchScore: "94% Match",
          desc: "Handcrafted bean-to-bar truffles paired with organic whole-leaf Himalayan infusion.",
        },
        {
          title: "Hand-thrown Ceramic Aromatherapy Diffuser",
          category: "Living & Wellness",
          price: "₹2,200",
          matchScore: "91% Match",
          desc: "Minimalist stoneware glazed with warm ivory tones and infused with botanical essential oils.",
        },
      ]);
    }, 1200);
  };

  return (
    <section id="gift-discovery-form" className="relative w-full py-20 lg:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-burgundy-700 bg-rose-100/70 border border-rose-200 mb-3.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-burgundy-700" />
            <span>Intelligent Finder</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy-950 tracking-tight">
            Find the Perfect Gift
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-stone-600 font-sans">
            Customize your search parameters and let our recommendation engine surface heartfelt surprises.
          </p>
        </div>

        {/* Multi-step Finder Card */}
        <div className="relative">
          <SpotlightCard
            enableTilt={false}
            spotlightColor="rgba(190, 18, 60, 0.08)"
            className="relative bg-white/95 rounded-3xl p-8 sm:p-12 border border-rose-200/90 shadow-2xl backdrop-blur-xl"
          >
            <BorderBeam size={320} duration={12} colorFrom="#881337" colorTo="#F59E0B" />

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* 1. Who are you gifting */}
                <div className="space-y-2">
                  <label htmlFor="select-relationship" className="block text-xs font-bold uppercase tracking-wider text-burgundy-900">
                    Who are you gifting? <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="select-relationship"
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      className="select select-bordered w-full bg-canvas-light text-stone-800 font-medium border-rose-200 rounded-xl focus:border-burgundy-600 focus:ring-2 focus:ring-burgundy-200 text-sm py-2.5 h-auto"
                      required
                    >
                      {RELATIONSHIP_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Their Gender */}
                <div className="space-y-2">
                  <label htmlFor="select-gender" className="block text-xs font-bold uppercase tracking-wider text-burgundy-900">
                    Their Gender
                  </label>
                  <div className="relative">
                    <select
                      id="select-gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="select select-bordered w-full bg-canvas-light text-stone-800 font-medium border-rose-200 rounded-xl focus:border-burgundy-600 focus:ring-2 focus:ring-burgundy-200 text-sm py-2.5 h-auto"
                    >
                      {GENDER_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Your Budget */}
                <div className="space-y-2">
                  <label htmlFor="select-budget" className="block text-xs font-bold uppercase tracking-wider text-burgundy-900">
                    Your Budget <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="select-budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="select select-bordered w-full bg-canvas-light text-stone-800 font-medium border-rose-200 rounded-xl focus:border-burgundy-600 focus:ring-2 focus:ring-burgundy-200 text-sm py-2.5 h-auto"
                      required
                    >
                      {BUDGET_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 4. What's the Occasion */}
                <div className="space-y-2">
                  <label htmlFor="select-occasion" className="block text-xs font-bold uppercase tracking-wider text-burgundy-900">
                    What's the Occasion? <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="select-occasion"
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="select select-bordered w-full bg-canvas-light text-stone-800 font-medium border-rose-200 rounded-xl focus:border-burgundy-600 focus:ring-2 focus:ring-burgundy-200 text-sm py-2.5 h-auto"
                      required
                    >
                      {OCCASION_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit CTA with dynamic pulse and loading state transition */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-rose-100">
                <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Curated across 282+ artisanal verified combinations</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isLoading}
                  type="submit"
                  className="w-full sm:w-auto relative inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full text-base font-bold text-white bg-gradient-to-r from-burgundy-900 via-rose-800 to-burgundy-900 hover:from-burgundy-800 hover:to-burgundy-950 shadow-lg shadow-burgundy-900/25 border border-rose-300/30 transition-all duration-300 disabled:opacity-70 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-rose-200" />
                      <span>Curating Heartfelt Gifts...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                      <span>Discover Gifts</span>
                      <ArrowRight className="w-5 h-5 text-rose-200" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            {/* Instant Recommendations Reveal */}
            <AnimatePresence>
              {mockResults && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-12 pt-8 border-t border-rose-200"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif text-2xl font-bold text-burgundy-950 flex items-center gap-2">
                      <Gift className="w-6 h-6 text-burgundy-800" />
                      <span>Curated Recommendations for You</span>
                    </h3>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      3 Results Found
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {mockResults.map((item, idx) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        className="bg-canvas-light rounded-2xl p-5 border border-rose-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[11px] font-bold text-burgundy-700 uppercase tracking-wider">
                              {item.category}
                            </span>
                            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              {item.matchScore}
                            </span>
                          </div>
                          <h4 className="font-serif text-lg font-bold text-stone-900 leading-snug">
                            {item.title}
                          </h4>
                          <p className="mt-2 text-xs text-stone-600 leading-relaxed font-sans">
                            {item.desc}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between">
                          <span className="text-sm font-bold text-burgundy-900">
                            {item.price}
                          </span>
                          <button className="text-xs font-bold text-burgundy-800 hover:text-burgundy-950 underline underline-offset-4">
                            View Details
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
};

export default GiftFinderForm;
