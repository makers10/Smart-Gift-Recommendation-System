import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Gift,
  Scissors,
  ArrowDown,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  HeartHandshake,
  FileText,
  MessageSquareQuote,
  Check,
} from "lucide-react";
import SpotlightCard from "./ui/SpotlightCard";
import BorderBeam from "./ui/BorderBeam";

const FEATURED_OCCASIONS = [
  { value: "birthday",        label: "Birthday",        symbol: "🎂" },
  { value: "wedding",         label: "Wedding",         symbol: "💍" },
  { value: "anniversary",     label: "Anniversary",     symbol: "💐" },
  { value: "graduation",      label: "Graduation",      symbol: "🎓" },
  { value: "mothers_day",     label: "Mother's Day",    symbol: "🌸" },
  { value: "fathers_day",     label: "Father's Day",    symbol: "👔" },
  { value: "valentines",      label: "Valentine's Day", symbol: "❤️" },
  { value: "diwali",          label: "Diwali",          symbol: "🪔" },
  { value: "christmas",       label: "Christmas",       symbol: "🎄" },
  { value: "eid",             label: "Eid",             symbol: "🌙" },
  { value: "holi",            label: "Holi",            symbol: "🎨" },
  { value: "raksha_bandhan",  label: "Raksha Bandhan",  symbol: "🪢" },
  { value: "new_year",        label: "New Year",        symbol: "🎆" },
  { value: "housewarming",    label: "Housewarming",    symbol: "🏠" },
  { value: "farewell",        label: "Farewell",        symbol: "👋" },
  { value: "promotion",       label: "Promotion",       symbol: "🏆" },
  { value: "baby_shower",     label: "Baby Shower",     symbol: "👶" },
  { value: "thank_you",       label: "Thank You",       symbol: "🙏" },
];

const FEATURED_RELATIONSHIPS = [
  {
    value: "mom",
    label: "Mom",
    description: "Celebrate the woman whose love knows no bounds.",
    badge: "Most Cherished",
    avatar: "👩‍👧",
  },
  {
    value: "partner",
    label: "Partner",
    description: "For the soul who makes every ordinary day feel magical.",
    badge: "Romantic",
    avatar: "💍",
  },
  {
    value: "best_friend",
    label: "Best Friend",
    description: "They deserve something as extraordinary and bold as they are.",
    badge: "Soul Connection",
    avatar: "✨",
  },
  {
    value: "sister",
    label: "Sister",
    description: "Your forever confidante, first friend, and partner in crime.",
    badge: "Lifelong Bond",
    avatar: "🌸",
  },
  {
    value: "dad",
    label: "Dad",
    description: "The anchor who quietly moves mountains with steadfast strength.",
    badge: "Heritage & Honor",
    avatar: "👔",
  },
  {
    value: "colleague",
    label: "Colleague",
    description: "A polished, thoughtful gesture for a valued workmate.",
    badge: "Professional",
    avatar: "💼",
  },
];

const BESPOKE_STEPS = [
  {
    step: "01",
    icon: <FileText className="w-5 h-5 text-burgundy-600" />,
    title: "Post a request",
    desc: "Describe your vision, sentimental details, and budget parameters.",
  },
  {
    step: "02",
    icon: <MessageSquareQuote className="w-5 h-5 text-amber-600" />,
    title: "Receive offers",
    desc: "Skilled independent artisans respond with tailored design proposals.",
  },
  {
    step: "03",
    icon: <Gift className="w-5 h-5 text-emerald-600" />,
    title: "Get it made",
    desc: "Collaborate directly, confirm details, and receive an heirloom piece.",
  },
];

