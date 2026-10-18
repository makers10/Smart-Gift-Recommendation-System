import React from "react";
import { Gift, Heart, Sparkles, Send } from "lucide-react";

export default function FuturisticFooter({ onNavigate }) {
  return (
    <footer className="relative bg-luxury-main text-luxury-muted pt-16 pb-12 border-t border-luxury-border overflow-hidden text-xs">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-24 bg-champagne-glow blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-luxury-border">
          
          {/* Logo & Description */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-luxury-burgundy border border-champagne/40 flex items-center justify-center text-champagne font-bold shadow-champagne-sm">
                <Gift className="w-4 h-4 text-champagne" />
              </div>
              <span className="font-serif text-xl font-bold tracking-wider text-luxury-text">GIFTVERSE</span>
            </div>
            <p className="text-luxury-muted max-w-sm leading-relaxed font-sans font-light text-xs">
              A luxury 3D gift discovery experience transforming heartfelt sentiment into unforgettable presents and bespoke artisan commissions.
            </p>
            <div className="flex items-center gap-2 text-champagne font-serif text-[11px]">
              <span className="w-2 h-2 rounded-full bg-champagne animate-pulse" />
              <span>GIFTVERSE Champagne Dream Experience • Operational</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="font-serif text-xs font-semibold uppercase tracking-wider text-luxury-text">Curated Portals</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    onNavigate?.("home");
                    document.getElementById("gift-wizard-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:text-champagne transition-colors cursor-pointer text-left"
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
                  className="hover:text-champagne transition-colors cursor-pointer text-left"
                >
                  Curated Collections
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.("custom")}
                  className="hover:text-champagne transition-colors cursor-pointer text-left"
                >
                  Custom Made Atelier
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.("wishlist")}
                  className="hover:text-champagne transition-colors cursor-pointer text-left"
                >
                  Wishlist & Saved
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.("dashboard")}
                  className="hover:text-champagne transition-colors cursor-pointer text-left"
                >
                  Platform Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="font-serif text-xs font-semibold uppercase tracking-wider text-luxury-text">Private Dispatches</h5>
            <p className="text-luxury-muted text-xs font-light">
              Receive curated seasonal gift previews and exclusive bespoke maker drops.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter email address"
                className="bg-luxury-card border border-luxury-border text-luxury-text placeholder-luxury-muted/60 rounded-xl px-3.5 py-2 w-full text-xs focus:border-champagne focus:outline-none"
              />
              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-champagne to-champagne-light text-luxury-main font-semibold hover:brightness-105 transition-all cursor-pointer shadow-champagne-sm">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-luxury-muted text-[11px] font-sans">
          <p>© {new Date().getFullYear()} GIFTVERSE. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-luxury-muted">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-luxury-rose fill-luxury-rose inline" />
            <span>for heartfelt human connections</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
