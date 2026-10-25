import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ArrowDown, Gift, Compass } from "lucide-react";
import HeroGiftScene from "./3d/HeroGiftScene";

export default function FuturisticHero({ onFindGiftClick, onExploreClick }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.14, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const scrollToWizard = () => {
    if (onFindGiftClick) {
      onFindGiftClick();
    } else {
      document.getElementById("gift-wizard-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToCategories = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      document.getElementById("categories-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden bg-transparent text-[#FFF7E9] pt-8 pb-16 lg:py-20">
      
      {/* Studio Radial Champagne & Warm Burgundy Atmosphere Gradients */}
      <div className="absolute top-1/6 right-1/4 w-[650px] h-[650px] bg-[#C69A55]/15 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/10 w-[550px] h-[550px] bg-[#4A1830]/60 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[750px] h-[300px] bg-[#E9D7B8]/12 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ── Left Column: Cinematic Editorial Luxury Headline & CTAs ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 max-w-2xl text-center lg:text-left mx-auto lg:mx-0"
          >
            {/* Elegant Champagne Eyebrow Badge */}
            <motion.div variants={itemVariants} className="inline-block mb-6">
              <div className="relative inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-serif uppercase tracking-widest text-[#E9D7B8] bg-[#261722]/95 border border-[#4A1830] shadow-[0_2px_12px_rgba(74,24,48,0.4)] overflow-hidden backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#C69A55] animate-pulse" />
                <span>CHAMPAGNE DREAM • LUXURY GIFTING</span>
              </div>
            </motion.div>

            {/* Oversized Cinematic Editorial Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FFF7E9] leading-[1.06] mb-6"
            >
              Every Gift Has{" "}
              <span className="italic font-normal text-[#C69A55] drop-shadow-[0_2px_16px_rgba(198,154,85,0.5)]">
                a Story.
              </span>
            </motion.h1>

            {/* Refined Supporting Copy */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-[#E9D7B8]/90 font-sans font-light leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Discover thoughtful gifts for the people who matter most. Step into a
              refined universe where each recommendation feels personal, elegant, and unforgettable.
            </motion.p>

            {/* Primary & Secondary Luxury CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToWizard}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-sm font-semibold tracking-wider text-[#17131A] bg-gradient-to-r from-[#C69A55] via-[#DCB372] to-[#E9D7B8] hover:brightness-105 shadow-[0_4px_24px_rgba(198,154,85,0.45)] transition-all duration-300 cursor-pointer"
              >
                <Gift className="w-4 h-4 text-[#17131A] transition-transform group-hover:rotate-12" />
                <span>Find the Perfect Gift</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToCategories}
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full text-sm font-medium text-[#FFF7E9] bg-[#261722]/85 hover:bg-[#331C2C] border border-[#4A1830] hover:border-[#C69A55]/60 shadow-md backdrop-blur-md transition-all duration-300 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#C69A55] transition-transform group-hover:rotate-45" />
                <span>Explore Gift Ideas</span>
              </motion.button>
            </motion.div>

            {/* Natural, Honest Statements with High-Contrast Champagne & Gold Typography */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-[#4A1830]/80 text-center lg:text-left"
            >
              {[
                { value: "250+", label: "Thoughtful Gifts", sub: "Handpicked with care" },
                { value: "100%", label: "Personalized", sub: "Tailored to their taste" },
                { value: "₹0", label: "Free to Discover", sub: "No hidden markups" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-serif text-3xl sm:text-4xl font-bold text-[#C69A55] tracking-tight drop-shadow-[0_2px_10px_rgba(198,154,85,0.35)]">
                    {s.value}
                  </p>
                  <p className="text-xs font-semibold text-[#FFF7E9] mt-1 tracking-wide">{s.label}</p>
                  <p className="text-[11px] text-[#E9D7B8]/80 font-sans tracking-wide mt-0.5">{s.sub}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right Column: Interactive Real-Time 3D Luxury Gift Box ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-6 w-full relative flex items-center justify-center"
          >
            {/* Atmospheric Warm Golden Studio Light Aura */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#C69A55]/20 via-[#4A1830]/35 to-transparent rounded-full blur-3xl pointer-events-none scale-110" />

            {/* Seamless 3D Stage */}
            <div className="relative w-full overflow-visible">
              <HeroGiftScene onBoxClick={scrollToWizard} />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div className="hidden lg:flex absolute bottom-4 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-sans uppercase tracking-widest text-luxury-muted">Scroll to Explore</span>
        <ArrowDown className="w-3.5 h-3.5 text-champagne animate-bounce" />
      </div>
    </section>
  );
}
