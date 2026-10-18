"use client";

import React from "react";
import { Gift, Heart, Sparkles, ShieldCheck, RefreshCw, Send } from "lucide-react";

export const LuxuryFooter: React.FC = () => {
  return (
    <footer className="relative bg-[#1A0B10] text-rose-100/90 pt-16 pb-12 border-t border-rose-900/40 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 bg-rose-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Trust Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-14 border-b border-rose-900/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-800/60 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-white">Artisanal Quality</h4>
              <p className="text-xs text-rose-200/70 mt-0.5">Every gift is curated and certified for heirloom craftsmanship.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-800/60 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-white">Direct Maker Escrow</h4>
              <p className="text-xs text-rose-200/70 mt-0.5">Custom orders are protected with milestone approvals.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-800/60 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 text-rose-300" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-white">Personalized Guidance</h4>
              <p className="text-xs text-rose-200/70 mt-0.5">Smart recommendations tailored to sentiment and relationships.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-12 border-b border-rose-900/50">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-burgundy-700 flex items-center justify-center text-white">
                <Gift className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">Gift with Love</span>
            </div>
            <p className="text-sm text-rose-200/80 max-w-sm leading-relaxed font-sans">
              An atelier of thoughtful discoveries connecting heartfelt sentiment with timeless gifts and independent bespoke artisans.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-amber-300">Discover</h5>
            <ul className="space-y-2 text-sm text-rose-200/80">
              <li><a href="#gift-discovery-form" className="hover:text-white transition-colors">Gift Finder</a></li>
              <li><a href="#custom-made-section" className="hover:text-white transition-colors">Custom Made Atelier</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Curated Occasions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Maker Directory</a></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-amber-300">Sentimental Notes</h5>
            <p className="text-xs text-rose-200/70">Subscribe for thoughtful gifting guides and seasonal artisan previews.</p>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-sm bg-rose-950/70 border-rose-800 text-white placeholder-rose-400/50 rounded-xl w-full text-xs"
              />
              <button className="btn btn-sm bg-burgundy-700 hover:bg-burgundy-600 text-white border-none rounded-xl px-4">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-rose-300/60">
          <p>© {new Date().getFullYear()} Gift with Love Atelier. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline" />
            <span>for timeless celebrations</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LuxuryFooter;
