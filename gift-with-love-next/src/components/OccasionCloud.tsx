"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OccasionItem {
  id: string;
  label: string;
  icon: string;
  category?: string;
}

const OCCASIONS: OccasionItem[] = [
  { id: "birthday", label: "Birthday", icon: "🎂" },
  { id: "wedding", label: "Wedding", icon: "💍" },
  { id: "anniversary", label: "Anniversary", icon: "💐" },
  { id: "graduation", label: "Graduation", icon: "🎓" },
  { id: "mothers_day", label: "Mother's Day", icon: "🌸" },
  { id: "fathers_day", label: "Father's Day", icon: "👔" },
  { id: "valentines", label: "Valentine's Day", icon: "❤️" },
  { id: "diwali", label: "Diwali", icon: "🪔" },
  { id: "christmas", label: "Christmas", icon: "🎄" },
  { id: "eid", label: "Eid", icon: "🌙" },
  { id: "holi", label: "Holi", icon: "🎨" },
  { id: "raksha_bandhan", label: "Raksha Bandhan", icon: "🔗" },
  { id: "new_year", label: "New Year", icon: "🎆" },
  { id: "housewarming", label: "Housewarming", icon: "🏠" },
  { id: "farewell", label: "Farewell", icon: "👋" },
  { id: "promotion", label: "Promotion", icon: "🏆" },
  { id: "baby_shower", label: "Baby Shower", icon: "👶" },
  { id: "thank_you", label: "Thank You", icon: "🙏" },
];

interface OccasionCloudProps {
  selectedOccasion?: string;
  onSelectOccasion?: (occasionId: string) => void;
}

export const OccasionCloud: React.FC<OccasionCloudProps> = ({
  selectedOccasion,
  onSelectOccasion,
}) => {
  const [activeOccasion, setActiveOccasion] = useState<string | undefined>(selectedOccasion);

  const handleSelect = (id: string) => {
    const next = activeOccasion === id ? undefined : id;
    setActiveOccasion(next);
    if (next && onSelectOccasion) {
      onSelectOccasion(next);
    }
  };

  return (
    <section className="relative w-full py-16 sm:py-20 bg-white/70 border-y border-rose-150/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-burgundy-700 bg-rose-50 border border-rose-200 mb-3.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Curated Celebrations</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy-950 tracking-tight">
            What are you celebrating?
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-stone-600 font-sans">
            Select an occasion to instantly reveal thoughtful gifting suggestions crafted for that moment.
          </p>
        </div>

        {/* Interactive DaisyUI Tag Cloud with Spring Physics */}
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-3.5 max-w-5xl mx-auto">
          {OCCASIONS.map((occ, idx) => {
            const isSelected = activeOccasion === occ.id;

            return (
              <motion.button
                key={occ.id}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.02,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                whileHover={{
                  scale: 1.07,
                  y: -2,
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(occ.id)}
                className={cn(
                  "badge badge-lg gap-2.5 py-4 px-4.5 rounded-full transition-all duration-200 cursor-pointer text-sm font-semibold shadow-xs select-none",
                  isSelected
                    ? "badge-primary bg-gradient-to-r from-burgundy-900 to-burgundy-800 text-white border-burgundy-700 shadow-md shadow-burgundy-900/20 ring-2 ring-burgundy-500/30"
                    : "bg-canvas-light text-stone-700 border-rose-200 hover:bg-rose-50/80 hover:text-burgundy-900 hover:border-burgundy-300 hover:shadow-sm"
                )}
                aria-pressed={isSelected}
              >
                <span className="text-base" role="img" aria-label={occ.label}>
                  {occ.icon}
                </span>
                <span>{occ.label}</span>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4 rounded-full bg-rose-200/30 flex items-center justify-center"
                  >
                    <Check className="w-2.5 h-2.5 text-rose-100" />
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OccasionCloud;
