import React from "react";
import { Gift, Heart, Sparkles, Send } from "lucide-react";

export default function FuturisticFooter({ onNavigate }) {
  return (
    <footer className="relative bg-midnight-950 text-slate-400 pt-16 pb-12 border-t border-slate-800/80 overflow-hidden text-xs">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-24 bg-cyber-cyan/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Logo & Description */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyber-cyan to-cyber-violet flex items-center justify-center text-midnight-950 font-bold">
                <Gift className="w-4 h-4" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">GIFTVERSE</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed font-sans text-xs">
              An award-winning futuristic 3D discovery engine transforming heartfelt sentiment into unforgettable gifts and bespoke artisan commissions.
            </p>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
              <span>GIFTVERSE Core Engine v3.0 • Operational</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-white">Dimensions</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    onNavigate?.("home");
                    document.getElementById("gift-wizard-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left"
                >
                  Discovery Wizard
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate?.("home");
                    document.getElementById("categories-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left"
                >
                  Constellations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.("custom")}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left"
                >
                  Custom Made Atelier
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.("wishlist")}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left"
                >
                  Wishlist & Saved
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.("dashboard")}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left"
                >
                  Platform Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-white">Cosmic Dispatches</h5>
            <p className="text-slate-400 text-xs">
              Receive curated seasonal gift previews and exclusive bespoke maker drops.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter email address"
                className="bg-midnight-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl px-3.5 py-2 w-full text-xs focus:border-cyber-cyan focus:outline-none"
              />
              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyan-300 text-midnight-950 font-bold hover:opacity-90 transition-opacity cursor-pointer">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px] font-mono">
          <p>© {new Date().getFullYear()} GIFTVERSE. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-cyber-pink fill-cyber-pink inline" />
            <span>for human connections</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
