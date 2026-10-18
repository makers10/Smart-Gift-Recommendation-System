"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, HeartHandshake } from "lucide-react";
import SpotlightCard from "./ui/SpotlightCard";

interface RelationshipItem {
  id: string;
  label: string;
  subtitle: string;
  badge: string;
  avatar: string;
  accent: string;
}

const RELATIONSHIPS: RelationshipItem[] = [
  {
    id: "mom",
    label: "Mom",
    subtitle: "Celebrate the woman whose love knows no bounds.",
    badge: "Most Cherished",
    avatar: "👩‍👧",
    accent: "from-rose-500/10 to-amber-500/10",
  },
  {
    id: "partner",
    label: "Partner",
    subtitle: "For the soul who makes every ordinary day feel magical.",
    badge: "Romantic",
    avatar: "💍",
    accent: "from-burgundy-500/15 to-rose-500/10",
  },
  {
    id: "best_friend",
    label: "Best Friend",
    subtitle: "They deserve something as extraordinary and bold as they are.",
    badge: "Soul Connection",
    avatar: "✨",
    accent: "from-amber-500/15 to-rose-400/10",
  },
  {
    id: "sister",
    label: "Sister",
    subtitle: "Your forever confidante, first friend, and partner in crime.",
    badge: "Lifelong Bond",
    avatar: "🌸",
    accent: "from-pink-500/15 to-rose-500/10",
  },
  {
    id: "dad",
    label: "Dad",
    subtitle: "The anchor who quietly moves mountains with steadfast strength.",
    badge: "Heritage & Honor",
    avatar: "👔",
    accent: "from-stone-500/15 to-amber-500/10",
  },
  {
    id: "colleague",
    label: "Colleague",
    subtitle: "A polished, thoughtful gesture for a respected workmate.",
    badge: "Professional",
    avatar: "💼",
    accent: "from-rose-400/10 to-stone-400/10",
  },
];

interface RelationshipGridProps {
  onSelectRelationship?: (relationshipId: string) => void;
}

export const RelationshipGrid: React.FC<RelationshipGridProps> = ({
  onSelectRelationship,
}) => {
  return (
    <section className="relative w-full py-20 lg:py-28 bg-canvas-warm/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-burgundy-700 bg-rose-100/70 border border-rose-200 mb-3.5">
            <HeartHandshake className="w-3.5 h-3.5 text-burgundy-700" />
            <span>Honoring Connections</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy-950 tracking-tight">
            Who are you gifting today?
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-stone-600 font-sans">
            Every bond has its own language. Select a relationship to find tailored expressions of love and appreciation.
          </p>
        </div>

        {/* 6 Interactive Spotlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {RELATIONSHIPS.map((rel, idx) => (
            <motion.div
              key={rel.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <SpotlightCard
                enableTilt={false}
                spotlightColor="rgba(190, 18, 60, 0.12)"
                className="group h-full flex flex-col justify-between p-7 rounded-2xl bg-white/90 border-rose-200/70 hover:border-burgundy-600/30 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl"
                onClick={() => onSelectRelationship?.(rel.id)}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl p-2.5 rounded-xl bg-canvas-warm/80 border border-rose-100/80 shadow-2xs group-hover:scale-110 transition-transform duration-300">
                      {rel.avatar}
                    </span>
                    <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-rose-50 text-burgundy-800 border border-rose-200">
                      {rel.badge}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-burgundy-950 group-hover:text-burgundy-700 transition-colors">
                    {rel.label}
                  </h3>

                  <p className="mt-2 text-sm text-stone-600 leading-relaxed font-sans">
                    {rel.subtitle}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-rose-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-burgundy-800 group-hover:text-burgundy-900 transition-colors">
                    Explore gifts
                  </span>
                  <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-burgundy-800 group-hover:bg-burgundy-800 group-hover:text-white group-hover:translate-x-1 transition-all duration-200">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelationshipGrid;
