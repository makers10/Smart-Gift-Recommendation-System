import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Heart,
  Users,
  Calendar,
  Compass,
  Wallet,
  Sliders,
  RotateCcw,
  Gift,
  HelpCircle,
} from "lucide-react";
import confetti from "canvas-confetti";

// ── STEP 1: RELATIONSHIP OPTIONS ──────────────────────────────────────────
const RELATIONSHIPS = [
  { id: "partner", label: "Partner / Spouse", symbol: "💍", desc: "Romance & lifelong bond", backend: "partner" },
  { id: "best_friend", label: "Best Friend", symbol: "✨", desc: "Deep laughter & memories", backend: "best_friend" },
  { id: "mom", label: "Mom / Mother", symbol: "👩‍👧", desc: "Tender, unconditional warmth", backend: "mom" },
  { id: "dad", label: "Dad / Father", symbol: "👔", desc: "Steady strength & wisdom", backend: "dad" },
  { id: "sister", label: "Sister", symbol: "🌸", desc: "Forever friend & confidante", backend: "sister" },
  { id: "brother", label: "Brother", symbol: "⚡", desc: "Partner in adventures", backend: "brother" },
  { id: "colleague", label: "Colleague / Mentor", symbol: "💼", desc: "Refined professional gesture", backend: "colleague" },
  { id: "child", label: "Child / Young one", symbol: "🎈", desc: "Wonder, play, & curiosity", backend: "child_4_8" },
  { id: "parents", label: "Parents Together", symbol: "🏡", desc: "Honoring their shared journey", backend: "parents" },
  { id: "anyone", label: "Someone Special / General", symbol: "🎁", desc: "Thoughtful & versatile", backend: "anyone" },
];

// ── STEP 2: OCCASION OPTIONS ──────────────────────────────────────────────
const OCCASIONS = [
  { id: "birthday", label: "Birthday", symbol: "🎂", desc: "Celebrating another year of life" },
  { id: "anniversary", label: "Anniversary", symbol: "💑", desc: "Honoring milestone commitment" },
  { id: "wedding", label: "Wedding Celebration", symbol: "💐", desc: "Beginning of a lifelong journey" },
  { id: "graduation", label: "Graduation / Success", symbol: "🎓", desc: "Celebrating ambition & hard work" },
  { id: "valentines", label: "Valentine's Day", symbol: "❤️", desc: "Heartfelt romantic devotion" },
  { id: "mothers_day", label: "Mother's Day", symbol: "🌺", desc: "Celebrating maternal grace" },
  { id: "fathers_day", label: "Father's Day", symbol: "👞", desc: "Gratitude for guidance & love" },
  { id: "diwali", label: "Diwali / Festival of Lights", symbol: "🪔", desc: "Joy, prosperity, & blessings" },
  { id: "christmas", label: "Christmas / Holidays", symbol: "🎄", desc: "Warmth, cheer, & goodwill" },
  { id: "housewarming", label: "Housewarming", symbol: "🏠", desc: "Blessing a new home & space" },
  { id: "thank_you", label: "Thank You / Gratitude", symbol: "🙏", desc: "Saying thanks from the heart" },
  { id: "just_because", label: "Just Because / Surprise", symbol: "✨", desc: "No reason needed to show love" },
];

// ── STEP 3: INTERESTS (MULTI-SELECT) ──────────────────────────────────────
const INTERESTS = [
  { id: "tech", label: "Technology & Gadgets", symbol: "💻", tag: "Tech" },
  { id: "art", label: "Art, Craft & Creativity", symbol: "🎨", tag: "Artisan" },
  { id: "fashion", label: "Fashion & Accessories", symbol: "🧣", tag: "Style" },
  { id: "books", label: "Books & Intellectual", symbol: "📚", tag: "Mind" },
  { id: "food", label: "Gourmet, Tea & Culinary", symbol: "🍫", tag: "Epicurean" },
  { id: "wellness", label: "Beauty, Spa & Self-Care", symbol: "🌿", tag: "Wellness" },
  { id: "home", label: "Home, Plants & Lifestyle", symbol: "🪴", tag: "Living" },
  { id: "sentimental", label: "Keepsakes & Memories", symbol: "🗝️", tag: "Sentimental" },
  { id: "fitness", label: "Fitness, Outdoors & Travel", symbol: "🎒", tag: "Adventure" },
  { id: "music", label: "Music & Performing Arts", symbol: "🎵", tag: "Harmonics" },
  { id: "coffee_tea", label: "Artisan Coffee & Brews", symbol: "☕", tag: "Brew" },
  { id: "gaming", label: "Gaming & Pop Culture", symbol: "🎮", tag: "Gaming" },
];

