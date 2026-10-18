"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Menu, X, Sparkles, Heart, Clock, LayoutDashboard, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { id: "find-gift", label: "Find a Gift", icon: <Gift className="w-4 h-4" /> },
  { id: "custom-made", label: "Custom Made", icon: <Scissors className="w-4 h-4" /> },
  { id: "history", label: "History", icon: <Clock className="w-4 h-4" /> },
  { id: "wishlist", label: "Wishlist", icon: <Heart className="w-4 h-4" /> },
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
];

interface StickyHeaderProps {
  activeTab?: string;
  onTabChange?: (id: string) => void;
}

/**
 * StickyHeader — Luxury glassmorphism header with active spring indicator line
 * and fluid mobile drawer.
 */
export const StickyHeader: React.FC<StickyHeaderProps> = ({
  activeTab = "find-gift",
  onTabChange,
}) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSelectTab = (id: string) => {
    setCurrentTab(id);
    onTabChange?.(id);
    setMobileMenuOpen(false);

    if (id === "find-gift") {
      document.getElementById("gift-discovery-form")?.scrollIntoView({ behavior: "smooth" });
    } else if (id === "custom-made") {
      document.getElementById("custom-made-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        "backdrop-blur-md bg-[#FCF9F2]/80 border-b border-rose-100/60",
        isScrolled ? "shadow-[0_10px_30px_-10px_rgba(136,19,55,0.08)] py-3" : "py-4 sm:py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Wordmark */}
          <button
            onClick={() => handleSelectTab("find-gift")}
            className="group flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-700/50 rounded-lg p-1 transition-transform active:scale-95"
            aria-label="Gift with Love Home"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-burgundy-800 to-burgundy-950 text-white shadow-md shadow-burgundy-900/20 group-hover:scale-105 transition-all duration-300">
              <Gift className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-burgundy-900 block leading-tight">
                Gift with Love
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-burgundy-600/70 block">
                Atelier of Thoughtful Giving
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-white/60 p-1.5 rounded-full border border-rose-200/50 shadow-xs backdrop-blur-sm">
            {NAV_ITEMS.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 flex items-center gap-2",
                    isActive ? "text-burgundy-900 font-semibold" : "text-stone-600 hover:text-burgundy-800 hover:bg-rose-50/50"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className={cn("transition-colors", isActive ? "text-burgundy-700" : "text-stone-400")}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>

                  {/* Active Burgundy Indicator Line / Capsule */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-100/80 via-rose-50/90 to-amber-50/70 border border-burgundy-700/20 shadow-xs -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    >
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-burgundy-700 rounded-full" />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Sparkle VIP / Concierge */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => handleSelectTab("custom-made")}
              className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-burgundy-800 bg-gradient-to-r from-amber-100/80 via-rose-100/70 to-amber-100/80 border border-amber-300/60 shadow-xs hover:shadow-md transition-all duration-200 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>Bespoke Concierge</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/70 border border-rose-200 text-burgundy-900 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-700"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-t border-rose-100 bg-[#FCF9F2]/95 backdrop-blur-xl px-4 pt-3 pb-6 shadow-xl"
          >
            <div className="flex flex-col gap-1.5 pt-2">
              {NAV_ITEMS.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-medium transition-all",
                      isActive
                        ? "bg-burgundy-900 text-white shadow-md shadow-burgundy-900/10"
                        : "text-stone-700 hover:bg-rose-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? "text-rose-200" : "text-burgundy-700"}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {isActive && <span className="w-2 h-2 rounded-full bg-amber-300" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default StickyHeader;
