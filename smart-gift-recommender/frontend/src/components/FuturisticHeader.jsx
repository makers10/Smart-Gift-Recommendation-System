import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  Compass,
  Sparkles,
  Scissors,
  Heart,
  Clock,
  LayoutDashboard,
  Menu,
  X,
  Sliders,
} from "lucide-react";

export default function FuturisticHeader({ tab, onNavigate, onLaunchWizard }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Experience", icon: <Gift className="w-3.5 h-3.5" /> },
    { id: "wizard", label: "Gift Wizard", icon: <Sliders className="w-3.5 h-3.5" />, isAction: true },
    { id: "categories", label: "Collections", icon: <Compass className="w-3.5 h-3.5" /> },
    { id: "custom", label: "Custom Atelier", icon: <Scissors className="w-3.5 h-3.5" /> },
    { id: "wishlist", label: "Wishlist", icon: <Heart className="w-3.5 h-3.5" /> },
    { id: "history", label: "History", icon: <Clock className="w-3.5 h-3.5" /> },
    { id: "dashboard", label: "Analytics", icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
  ];

  const handleItemClick = (id) => {
    setMobileMenuOpen(false);
    if (id === "wizard") {
      onNavigate("home");
      setTimeout(() => {
        document.getElementById("gift-wizard-section")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
      return;
    }
    if (id === "categories") {
      onNavigate("home");
      setTimeout(() => {
        document.getElementById("categories-section")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
      return;
    }
    onNavigate(id);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 backdrop-blur-xl border-b
        ${
          isScrolled
            ? "bg-[#17131A]/95 border-[#4A1830] shadow-[0_4px_25px_rgba(0,0,0,0.5)] py-3"
            : "bg-[#17131A]/85 border-[#4A1830]/70 py-4"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Wordmark */}
          <button
            onClick={() => onNavigate("home")}
            className="group flex items-center gap-3 text-left focus:outline-none cursor-pointer"
            aria-label="Giftverse Home"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#4A1830] to-[#2B101D] border border-[#C69A55]/40 text-[#C69A55] shadow-sm group-hover:scale-105 transition-transform">
              <Gift className="w-5 h-5 text-[#C69A55] transition-transform group-hover:rotate-12" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold tracking-wider text-[#FFF7E9] block leading-none">
                  GIFTVERSE
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-sans font-semibold uppercase tracking-wider bg-[#4A1830] text-[#E9D7B8] border border-[#C69A55]/30">
                  Luxury 3D
                </span>
              </div>
              <span className="text-[10px] uppercase font-sans tracking-widest text-[#E9D7B8]/75 block mt-0.5">
                Every Gift Has a Story
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#241620]/95 p-1 rounded-full border border-[#4A1830] shadow-inner">
            {navItems.map((item) => {
              const isActive = tab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`relative px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 flex items-center gap-1.5 cursor-pointer
                    ${
                      isActive
                        ? "text-[#17131A] font-bold bg-gradient-to-r from-[#C69A55] via-[#DCB372] to-[#E9D7B8] shadow-[0_2px_12px_rgba(198,154,85,0.4)]"
                        : "text-[#E9D7B8]/80 hover:text-[#FFF7E9] hover:bg-[#4A1830]/50"
                    }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Launch Discovery CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => {
                onNavigate("home");
                setTimeout(() => {
                  document.getElementById("gift-wizard-section")?.scrollIntoView({ behavior: "smooth" });
                }, 50);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#17131A] bg-gradient-to-r from-[#C69A55] via-[#DCB372] to-[#E9D7B8] hover:brightness-105 shadow-[0_2px_14px_rgba(198,154,85,0.35)] cursor-pointer transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 fill-[#17131A] text-[#17131A]" />
              <span>Launch Wizard</span>
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-luxury-card border border-luxury-border text-luxury-muted hover:text-luxury-text cursor-pointer"
            aria-label="Toggle Navigation"
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
            className="lg:hidden bg-luxury-main border-t border-luxury-border px-4 py-4"
          >
            <div className="flex flex-col gap-1.5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium text-luxury-muted hover:bg-luxury-card hover:text-luxury-text transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-champagne">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <span className="text-xs text-luxury-muted">→</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
