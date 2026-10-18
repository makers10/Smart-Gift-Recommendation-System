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
    <section className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden bg-luxury-main text-luxury-text pt-8 pb-16 lg:py-20">
      
      {/* Studio Radial Champagne & Burgundy Atmosphere Gradients */}
      <div className="absolute top-1/4 right-1/4 w-[550px] h-[550px] bg-champagne-glow blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/6 w-[480px] h-[480px] bg-luxury-burgundy/25 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[650px] h-[250px] bg-luxury-rose/10 blur-[130px] rounded-full pointer-events-none" />

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
              <div className="relative inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-serif uppercase tracking-widest text-champagne-light bg-luxury-card/90 border border-luxury-border shadow-champagne-sm overflow-hidden backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-champagne animate-pulse" />
                <span>GIFTVERSE • The Art of Thoughtful Gifting</span>
              </div>
            </motion.div>

            {/* Oversized Cinematic Editorial Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-luxury-text leading-[1.06] mb-6"
            >
              Every Gift Has{" "}
              <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-champagne via-champagne-light to-[#fcf5e5]">
                a Story.
              </span>
            </motion.h1>

            {/* Refined Supporting Copy */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-luxury-muted font-sans font-light leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Discover thoughtful gifts for the people who matter most. Step into a
              refined universe where each recommendation feels curated, personal, and unforgettable.
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
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-sm font-semibold tracking-wider text-luxury-main bg-gradient-to-r from-champagne to-champagne-light hover:brightness-105 shadow-champagne-glow transition-all duration-300 cursor-pointer"
              >
                <Gift className="w-4 h-4 text-luxury-main transition-transform group-hover:rotate-12" />
                <span>Find the Perfect Gift</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToCategories}
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full text-sm font-medium text-luxury-text bg-luxury-card/85 hover:bg-luxury-elevated border border-luxury-border hover:border-champagne/60 shadow-md backdrop-blur-md transition-all duration-300 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-champagne transition-transform group-hover:rotate-45" />
                <span>Explore Gift Ideas</span>
              </motion.button>
            </motion.div>

            {/* Curated Stats Row with Champagne Typography */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-luxury-border/80 text-center lg:text-left"
            >
              {[
                { value: "282+", label: "Curated Presents", sub: "Handpicked" },
                { value: "20+", label: "Relationships", sub: "Tailored" },
                { value: "34+", label: "Celebrations", sub: "Milestones" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-champagne-light to-luxury-text">
                    {s.value}
                  </p>
                  <p className="text-xs font-medium text-luxury-text mt-0.5">{s.label}</p>
                  <p className="text-[10px] text-luxury-muted font-sans tracking-wide">{s.sub}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right Column: Interactive Real-Time 3D Luxury Gift Box ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-6 w-full relative"
          >
            {/* Atmospheric Studio Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-champagne-glow via-luxury-burgundy/20 to-transparent rounded-3xl blur-3xl pointer-events-none" />

            {/* Seamless 3D Stage Frame */}
            <div className="relative rounded-3xl bg-luxury-card/40 border border-luxury-border/70 backdrop-blur-md overflow-hidden shadow-2xl">
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
