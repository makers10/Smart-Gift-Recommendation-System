"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scissors, FileText, Gift, Sparkles, ArrowRight, MessageSquareQuote } from "lucide-react";
import BorderBeam from "./ui/BorderBeam";

interface BespokeStepperProps {
  onExploreCustom?: () => void;
}

export const BespokeStepper: React.FC<BespokeStepperProps> = ({
  onExploreCustom,
}) => {
  const steps = [
    {
      num: "01",
      icon: <FileText className="w-6 h-6 text-burgundy-700" />,
      title: "Post a Request",
      desc: "Share your vision, preferred materials, sentimental details, and budget parameters with our atelier.",
    },
    {
      num: "02",
      icon: <MessageSquareQuote className="w-6 h-6 text-amber-600" />,
      title: "Receive Bespoke Offers",
      desc: "Master artisans and boutique makers present bespoke sketches, timelines, and personalized proposals.",
    },
    {
      num: "03",
      icon: <Gift className="w-6 h-6 text-emerald-700" />,
      title: "Get it Made & Hand-Delivered",
      desc: "Directly collaborate with your artisan, track progress, and receive a one-of-a-kind heirloom.",
    },
  ];

  return (
    <section id="custom-made-section" className="relative w-full py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-canvas-warm/50 via-white to-canvas-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Card */}
        <div className="relative rounded-3xl bg-gradient-to-br from-rose-950 via-burgundy-900 to-burgundy-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden mb-16">
          {/* Ambient luminous glow */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 rounded-full bg-gradient-to-br from-amber-400/20 via-rose-500/20 to-transparent blur-3xl pointer-events-none" />
          <BorderBeam size={350} duration={16} colorFrom="#F59E0B" colorTo="#FDA4AF" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 text-rose-200 border border-white/20 mb-4 backdrop-blur-sm">
                <Scissors className="w-3.5 h-3.5 text-amber-300" />
                <span>Custom Made Marketplace</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
                Something one-of-a-kind?
              </h2>
              <p className="text-base sm:text-lg text-rose-100/90 leading-relaxed font-sans">
                Post your custom gift concept to our curated network of jewelers, calligraphers,
                leather crafters, and woodworkers. Get an original masterpiece crafted specifically for your story.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={onExploreCustom}
              className="shrink-0 inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-bold text-burgundy-950 bg-gradient-to-r from-amber-200 via-rose-100 to-amber-200 hover:from-amber-100 hover:to-rose-50 shadow-xl shadow-black/20 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 text-burgundy-800" />
              <span>Explore Custom Gifts</span>
              <ArrowRight className="w-5 h-5 text-burgundy-800" />
            </motion.button>
          </div>
        </div>

        {/* 3-Step Interactive Roadmap with Animated SVG Timeline */}
        <div className="relative">
          {/* Animated Connecting Timeline line on desktop */}
          <div className="hidden md:block absolute top-1/2 left-[12%] right-[12%] -translate-y-8 h-0.5 z-0">
            <svg className="w-full h-8 overflow-visible" fill="none">
              <path
                d="M 0 12 H 1000"
                stroke="url(#dashedGradient)"
                strokeWidth="2.5"
                strokeDasharray="8 8"
                className="animate-[pulseSubtle_3s_infinite_ease-in-out]"
              />
              <defs>
                <linearGradient id="dashedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#881337" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#881337" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="group relative bg-white rounded-3xl p-8 border border-rose-200/80 shadow-md hover:shadow-xl hover:border-burgundy-300 transition-all duration-300 text-center flex flex-col items-center"
              >
                {/* Step Pill */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-canvas-warm border border-rose-200 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-burgundy-900 text-white shadow-xs">
                    {step.num}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-burgundy-950 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed font-sans">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BespokeStepper;