export default function Hero({ onQuickSearch }) {
  const [activeOccasion, setActiveOccasion] = useState(null);

  const handleOccasion = (val) => {
    setActiveOccasion(val);
    if (onQuickSearch) onQuickSearch({ occasion: val });
  };

  const handleRelationship = (val) => {
    if (onQuickSearch) onQuickSearch({ relationship: val });
  };

  const scrollToForm = () => {
    document.getElementById("gift-discovery-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCustomNav = () => {
    if (onQuickSearch) onQuickSearch({ __navigate: "custom" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="w-full relative z-10">
      {/* ── 1. HERO SECTION ─────────────────────────────────────────────── */}
      <section aria-labelledby="hero-heading" className="relative w-full overflow-hidden pt-12 pb-18 lg:pt-18 lg:pb-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Left Column: Editorial Headline & Actions */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 max-w-2xl"
            >
              {/* Shimmer Badge */}
              <motion.div variants={itemVariants} className="inline-block mb-6">
                <div className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-burgundy-800 bg-gradient-to-r from-rose-100/90 via-amber-100/60 to-rose-100/90 border border-burgundy-300/40 shadow-xs overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite_linear] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
                  <span>Thoughtfully Curated Gifts</span>
                </div>
              </motion.div>

              {/* Serif Headline */}
              <motion.h1
                id="hero-heading"
                variants={itemVariants}
                className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-burgundy-900 leading-[1.08] mb-6"
              >
                The right gift, <br />
                <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-burgundy-600 via-rose-600 to-amber-700">
                  for every heart.
                </span>
              </motion.h1>

              {/* Supporting copy */}
              <motion.p variants={itemVariants} className="text-lg sm:text-xl text-neutral-600 leading-relaxed mb-8 max-w-lg">
                Tell us who you are gifting and the occasion — we surface the most thoughtful,
                curated treasures tailored across every relationship, budget, and memory.
              </motion.p>

              {/* Dual Action Buttons with Spring Physics */}
              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  onClick={scrollToForm}
                  className="group relative inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full text-base font-semibold text-white bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-800 shadow-lg shadow-burgundy-900/20 border border-rose-300/30 transition-all duration-300 cursor-pointer"
                >
                  <Gift className="w-5 h-5 text-rose-200 transition-transform group-hover:rotate-12" />
                  <span>Find a Gift</span>
                  <ArrowDown className="w-4 h-4 text-rose-200 transition-transform group-hover:translate-y-1" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  onClick={handleCustomNav}
                  className="group inline-flex items-center justify-center gap-3 px-6 py-4 rounded-full text-base font-semibold text-burgundy-800 bg-white/90 hover:bg-white border border-rose-200 shadow-sm hover:border-burgundy-300 hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <Scissors className="w-5 h-5 text-burgundy-600 transition-transform group-hover:scale-110" />
                  <span>Custom Made</span>
                </motion.button>
              </motion.div>

              {/* Live Platform Stats */}
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-rose-200/60">
                {[
                  { value: "282+", label: "Gift combinations", sub: "Handpicked" },
                  { value: "20+",  label: "Relationships",      sub: "Personalized" },
                  { value: "30+",  label: "Occasions",          sub: "Covered" },
                ].map((s) => (
                  <div key={s.label} className="group">
                    <p className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-800 tracking-tight group-hover:text-rose-600 transition-colors">
                      {s.value}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-neutral-700 mt-1">{s.label}</p>
                    <p className="text-[11px] text-neutral-400 font-medium">{s.sub}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column: 3D Tilt Spotlight Preview Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
              className="lg:col-span-5 w-full"
            >
              <div className="relative group">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-rose-300/40 via-amber-200/30 to-burgundy-300/30 blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                
                <SpotlightCard
                  enableTilt={true}
                  spotlightColor="rgba(190, 18, 60, 0.12)"
                  className="relative bg-white/95 border border-rose-200 shadow-2xl rounded-3xl p-7 sm:p-8"
                >
                  <BorderBeam size={280} duration={14} colorFrom="#BE123C" colorTo="#F59E0B" />

                  <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-rose-100">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-burgundy-800 border border-rose-200">
                      <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
                      <span>Trending Spotlight</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Top Pick
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-burgundy-600">
                          Birthday • Partner or Sister
                        </span>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-1 leading-snug">
                          Artisan Leather Keepsake Journal
                        </h2>
                      </div>
                      <span className="shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-burgundy-600 to-burgundy-800 text-white shadow-md">
                        +12 Score
                      </span>
                    </div>

                    <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                      Hand-stitched full-grain Italian leather binding with archival-quality
                      deckle edge paper. A timeless, sentimental vessel crafted for thoughts, sketches,
                      and cherished lifetime memories.
                    </p>

                    <div className="flex items-center justify-between text-xs py-3 px-3.5 rounded-xl bg-ivory-100 border border-rose-100 font-medium">
                      <span className="text-neutral-600">
                        Budget: <strong className="text-burgundy-800 font-bold">₹2,000 – ₹5,000</strong>
                      </span>
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Highly Rated
                      </span>
                    </div>

                    <div className="pt-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleOccasion("birthday")}
                        className="group/btn w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-burgundy-600 to-burgundy-800 hover:from-burgundy-500 hover:to-burgundy-700 shadow-md shadow-burgundy-900/20 transition-all duration-200 cursor-pointer"
                      >
                        <span>Discover Birthday Gifts</span>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-rose-100">
                    <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2.5">
                      Popular Searches This Week
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "Anniversary", symbol: "💐", value: "anniversary" },
                        { label: "Mother's Day", symbol: "🌸", value: "mothers_day" },
                        { label: "Housewarming", symbol: "🏠", value: "housewarming" },
                      ].map((item) => (
                        <button
                          key={item.value}
                          onClick={() => handleOccasion(item.value)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white text-neutral-700 border border-rose-200 hover:bg-rose-50 hover:border-burgundy-300 hover:text-burgundy-800 transition-all duration-150 cursor-pointer active:scale-95 shadow-2xs"
                        >
                          <span aria-hidden="true">{item.symbol}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 2. OCCASION CLOUD ───────────────────────────────────────── */}
      <section aria-labelledby="occasions-heading" className="w-full bg-white/80 border-y border-rose-200/60 py-16 sm:py-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-burgundy-700 bg-rose-50 border border-rose-200 mb-3.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Curated Celebrations</span>
            </div>
            <h2 id="occasions-heading" className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy-900 tracking-tight">
              What are you celebrating?
            </h2>
            <p className="mt-3.5 text-base sm:text-lg text-neutral-600">
              Select an occasion to instantly pre-fill your gift discovery parameters.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-3.5 max-w-5xl mx-auto">
            {FEATURED_OCCASIONS.map((occ, idx) => {
              const isSelected = activeOccasion === occ.value;
              return (
                <motion.button
                  key={occ.value}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.02, type: "spring", stiffness: 300, damping: 20 }}
                  whileHover={{ scale: 1.07, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOccasion(occ.value)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer shadow-xs select-none
                    ${
                      isSelected
                        ? "bg-gradient-to-r from-burgundy-700 to-burgundy-600 text-white shadow-md shadow-burgundy-900/20 ring-2 ring-burgundy-400"
                        : "bg-ivory-100 text-neutral-700 border border-rose-200 hover:bg-rose-50 hover:text-burgundy-800 hover:border-burgundy-300"
                    }`}
                >
                  <span className="text-base" role="img" aria-label={occ.label}>{occ.symbol}</span>
                  <span>{occ.label}</span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. RELATIONSHIP DISCOVERY GRID ───────────────────────────── */}
      <section aria-labelledby="relationships-heading" className="w-full py-20 lg:py-28 bg-ivory-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-burgundy-700 bg-rose-100/70 border border-rose-200 mb-3.5">
              <HeartHandshake className="w-3.5 h-3.5 text-burgundy-700" />
              <span>Honoring Connections</span>
            </div>
            <h2 id="relationships-heading" className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy-900 tracking-tight">
              Who are you gifting today?
            </h2>
            <p className="mt-3.5 text-base sm:text-lg text-neutral-600">
              Every bond has its own sentiment. Choose a relationship to reveal meaningful expressions of love.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {FEATURED_RELATIONSHIPS.map((rel, idx) => (
              <motion.div
                key={rel.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <SpotlightCard
                  enableTilt={false}
                  spotlightColor="rgba(190, 18, 60, 0.12)"
                  className="group h-full flex flex-col justify-between p-7 rounded-2xl bg-white/90 border border-rose-200/70 hover:border-burgundy-400/40 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl"
                  onClick={() => handleRelationship(rel.value)}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl p-2.5 rounded-xl bg-ivory-100 border border-rose-100 group-hover:scale-110 transition-transform duration-300">
                        {rel.avatar}
                      </span>
                      <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-rose-50 text-burgundy-800 border border-rose-200">
                        {rel.badge}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-burgundy-900 group-hover:text-burgundy-700 transition-colors">
                      {rel.label}
                    </h3>

                    <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                      {rel.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-rose-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-burgundy-700 group-hover:text-burgundy-900 transition-colors">
                      Explore gifts
                    </span>
                    <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-burgundy-800 group-hover:bg-burgundy-700 group-hover:text-white group-hover:translate-x-1 transition-all duration-200">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. BESPOKE MARKETPLACE FLOW & STEPPER ────────────────────── */}
      <section aria-labelledby="custom-made-heading" className="w-full py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-ivory-200/50 via-white to-ivory-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-burgundy-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden mb-16">
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 rounded-full bg-gradient-to-br from-amber-400/20 via-rose-500/20 to-transparent blur-3xl pointer-events-none" />
            <BorderBeam size={350} duration={16} colorFrom="#F59E0B" colorTo="#FDA4AF" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="max-w-2xl text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 text-rose-200 border border-white/20 mb-4 backdrop-blur-sm">
                  <Scissors className="w-3.5 h-3.5 text-amber-300" />
                  <span>Custom Made Marketplace</span>
                </div>
                <h2 id="custom-made-heading" className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
                  Something one-of-a-kind?
                </h2>
                <p className="text-base sm:text-lg text-rose-100/90 leading-relaxed">
                  Post your custom gift concept to our curated network of jewelers, calligraphers,
                  leather crafters, and woodworkers. Get an original masterpiece crafted specifically for your story.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleCustomNav}
                className="shrink-0 inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-bold text-burgundy-950 bg-gradient-to-r from-amber-200 via-rose-100 to-amber-200 hover:from-amber-100 hover:to-rose-50 shadow-xl transition-all duration-300 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-burgundy-800" />
                <span>Explore Custom Gifts</span>
                <ArrowRight className="w-5 h-5 text-burgundy-800" />
              </motion.button>
            </div>
          </div>

          {/* 3-Step Animated SVG Timeline */}
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-[12%] right-[12%] -translate-y-8 h-0.5 z-0">
              <svg className="w-full h-8 overflow-visible" fill="none">
                <path
                  d="M 0 12 H 1000"
                  stroke="url(#dashedGradient2)"
                  strokeWidth="2.5"
                  strokeDasharray="8 8"
                  className="animate-[pulseSubtle_3s_infinite_ease-in-out]"
                />
                <defs>
                  <linearGradient id="dashedGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#BE123C" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#BE123C" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {BESPOKE_STEPS.map((step, idx) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="group relative bg-white rounded-3xl p-8 border border-rose-200/80 shadow-md hover:shadow-xl hover:border-burgundy-300 transition-all duration-300 text-center flex flex-col items-center"
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-ivory-100 border border-rose-200 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                      {step.icon}
                    </div>
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-burgundy-700 text-white shadow-xs">
                      {step.step}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-burgundy-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
