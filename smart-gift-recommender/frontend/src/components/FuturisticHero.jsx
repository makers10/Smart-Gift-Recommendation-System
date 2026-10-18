import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ArrowDown, Gift, Compass, ShieldCheck, Zap } from "lucide-react";
import HeroGiftScene from "./3d/HeroGiftScene";

export default function FuturisticHero({ onFindGiftClick, onExploreClick }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
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
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-midnight-950 text-white pt-8 pb-16 lg:py-20">
      
      {/* Dynamic Cosmic Gradient Mesh & Stars */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyber-cyan/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-cyber-violet/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-cyber-pink/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ── Left Column: Cinematic Headline & Actions ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 max-w-2xl text-center lg:text-left mx-auto lg:mx-0"
          >
            {/* Shimmer Cyber Badge */}
            <motion.div variants={itemVariants} className="inline-block mb-6">
              <div className="relative inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest text-cyan-300 bg-midnight-900/90 border border-cyber-cyan/40 shadow-neon-cyan overflow-hidden backdrop-blur-md">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite_linear] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
                <Sparkles className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
                <span>GIFTVERSE • 3D Discovery Universe</span>
              </div>
            </motion.div>

            {/* Oversized Cinematic Editorial Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-6"
            >
              Every Gift Has{" "}
              <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-violet to-cyber-pink">
                a Story.
              </span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Discover thoughtful gifts for the people who matter most. Step into an
              intelligent universe combining real-time 3D exploration with heartfelt sentiment.
            </motion.p>

            {/* Dual Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToWizard}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-sm font-extrabold uppercase tracking-wider text-midnight-950 bg-gradient-to-r from-cyber-cyan to-cyan-300 hover:from-cyan-300 hover:to-cyber-cyan shadow-neon-cyan transition-all duration-300 cursor-pointer"
              >
                <Gift className="w-4 h-4 text-midnight-950 transition-transform group-hover:rotate-12" />
                <span>Find the Perfect Gift</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToCategories}
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full text-sm font-bold text-slate-300 bg-midnight-900/80 hover:bg-midnight-850 hover:text-white border border-slate-700 hover:border-slate-500 shadow-md backdrop-blur-md transition-all duration-300 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-cyber-violet transition-transform group-hover:rotate-45" />
                <span>Explore Gift Ideas</span>
              </motion.button>
            </motion.div>

            {/* Live Stats Row with Luminous Counters */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-800/80 text-center lg:text-left"
            >
              {[
                { value: "282+", label: "Verified Gifts", sub: "Handpicked" },
                { value: "20+", label: "Relationships", sub: "Personalized" },
                { value: "34+", label: "Celebrations", sub: "Milestones" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-white">
                    {s.value}
                  </p>
                  <p className="text-xs font-semibold text-slate-300 mt-0.5">{s.label}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{s.sub}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right Column: Interactive Real-Time 3D WebGL Canvas ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-6 w-full relative"
          >
            {/* Luminous Glow Aura behind 3D Canvas */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/15 via-cyber-violet/20 to-cyber-pink/15 rounded-3xl blur-2xl pointer-events-none" />

            <div className="relative rounded-3xl bg-midnight-900/60 border border-slate-800/80 backdrop-blur-md overflow-hidden shadow-2xl">
              <HeroGiftScene onBoxClick={scrollToWizard} />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div className="hidden lg:flex absolute bottom-4 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Scroll to Explore</span>
        <ArrowDown className="w-3.5 h-3.5 text-cyber-cyan animate-bounce" />
      </div>
    </section>
  );
}
