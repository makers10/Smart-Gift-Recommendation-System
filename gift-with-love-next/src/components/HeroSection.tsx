"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Gift, Scissors, ArrowDown, ChevronRight, CheckCircle2, Sparkles, TrendingUp } from "lucide-react";
import SpotlightCard from "./ui/SpotlightCard";
import BorderBeam from "./ui/BorderBeam";

interface HeroSectionProps {
  onFindGiftClick?: () => void;
  onCustomMadeClick?: () => void;
  onQuickOccasionClick?: (occasion: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onFindGiftClick,
  onCustomMadeClick,
  onQuickOccasionClick,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] },
    },
  };

  const scrollToForm = () => {
    if (onFindGiftClick) {
      onFindGiftClick();
    } else {
      document.getElementById("gift-discovery-form")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCustomClick = () => {
    if (onCustomMadeClick) {
      onCustomMadeClick();
    } else {
      document.getElementById("custom-made-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* ── Left Column: Editorial Headline & Actions ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 max-w-2xl"
          >
            {/* Shimmer Animated Badge */}
            <motion.div variants={itemVariants} className="inline-block mb-6">
              <div className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-burgundy-900 bg-gradient-to-r from-rose-100/90 via-amber-100/60 to-rose-100/90 border border-burgundy-300/40 shadow-xs overflow-hidden">
                {/* Subtle light sweep shimmer */}
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite_linear] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
                <span>Thoughtfully Curated Gifts</span>
              </div>
            </motion.div>

            {/* Staggered Serif Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-burgundy-950 leading-[1.08] mb-6"
            >
              The right gift, <br />
              <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-burgundy-700 via-rose-700 to-amber-700">
                for every heart.
              </span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-stone-700 font-sans leading-relaxed mb-8 max-w-xl"
            >
              Tell us who you are gifting and the occasion — we surface the most
              heartfelt, curated treasures tailored across every relationship, budget, and memory.
            </motion.p>

            {/* Dual Action Buttons with Spring Hover */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={scrollToForm}
                className="group relative inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full text-base font-semibold text-white bg-gradient-to-r from-burgundy-900 via-burgundy-800 to-burgundy-900 hover:from-burgundy-800 hover:to-burgundy-950 shadow-lg shadow-burgundy-950/20 border border-rose-300/20 transition-all duration-300"
              >
                <Gift className="w-5 h-5 text-rose-200 transition-transform group-hover:rotate-12" />
                <span>Find a Gift</span>
                <ArrowDown className="w-4 h-4 text-rose-200 transition-transform group-hover:translate-y-1" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={handleCustomClick}
                className="group inline-flex items-center justify-center gap-3 px-6 py-4 rounded-full text-base font-semibold text-burgundy-900 bg-white/80 hover:bg-white border border-rose-200/80 shadow-md shadow-rose-900/5 hover:border-burgundy-300 transition-all duration-300 backdrop-blur-sm"
              >
                <Scissors className="w-5 h-5 text-burgundy-700 transition-transform group-hover:scale-110" />
                <span>Custom Made</span>
              </motion.button>
            </motion.div>

            {/* Live Stats Row with Animated Badges */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-rose-200/60"
            >
              {[
                { value: "282+", label: "Gift combinations", sub: "Handpicked" },
                { value: "20+", label: "Relationships", sub: "Personalized" },
                { value: "30+", label: "Occasions", sub: "Covered" },
              ].map((stat) => (
                <div key={stat.label} className="group">
                  <p className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-900 tracking-tight group-hover:text-rose-700 transition-colors">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-stone-700 mt-1">
                    {stat.label}
                  </p>
                  <p className="text-[11px] text-stone-500 font-medium">{stat.sub}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right Column: 3D Tilt Spotlight Card ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-5 w-full perspective-1000"
          >
            <div className="relative group">
              {/* Outer decorative ambient glow aura */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-rose-300/40 via-amber-200/30 to-burgundy-300/30 blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

              <SpotlightCard
                enableTilt={true}
                spotlightColor="rgba(225, 29, 72, 0.12)"
                className="relative bg-white/90 border border-rose-200/80 shadow-2xl rounded-3xl p-7 lg:p-8 overflow-hidden backdrop-blur-xl"
              >
                {/* 21st.dev Border Beam Effect */}
                <BorderBeam size={280} duration={14} colorFrom="#BE123C" colorTo="#F59E0B" />

                {/* Card Header Tag */}
                <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-rose-100">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-burgundy-800 border border-rose-200/80">
                    <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
                    <span>Trending Spotlight</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Top Pick
                  </span>
                </div>

                {/* Card Body */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-burgundy-700">
                        Birthday • Partner or Sister
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1 leading-snug">
                        Artisan Leather Keepsake Journal
                      </h2>
                    </div>

                    <div className="shrink-0">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-burgundy-800 to-burgundy-950 text-white shadow-md shadow-burgundy-900/30">
                        +12 Score
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-stone-600 leading-relaxed font-sans">
                    Hand-stitched full-grain Italian leather binding with archival-quality
                    deckle edge paper. A timeless, sentimental vessel crafted for thoughts, sketches,
                    and cherished lifetime memories.
                  </p>

                  {/* Metadata Row */}
                  <div className="flex items-center justify-between text-xs py-3 px-3.5 rounded-xl bg-canvas-warm/70 border border-rose-100 font-medium">
                    <span className="text-stone-600">
                      Budget:{" "}
                      <strong className="text-burgundy-900 font-bold">₹2,000 – ₹5,000</strong>
                    </span>
                    <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Highly Rated
                    </span>
                  </div>

                  {/* High Converting Action Button */}
                  <div className="pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onQuickOccasionClick?.("birthday")}
                      className="group/btn w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-burgundy-800 to-burgundy-900 hover:from-burgundy-700 hover:to-burgundy-800 shadow-md shadow-burgundy-900/20 transition-all duration-200"
                    >
                      <span>Discover Birthday Gifts</span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </motion.button>
                  </div>
                </div>

                {/* Popular Searches Footer Chips */}
                <div className="mt-6 pt-5 border-t border-rose-100">
                  <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2.5">
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
                        onClick={() => onQuickOccasionClick?.(item.value)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white text-stone-700 border border-rose-200 hover:bg-rose-50 hover:border-burgundy-300 hover:text-burgundy-900 transition-all duration-150 active:scale-95 shadow-2xs"
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
  );
};

export default HeroSection;
