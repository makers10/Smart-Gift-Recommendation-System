import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Cpu,
  Gift,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  HelpCircle,
  Heart,
  Check,
} from "lucide-react";

const WORK_STEPS = [
  {
    step: "01",
    title: "Define Bond & Occasion",
    desc: "Specify who you are honoring and the milestone being celebrated. We adapt the emotional weighting accordingly.",
    icon: <Compass className="w-6 h-6 text-cyber-cyan" />,
  },
  {
    step: "02",
    title: "Synthesize 282+ Verified Gems",
    desc: "Our neural matching algorithm filters across relationships, tastes, and budgets with zero arbitrary guessing.",
    icon: <Cpu className="w-6 h-6 text-cyber-violet" />,
  },
  {
    step: "03",
    title: "Reveal, Personalize & Cherish",
    desc: "Save to your persistent wishlist, customize through independent artisans, and deliver unforgettable sentiment.",
    icon: <Gift className="w-6 h-6 text-cyber-pink" />,
  },
];

const FAQS = [
  {
    q: "How does Giftverse generate recommendations?",
    a: "We analyze relationship depth, occasion significance, budget boundaries, and personal interests against a curated database of 282+ verified gift combinations. Every recommendation features an explicit rationale explaining why it was chosen.",
  },
  {
    q: "Are the prices and budget tiers real?",
    a: "Yes. All price estimates are calibrated in Indian Rupees (₹) to reflect honest market costs across modest tokens (under ₹500), thoughtful gestures (₹500–₹1,000), generous gifts (₹1,000–₹2,500), and bespoke heirlooms (₹5,000+).",
  },
  {
    q: "Can I commission custom-made one-of-a-kind gifts?",
    a: "Absolutely. Our Custom Made Atelier allows you to post your unique vision directly to vetted jewelers, leather crafters, calligraphers, and woodworkers, complete with direct maker offers and milestones.",
  },
  {
    q: "Does Giftverse store my search history and wishlist?",
    a: "Yes. Your session maintains a private, anonymous identifier allowing you to review your past discovery history, revisit saved wishlist items, and track your custom orders at any time.",
  },
];

export default function FuturisticHowItWorks() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="w-full bg-midnight-950 text-white relative z-10 py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest text-cyan-300 bg-midnight-900 border border-cyber-cyan/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>The Giftverse Architecture</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            How The Discovery Operates
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 font-sans">
            Three simple stages bridging sentimental thought with tangible physical wonders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {WORK_STEPS.map((s, idx) => (
            <div
              key={s.step}
              className="relative rounded-3xl bg-midnight-900/80 border border-slate-800 p-8 flex flex-col justify-between hover:border-slate-700 hover:shadow-2xl transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-midnight-950 border border-slate-800 flex items-center justify-center shadow-inner">
                    {s.icon}
                  </div>
                  <span className="font-mono text-2xl font-bold text-slate-700">
                    {s.step}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-400 font-sans leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── WHY GIFTVERSE PILLARS ───────────────────────────────────────── */}
        <div className="rounded-3xl bg-gradient-to-br from-midnight-900 via-midnight-850 to-midnight-900 border border-slate-800 p-8 sm:p-12 mb-24 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyber-cyan/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-mono uppercase tracking-widest text-cyber-cyan block mb-2">
                Engineered for Sentiment
              </span>
              <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
                Why Millions Never Guess a Gift Again
              </h3>
              <p className="text-sm text-slate-300 font-sans leading-relaxed">
                Traditional ecommerce bombards you with generic ads. Giftverse analyzes interpersonal
                psychology, occasions, and artisan craftsmanship to curate things that resonate for a lifetime.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "No Sponsored Biases", desc: "Rankings based purely on relevance and score, not retailer ad dollars." },
                { title: "Emotional Rationale", desc: "Every match comes with a clear explanation of why it fits." },
                { title: "Direct Artisan Escrow", desc: "Collaborate safely with custom makers with milestone protection." },
                { title: "Universal Currency", desc: "Configured transparently in ₹ for reliable local availability." },
              ].map((item) => (
                <div key={item.title} className="p-4 rounded-2xl bg-midnight-950/80 border border-slate-800/80">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Check className="w-4 h-4 text-cyber-cyan" />
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FAQ ACCORDION ──────────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Everything you need to know about the Giftverse discovery algorithm.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl bg-midnight-900/80 border border-slate-800 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-semibold text-sm text-white">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-cyan-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-5 pb-5 text-xs text-slate-300 font-sans leading-relaxed border-t border-slate-800/60 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