// ── STEP 4: BUDGET TIERS ──────────────────────────────────────────────────
const BUDGETS = [
  { id: "under-500", label: "Under ₹500", desc: "Modest, sweet & thoughtful tokens", range: "₹200 - ₹499" },
  { id: "500-1000", label: "₹500 – ₹1,000", desc: "Polished gestures for any celebration", range: "₹500 - ₹1,000" },
  { id: "1000-2500", label: "₹1,000 – ₹2,500", desc: "Generous, artisanal & memorable", range: "₹1,000 - ₹2,500" },
  { id: "2500-5000", label: "₹2,500 – ₹5,000", desc: "Premium bespoke & luxury keepsakes", range: "₹2,500 - ₹5,000" },
  { id: "above-5000", label: "₹5,000 & Above", desc: "Heirloom craftsmanship & grand statements", range: "₹5,000+" },
];

// ── STEP 5: GIFT STYLE & AGE PREFERENCES ──────────────────────────────────
const GIFT_STYLES = [
  { id: "sentimental", label: "Deeply Sentimental", desc: "Tears of joy & cherished memories" },
  { id: "practical", label: "Useful & Practical", desc: "Elevating daily routines with elegance" },
  { id: "luxurious", label: "Luxurious & Indulgent", desc: "Pampering with artisanal refinement" },
  { id: "creative", label: "Creative & One-of-a-Kind", desc: "Handcrafted, quirky, or artistic" },
  { id: "experiential", label: "Experiential & Cozy", desc: "Flavors, moments, & relaxation" },
];

const AGE_GROUPS = [
  { id: "kids", label: "Kids (0-8 yrs)" },
  { id: "teens", label: "Teens (9-17 yrs)" },
  { id: "young_adult", label: "Young Adults (18-29 yrs)" },
  { id: "adult", label: "Adults (30-54 yrs)" },
  { id: "senior", label: "Elders & Seniors (55+ yrs)" },
];

