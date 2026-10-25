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
    icon: <Compass className="w-6 h-6 text-champagne" />,
  },
  {
    step: "02",
    title: "Synthesize 282+ Verified Gifts",
    desc: "Our recommendation algorithm filters across relationships, tastes, and budgets with zero arbitrary guessing.",
    icon: <Cpu className="w-6 h-6 text-champagne-light" />,
  },
  {
    step: "03",
    title: "Reveal, Personalize & Cherish",
    desc: "Save to your persistent wishlist, customize through independent artisans, and deliver unforgettable sentiment.",
    icon: <Gift className="w-6 h-6 text-champagne" />,
  },
];

const FAQS = [
  {
    q: "How does Giftverse generate recommendations?",
    a: "We analyze relationship depth, occasion significance, budget boundaries, and personal interests against a curated catalog of 282+ verified gift combinations. Every recommendation features an explicit rationale explaining why it was chosen.",
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
    <div className="w-full bg-transparent text-[#FFF7E9] relative z-10 py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-serif uppercase tracking-widest text-[#E9D7B8] bg-[#261722]/95 border border-[#4A1830] shadow-[0_2px_12px_rgba(74,24,48,0.4)] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C69A55]" />
            <span>The Giftverse Experience</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFF7E9] tracking-tight">
            How The Discovery Operates
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#E9D7B8]/80 font-sans font-light">
            Three simple stages bridging heartfelt sentiment with tangible physical wonders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {WORK_STEPS.map((s) => (
            <div
              key={s.step}
              className="relative rounded-3xl bg-gradient-to-br from-[#261722]/95 via-[#1E131B]/95 to-[#17131A]/95 border border-[#4A1830] p-8 flex flex-col justify-between hover:border-[#C69A55]/60 hover:shadow-[0_12px_40px_rgba(198,154,85,0.2)] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4A1830] to-[#17131A] border border-[#C69A55]/40 flex items-center justify-center shadow-inner">
                    {s.icon}
                  </div>
                  <span className="font-serif text-3xl font-bold text-[#C69A55]/70">
                    {s.step}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-[#FFF7E9] mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-[#E9D7B8]/80 font-sans font-light leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── WHY GIFTVERSE PILLARS ───────────────────────────────────────── */}
        <div className="rounded-3xl bg-gradient-to-br from-[#2D1623] via-[#21141D] to-[#17131A] border border-[#4A1830] p-8 sm:p-12 mb-24 shadow-[0_14px_45px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C69A55]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-serif uppercase tracking-widest text-[#C69A55] block mb-2">
                Engineered for Sentiment
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#FFF7E9] mb-4 leading-tight">
                Why Millions Never Guess a Gift Again
              </h3>
              <p className="text-sm text-[#E9D7B8]/80 font-sans font-light leading-relaxed">
                Traditional ecommerce bombards you with generic ads. Giftverse analyzes interpersonal
                sentiment, occasions, and artisan craftsmanship to curate things that resonate for a lifetime.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "No Sponsored Biases", desc: "Rankings based purely on relevance and score, not retailer ad dollars." },
                { title: "Emotional Rationale", desc: "Every match comes with a clear explanation of why it fits." },
                { title: "Direct Artisan Escrow", desc: "Collaborate safely with custom makers with milestone protection." },
                { title: "Universal Currency", desc: "Configured transparently in ₹ for reliable local availability." },
              ].map((item) => (
                <div key={item.title} className="p-4 rounded-2xl bg-[#17131A]/80 border border-[#4A1830] hover:border-[#C69A55]/50 transition-colors">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Check className="w-4 h-4 text-[#C69A55]" />
                    <h4 className="text-sm font-serif font-bold text-[#FFF7E9]">{item.title}</h4>
                  </div>
                  <p className="text-xs text-[#E9D7B8]/75 font-sans font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FAQ ACCORDION ──────────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FFF7E9]">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-[#E9D7B8]/80 font-sans font-light mt-1">
              Everything you need to know about the Giftverse discovery algorithm.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl bg-[#261722]/90 border border-[#4A1830] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-serif font-semibold text-sm text-luxury-text">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-champagne transition-transform duration-200 shrink-0 ${
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
                        className="px-5 pb-5 text-xs text-luxury-muted font-sans font-light leading-relaxed border-t border-luxury-border/60 pt-3"
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
