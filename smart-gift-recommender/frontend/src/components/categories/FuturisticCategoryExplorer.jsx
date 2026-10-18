import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Heart,
  Cpu,
  Gem,
  Palette,
  Coffee,
  Compass,
  Gift,
  Flame,
} from "lucide-react";

const CATEGORIES = [
  {
    id: "partner-romance",
    title: "Partner & Romantic Sentiments",
    subtitle: "Enduring keepsakes, constellation frames & timeless jewelry",
    itemsCount: "38 Curated Gems",
    symbol: "💍",
    color: "from-rose-500/20 via-pink-500/10 to-transparent",
    borderColor: "border-rose-500/40 hover:border-rose-400",
    glowColor: "group-hover:shadow-[0_0_35px_-5px_rgba(244,63,94,0.4)]",
    params: { relationship: "partner", occasion: "anniversary", budget: "1000-2500" },
  },
  {
    id: "tech-future",
    title: "Futuristic Tech & Smart Living",
    subtitle: "Acoustic audio, ambient lighting & smart lifestyle tools",
    itemsCount: "29 Curated Gems",
    symbol: "⚡",
    color: "from-cyan-500/20 via-blue-500/10 to-transparent",
    borderColor: "border-cyan-500/40 hover:border-cyan-400",
    glowColor: "group-hover:shadow-[0_0_35px_-5px_rgba(6,182,212,0.4)]",
    params: { relationship: "best_friend", occasion: "birthday", budget: "2500-5000" },
  },
  {
    id: "parents-heritage",
    title: "Parental Honor & Heritage",
    subtitle: "Artisan wellness, herbal tea samplers & warm comforts",
    itemsCount: "34 Curated Gems",
    symbol: "🌺",
    color: "from-amber-500/20 via-orange-500/10 to-transparent",
    borderColor: "border-amber-500/40 hover:border-amber-400",
    glowColor: "group-hover:shadow-[0_0_35px_-5px_rgba(245,158,11,0.4)]",
    params: { relationship: "mom", occasion: "mothers_day", budget: "1000-2500" },
  },
  {
    id: "artisanal-craft",
    title: "Handcrafted & Heirloom Art",
    subtitle: "Full-grain leather journals, ceramic diffusers & calligraphy",
    itemsCount: "42 Curated Gems",
    symbol: "🎨",
    color: "from-purple-500/20 via-violet-500/10 to-transparent",
    borderColor: "border-purple-500/40 hover:border-purple-400",
    glowColor: "group-hover:shadow-[0_0_35px_-5px_rgba(168,85,247,0.4)]",
    params: { relationship: "sister", occasion: "birthday", budget: "1000-2500" },
  },
  {
    id: "luxury-statement",
    title: "Grand Luxury & Statement Heirlooms",
    subtitle: "Curated brass telescope, gold-accented crafts & collector tokens",
    itemsCount: "22 Curated Gems",
    symbol: "💎",
    color: "from-emerald-500/20 via-teal-500/10 to-transparent",
    borderColor: "border-emerald-500/40 hover:border-emerald-400",
    glowColor: "group-hover:shadow-[0_0_35px_-5px_rgba(16,185,129,0.4)]",
    params: { relationship: "partner", occasion: "wedding", budget: "above-5000" },
  },
  {
    id: "budget-sweet",
    title: "Modest Gems & Sweet Tokens",
    subtitle: "Artisan chocolates, scented candles & succulent wonders under ₹500",
    itemsCount: "36 Curated Gems",
    symbol: "✨",
    color: "from-pink-500/20 via-rose-500/10 to-transparent",
    borderColor: "border-pink-500/40 hover:border-pink-400",
    glowColor: "group-hover:shadow-[0_0_35px_-5px_rgba(236,72,153,0.4)]",
    params: { relationship: "colleague", occasion: "thank_you", budget: "under-500" },
  },
];

export default function FuturisticCategoryExplorer({ onSelectCategory }) {
  return (
    <section id="categories-section" className="relative w-full py-20 lg:py-28 bg-midnight-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest text-violet-300 bg-midnight-900 border border-cyber-violet/30 shadow-neon-violet mb-4">
            <Compass className="w-3.5 h-3.5 text-cyber-violet animate-spin-slow" />
            <span>Category Constellations</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Explore Gift Dimensions
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 font-sans">
            Curated visual journeys into our most beloved gifting universes.
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
              className={`group relative rounded-3xl bg-midnight-900/90 border ${cat.borderColor} p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl ${cat.glowColor} hover:-translate-y-2`}
            >
              {/* Inner ambient glow background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-40 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none`}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl p-3 rounded-2xl bg-midnight-950/80 border border-slate-800 shadow-md group-hover:scale-110 transition-transform duration-300 block">
                    {cat.symbol}
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-midnight-950 px-2.5 py-1 rounded-full border border-slate-800">
                    {cat.itemsCount}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-white group-hover:text-cyan-200 transition-colors leading-snug">
                  {cat.title}
                </h3>

                <p className="mt-2 text-xs text-slate-300 font-sans leading-relaxed">
                  {cat.subtitle}
                </p>
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-300 group-hover:underline">
                  Launch Discovery
                </span>
                <div className="w-8 h-8 rounded-full bg-midnight-950 border border-slate-700 flex items-center justify-center text-cyan-300 group-hover:bg-cyber-cyan group-hover:text-midnight-950 group-hover:translate-x-1 transition-all">
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