export default function GiftDiscoveryWizard({
  onDiscover,
  initialRelationship = "partner",
  initialOccasion = "birthday",
}) {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    relationship: initialRelationship,
    occasion: initialOccasion,
    interests: ["sentimental", "art"],
    budget: "1000-2500",
    customBudget: "",
    giftStyle: "sentimental",
    ageGroup: "young_adult",
    gender: "any",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialRelationship) {
      setFormData((prev) => ({ ...prev, relationship: initialRelationship }));
    }
  }, [initialRelationship]);

  useEffect(() => {
    if (initialOccasion) {
      setFormData((prev) => ({ ...prev, occasion: initialOccasion }));
    }
  }, [initialOccasion]);

  const toggleInterest = (interestId) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interestId);
      const updated = exists
        ? prev.interests.filter((i) => i !== interestId)
        : [...prev.interests, interestId];
      return { ...prev, interests: updated.length ? updated : [interestId] };
    });
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleReset = () => {
    setStep(1);
    setFormData({
      relationship: "partner",
      occasion: "birthday",
      interests: ["sentimental", "art"],
      budget: "1000-2500",
      customBudget: "",
      giftStyle: "sentimental",
      ageGroup: "young_adult",
      gender: "any",
    });
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    setIsSubmitting(true);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#00F2FE", "#8B5CF6", "#FF007A", "#F59E0B"],
    });

    setTimeout(() => {
      setIsSubmitting(false);
      if (onDiscover) {
        onDiscover(formData);
      }
    }, 700);
  };

  return (
    <section id="gift-wizard-section" className="relative w-full py-20 lg:py-28 bg-luxury-main text-luxury-text overflow-hidden">
      {/* Ambient warm champagne & burgundy background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-champagne-glow via-luxury-burgundy/20 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(#d6b675_0.5px,transparent_0.5px)] opacity-[0.04] [background-size:28px_28px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Wizard Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-serif uppercase tracking-widest text-champagne-light bg-luxury-card border border-luxury-border shadow-champagne-sm mb-4">
            <Compass className="w-3.5 h-3.5 text-champagne animate-spin-slow" />
            <span>Curated Gifting Concierge</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-luxury-text mb-3">
            Gift Discovery Questionnaire
          </h2>
          <p className="text-sm sm:text-base text-luxury-muted font-sans font-light">
            Guide our recommendation intelligence through five dimensions of sentiment, bond, and taste.
          </p>
        </div>

        {/* Wizard Card Container */}
        <div className="relative rounded-3xl bg-luxury-card/90 border border-luxury-border shadow-luxury-card backdrop-blur-2xl p-6 sm:p-10 overflow-hidden">
          
          {/* Subtle Top Champagne Glowing Edge */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-champagne to-transparent" />

          {/* Step Progress Tracker */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-serif uppercase text-luxury-muted tracking-wider mb-2.5">
              <span className="flex items-center gap-2 text-champagne font-semibold">
                <span>Phase {step} of {totalSteps}</span>
                <span>•</span>
                <span className="text-champagne-light">
                  {step === 1 && "Recipient Dimension"}
                  {step === 2 && "Celebration Timeline"}
                  {step === 3 && "Passions & Interests"}
                  {step === 4 && "Budget Configuration"}
                  {step === 5 && "Tone & Nuance"}
                </span>
              </span>
              <button
                onClick={handleReset}
                className="hover:text-champagne-light transition-colors flex items-center gap-1 cursor-pointer text-luxury-muted"
                title="Restart Discovery"
              >
                <RotateCcw className="w-3 h-3 text-champagne" />
                <span>Reset</span>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-luxury-elevated overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-champagne via-champagne-light to-[#fcf5e5] rounded-full shadow-champagne-sm"
                initial={false}
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Form Step Content with AnimatePresence */}
          <AnimatePresence mode="wait">
            {/* ── STEP 1: RELATIONSHIP ── */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-luxury-text flex items-center gap-2.5">
                    <Users className="w-5 h-5 text-champagne" />
                    <span>Who is this gift destined for?</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-luxury-muted mt-1">
                    Select the bond that defines your relationship with the recipient.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  {RELATIONSHIPS.map((rel) => {
                    const isSelected = formData.relationship === rel.backend;
                    return (
                      <button
                        key={rel.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, relationship: rel.backend })}
                        className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group
                          ${
                            isSelected
                              ? "bg-luxury-burgundy/60 border-champagne shadow-champagne-sm ring-1 ring-champagne/40"
                              : "bg-luxury-elevated/70 border-luxury-border/80 hover:border-champagne/40 hover:bg-luxury-elevated"
                          }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">
                            {rel.symbol}
                          </span>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-champagne text-luxury-main flex items-center justify-center font-bold text-xs">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-serif font-semibold text-sm text-luxury-text">{rel.label}</p>
                          <p className="text-[11px] text-luxury-muted mt-0.5 line-clamp-1">{rel.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: OCCASION ── */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-luxury-text flex items-center gap-2.5">
                    <Calendar className="w-5 h-5 text-champagne" />
                    <span>What milestone are you celebrating?</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-luxury-muted mt-1">
                    Occasions anchor the emotional resonance of the recommendation.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  {OCCASIONS.map((occ) => {
                    const isSelected = formData.occasion === occ.id;
                    return (
                      <button
                        key={occ.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, occasion: occ.id })}
                        className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group
                          ${
                            isSelected
                              ? "bg-luxury-burgundy/60 border-champagne shadow-champagne-sm ring-1 ring-champagne/40"
                              : "bg-luxury-elevated/70 border-luxury-border/80 hover:border-champagne/40 hover:bg-luxury-elevated"
                          }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">
                            {occ.symbol}
                          </span>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-champagne text-luxury-main flex items-center justify-center font-bold text-xs">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-serif font-semibold text-sm text-luxury-text">{occ.label}</p>
                          <p className="text-[11px] text-luxury-muted mt-0.5 line-clamp-1">{occ.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: INTERESTS ── */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-luxury-text flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-champagne" />
                    <span>What sparks their curiosity and passions?</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-luxury-muted mt-1">
                    Select all that apply. Multiple interests yield rich hybrid suggestions.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {INTERESTS.map((item) => {
                    const isSelected = formData.interests.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleInterest(item.id)}
                        className={`text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between group
                          ${
                            isSelected
                              ? "bg-luxury-burgundy/60 border-champagne text-luxury-text shadow-champagne-sm"
                              : "bg-luxury-elevated/70 border-luxury-border/80 text-luxury-muted hover:border-champagne/40"
                          }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{item.symbol}</span>
                          <span className="text-xs font-semibold">{item.label}</span>
                        </div>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-champagne text-luxury-main flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── STEP 4: BUDGET ── */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-luxury-text flex items-center gap-2.5">
                    <Wallet className="w-5 h-5 text-champagne" />
                    <span>What budget feels comfortable for this gift?</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-luxury-muted mt-1">
                    All tiers prioritize quality craftsmanship and verified value in Indian Rupees (₹).
                  </p>
                </div>

                <div className="space-y-3">
                  {BUDGETS.map((b) => {
                    const isSelected = formData.budget === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, budget: b.id })}
                        className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between
                          ${
                            isSelected
                              ? "bg-luxury-burgundy/60 border-champagne shadow-champagne-sm ring-1 ring-champagne/40"
                              : "bg-luxury-elevated/70 border-luxury-border/80 hover:border-champagne/40"
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="font-serif font-bold text-base text-luxury-text">{b.label}</span>
                          <span className="text-xs text-luxury-muted font-sans hidden sm:inline">{b.desc}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-serif font-semibold text-champagne-light">{b.range}</span>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-champagne text-luxury-main flex items-center justify-center font-bold text-xs">
                              ✓
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── STEP 5: PREFERENCES & TONE ── */}
            {step === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-luxury-text flex items-center gap-2.5">
                    <Sliders className="w-5 h-5 text-champagne" />
                    <span>Fine-tune the gift's personality and tone</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-luxury-muted mt-1">
                    Choose the emotional posture and refinement of your gift.
                  </p>
                </div>

                {/* Gift Style Selection */}
                <div className="space-y-2.5">
                  <label className="text-xs font-serif uppercase text-champagne-light tracking-wider block">
                    Preferred Gift Style
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {GIFT_STYLES.map((style) => {
                      const isSelected = formData.giftStyle === style.id;
                      return (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, giftStyle: style.id })}
                          className={`text-left p-3.5 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between
                            ${
                              isSelected
                                ? "bg-luxury-burgundy/60 border-champagne text-luxury-text shadow-champagne-sm"
                                : "bg-luxury-elevated/70 border-luxury-border text-luxury-muted hover:border-champagne/40"
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-luxury-text">{style.label}</span>
                            {isSelected && <span className="text-champagne text-xs">✓</span>}
                          </div>
                          <span className="text-[11px] text-luxury-muted mt-1">{style.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Age Range & Gender Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-serif uppercase text-luxury-muted tracking-wider block">
                      Recipient Life Stage
                    </label>
                    <select
                      value={formData.ageGroup}
                      onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                      className="w-full bg-luxury-elevated border border-luxury-border rounded-xl px-3.5 py-2.5 text-xs text-luxury-text focus:border-champagne focus:outline-none"
                    >
                      {AGE_GROUPS.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-serif uppercase text-luxury-muted tracking-wider block">
                      Gender Context
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full bg-luxury-elevated border border-luxury-border rounded-xl px-3.5 py-2.5 text-xs text-luxury-text focus:border-champagne focus:outline-none"
                    >
                      <option value="any">Any / Not specified</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="non_binary">Non-binary</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation & Submission Footer Controls */}
          <div className="mt-10 pt-6 border-t border-luxury-border flex items-center justify-between gap-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-semibold text-luxury-text bg-luxury-elevated hover:bg-luxury-secondary border border-luxury-border transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-champagne" />
                <span>Previous</span>
              </button>
            ) : (
              <div className="text-xs text-luxury-muted font-sans flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-champagne" />
                <span>Phase 1 of 5</span>
              </div>
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider text-luxury-main bg-gradient-to-r from-champagne to-champagne-light hover:brightness-105 shadow-champagne-sm transition-all cursor-pointer active:scale-95"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider text-luxury-main bg-gradient-to-r from-champagne to-champagne-light hover:brightness-105 shadow-champagne-glow transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-luxury-main border-t-transparent rounded-full animate-spin" />
                    <span>Curating Recommendations...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-luxury-main text-luxury-main" />
                    <span>Reveal Curated Gifts</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
