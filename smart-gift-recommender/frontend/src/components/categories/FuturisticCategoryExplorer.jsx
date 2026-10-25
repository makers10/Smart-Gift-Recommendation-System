import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Compass,
} from "lucide-react";

const CATEGORIES = [
  {
    id: "partner-romance",
    title: "Partner & Romantic Sentiments",
    subtitle: "Enduring keepsakes, constellation frames & timeless jewelry",
    itemsCount: "38 Curated Gifts",
    symbol: "💍",
    params: { relationship: "partner", occasion: "anniversary", budget: "1000-2500" },
  },
  {
    id: "tech-future",
    title: "Refined Tech & Smart Living",
    subtitle: "Acoustic audio, ambient lighting & artisanal lifestyle tools",
    itemsCount: "29 Curated Gifts",
    symbol: "⚡",
    params: { relationship: "best_friend", occasion: "birthday", budget: "2500-5000" },
  },
  {
    id: "parents-heritage",
    title: "Parental Honor & Heritage",
    subtitle: "Artisan wellness, herbal tea samplers & warm comforts",
    itemsCount: "34 Curated Gifts",
    symbol: "🌺",
    params: { relationship: "mom", occasion: "mothers_day", budget: "1000-2500" },
  },
  {
    id: "artisanal-craft",
    title: "Handcrafted & Heirloom Art",
    subtitle: "Full-grain leather journals, ceramic diffusers & calligraphy",
    itemsCount: "42 Curated Gifts",
    symbol: "🎨",
    params: { relationship: "sister", occasion: "birthday", budget: "1000-2500" },
  },
  {
    id: "luxury-statement",
    title: "Grand Luxury & Statement Heirlooms",
    subtitle: "Curated brass telescope, gold-accented crafts & collector tokens",
    itemsCount: "22 Curated Gifts",
    symbol: "💎",
    params: { relationship: "partner", occasion: "wedding", budget: "above-5000" },
  },
  {
    id: "budget-sweet",
    title: "Modest Gems & Thoughtful Tokens",
    subtitle: "Artisan chocolates, scented candles & succulent wonders under ₹500",
    itemsCount: "36 Curated Gifts",
    symbol: "✨",
    params: { relationship: "colleague", occasion: "thank_you", budget: "under-500" },
  },
];

export default function FuturisticCategoryExplorer({ onSelectCategory }) {
  return (
    <section id="categories-section" className="relative w-full py-20 lg:py-28 bg-transparent text-[#FFF7E9] overflow-hidden">
      {/* Background radial warmth */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#C69A55]/12 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-serif uppercase tracking-widest text-[#E9D7B8] bg-[#261722]/95 border border-[#4A1830] shadow-[0_2px_12px_rgba(74,24,48,0.4)] mb-4">
            <Compass className="w-3.5 h-3.5 text-[#C69A55] animate-spin-slow" />
            <span>Curated Collections</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFF7E9] tracking-tight">
            Explore Curated Collections
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#E9D7B8]/80 font-sans font-light">
            Thoughtfully composed gifting dimensions designed for every milestone and meaningful bond.
          </p>
        </div>

        {/* Category Visual Compositions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              onClick={() => onSelectCategory(cat.params)}
              className="group relative rounded-3xl bg-gradient-to-br from-[#261722]/95 via-[#1E131B]/95 to-[#17131A]/95 hover:from-[#311D2C] hover:to-[#1E131B] border border-[#4A1830] hover:border-[#C69A55]/70 p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(198,154,85,0.22)] hover:-translate-y-1.5"
            >
              {/* Subtle top ambient sheen */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#C69A55]/40 to-transparent group-hover:via-[#C69A55] transition-all duration-500" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl p-3 rounded-2xl bg-gradient-to-br from-[#4A1830] to-[#17131A] border border-[#C69A55]/30 shadow-sm group-hover:scale-105 transition-transform duration-300 block">
                    {cat.symbol}
                  </span>
                  <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-[#E9D7B8] bg-[#4A1830]/80 px-2.5 py-1 rounded-full border border-[#E9D7B8]/30">
                    {cat.itemsCount}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-[#FFF7E9] group-hover:text-[#C69A55] transition-colors leading-snug">
                  {cat.title}
                </h3>

                <p className="mt-2 text-xs text-[#E9D7B8]/75 font-sans font-light leading-relaxed">
                  {cat.subtitle}
                </p>
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t border-[#4A1830]/80 flex items-center justify-between">
                <span className="text-xs font-serif font-semibold text-[#C69A55] group-hover:text-[#FFF7E9] transition-colors">
                  Explore Gifts
                </span>
                <div className="w-8 h-8 rounded-full bg-[#261722] border border-[#4A1830] flex items-center justify-center text-[#C69A55] group-hover:bg-[#C69A55] group-hover:text-[#17131A] group-hover:translate-x-1 transition-all shadow-sm">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
