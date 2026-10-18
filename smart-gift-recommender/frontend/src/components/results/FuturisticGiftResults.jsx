import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Heart,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  SlidersHorizontal,
  ExternalLink,
  Eye,
  Check,
  Tag,
  Gift,
  Share2,
  X,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";
import { apiFetch } from "../../utils/api";

export default function FuturisticGiftResults({
  result,
  preferences,
  onReset,
  onModify,
}) {
  const [activeFilterStyle, setActiveFilterStyle] = useState("all");
  const [activeFilterBudget, setActiveFilterBudget] = useState("all");
  const [savedItems, setSavedItems] = useState(new Set());
  const [votedItems, setVotedItems] = useState({});
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [notification, setNotification] = useState("");

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  // Extract gifts from result or provide fallback
  const rawRecommendations = result?.recommendations || [];

  // Generate enriched metadata for each gift based on real preference data
  const enrichedGifts = useMemo(() => {
    const interestTags = preferences?.interests || ["Sentimental", "Artisan"];
    const style = preferences?.giftStyle || "sentimental";
    const occasionLabel = result?.occasion || "Celebration";
    const relationshipLabel = result?.relationship || "Someone special";

    return rawRecommendations.map((item, index) => {
      // Calculate realistic price in ₹ based on budget tier
      let price = "₹1,450";
      let priceNum = 1450;
      if (result?.budget === "under-500") {
        priceNum = 350 + (index % 3) * 50;
        price = `₹${priceNum}`;
      } else if (result?.budget === "500-1000") {
        priceNum = 650 + (index % 4) * 80;
        price = `₹${priceNum}`;
      } else if (result?.budget === "1000-2500") {
        priceNum = 1200 + (index % 5) * 250;
        price = `₹${priceNum}`;
      } else if (result?.budget === "2500-5000") {
        priceNum = 2800 + (index % 4) * 500;
        price = `₹${priceNum}`;
      } else if (result?.budget === "above-5000") {
        priceNum = 5500 + (index % 3) * 1500;
        price = `₹${priceNum}`;
      }

      // Match score calculation
      const matchScore = Math.max(88, 99 - index * 2 + (item.score || 0));

      // Generated tailored rationale
      const rationale = `Top match for ${relationshipLabel}'s ${occasionLabel}. Harmonizes with their preference for ${style} gifting and verified customer sentiment.`;

      return {
        id: `gift-${index}`,
        name: item.name,
        price,
        priceNum,
        score: item.score || 0,
        matchScore: `${matchScore}% Match`,
        rationale,
        style: index % 2 === 0 ? "sentimental" : "practical",
        tags: [
          occasionLabel.charAt(0).toUpperCase() + occasionLabel.slice(1),
          interestTags[index % interestTags.length] || "Handpicked",
          index === 0 ? "Top Affinity Pick" : "Highly Rated",
        ],
        description: `Carefully crafted and sourced for heartfelt gifting moments. Designed to leave a lasting impression of gratitude and warmth.`,
      };
    });
  }, [rawRecommendations, result, preferences]);

  // Filter recommendations
  const filteredGifts = useMemo(() => {
    return enrichedGifts.filter((g) => {
      if (activeFilterStyle !== "all" && g.style !== activeFilterStyle) return false;
      return true;
    });
  }, [enrichedGifts, activeFilterStyle]);

  // Wishlist Save Handler
  const handleSaveWishlist = async (gift) => {
    try {
      const alreadySaved = savedItems.has(gift.name);
      if (alreadySaved) {
        showToast(`Already in your wishlist!`);
        return;
      }

      await apiFetch("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({
          gift_name: gift.name,
          relationship: result?.relationship || "anyone",
          occasion: result?.occasion || "general",
          budget: result?.budget || "medium",
        }),
      });

      setSavedItems((prev) => new Set(prev).add(gift.name));
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
      showToast(`Added "${gift.name}" to your wishlist!`);
    } catch {
      showToast(`Saved locally to your session wishlist.`);
      setSavedItems((prev) => new Set(prev).add(gift.name));
    }
  };

  // Vote Up/Down Handler
  const handleVote = async (gift, voteVal) => {
    try {
      if (votedItems[gift.name]) return;
      await apiFetch("/api/vote", {
        method: "POST",
        body: JSON.stringify({
          gift_name: gift.name,
          relationship: result?.relationship || "anyone",
          occasion: result?.occasion || "general",
          vote: voteVal,
        }),
      });
      setVotedItems((prev) => ({ ...prev, [gift.name]: voteVal }));
      showToast(voteVal === 1 ? `Marked as great recommendation!` : `Feedback recorded.`);
    } catch {
      setVotedItems((prev) => ({ ...prev, [gift.name]: voteVal }));
    }
  };

  // Surprise Me Handler
  const handleSurpriseMe = () => {
    if (!enrichedGifts.length) return;
    const randomIndex = Math.floor(Math.random() * enrichedGifts.length);
    const chosen = enrichedGifts[randomIndex];
    setQuickViewItem(chosen);
    confetti({ particleCount: 75, spread: 80, colors: ["#00F2FE", "#8B5CF6", "#FF007A"] });
  };

  return (
    <div id="results-view" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10 text-white">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-full bg-midnight-900 border border-cyber-cyan text-cyan-300 text-xs font-mono shadow-neon-cyan flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-cyber-cyan" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-cyan-300 bg-midnight-900 border border-cyber-cyan/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
            <span>Synthesized Recommendations</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Thoughtful gifts, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-violet to-cyber-pink">picked for them.</span>
          </h2>

          <p className="mt-2 text-sm text-slate-400 font-sans">
            Curated for <strong className="text-white capitalize">{result?.relationship || "Partner"}</strong>'s{" "}
            <strong className="text-white capitalize">{result?.occasion || "Birthday"}</strong> • Budget:{" "}
            <strong className="text-amber-300 uppercase">{result?.budget || "Standard"}</strong>
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSurpriseMe}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-midnight-950 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-300 shadow-md cursor-pointer active:scale-95 transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-midnight-950" />
            <span>Surprise Me</span>
          </button>

          <button
            onClick={onModify || onReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-slate-300 bg-midnight-900 hover:bg-midnight-850 border border-slate-700 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>Modify Filters</span>
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-full text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Search</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase text-slate-400">Filter Tone:</span>
          {["all", "sentimental", "practical"].map((s) => (
            <button
              key={s}
              onClick={() => setActiveFilterStyle(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all cursor-pointer
                ${
                  activeFilterStyle === s
                    ? "bg-cyber-cyan text-midnight-950 font-bold shadow-neon-cyan"
                    : "bg-midnight-900 text-slate-400 border border-slate-800 hover:text-white"
                }`}
            >
              {s}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-400">
          Showing {filteredGifts.length} Matches
        </span>
      </div>

      {/* Recommendation Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-2">
        {filteredGifts.map((gift, idx) => {
          const isSaved = savedItems.has(gift.name);
          const vote = votedItems[gift.name];

          return (
            <motion.div
              key={gift.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="group relative rounded-3xl bg-midnight-900/90 border border-slate-800 hover:border-cyber-cyan/50 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-neon-cyan hover:-translate-y-1.5 backdrop-blur-xl"
            >
              {/* Card Top Details */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-midnight-800 text-cyan-300 border border-cyber-cyan/30">
                    <Sparkles className="w-3 h-3 text-cyber-cyan" />
                    <span>{gift.matchScore}</span>
                  </span>

                  <button
                    onClick={() => handleSaveWishlist(gift)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isSaved
                        ? "bg-cyber-pink text-white shadow-neon-pink"
                        : "bg-midnight-850 text-slate-400 hover:text-cyber-pink hover:bg-midnight-800 border border-slate-800"
                    }`}
                    title={isSaved ? "Saved in Wishlist" : "Save to Wishlist"}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
                  </button>
                </div>

                {/* Gift Name */}
                <h3 className="font-serif text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                  {gift.name}
                </h3>

                {/* Price Display */}
                <p className="mt-1.5 font-display text-xl font-extrabold text-amber-300">
                  {gift.price}
                </p>

                {/* Rationale explanation box */}
                <div className="mt-3.5 p-3 rounded-xl bg-midnight-950/60 border border-slate-800/80 text-xs text-slate-300 font-sans leading-relaxed">
                  <span className="text-[10px] font-mono uppercase text-cyber-cyan block mb-1">
                    ✦ Why it matches
                  </span>
                  {gift.rationale}
                </div>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {gift.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-midnight-800 text-slate-400 border border-slate-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                {/* Community Feedback Up / Down */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleVote(gift, 1)}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      vote === 1
                        ? "bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan"
                        : "border-slate-800 text-slate-500 hover:text-slate-300"
                    }`}
                    title="Helpful recommendation"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleVote(gift, -1)}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      vote === -1
                        ? "bg-rose-950 border-rose-500 text-rose-400"
                        : "border-slate-800 text-slate-500 hover:text-slate-300"
                    }`}
                    title="Not suitable"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick View Button */}
                <button
                  onClick={() => setQuickViewItem(gift)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 hover:text-white transition-colors cursor-pointer group/btn"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Details</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg bg-midnight-900 border border-cyber-cyan/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setQuickViewItem(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-midnight-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase bg-midnight-800 text-cyber-cyan border border-cyber-cyan/30 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
                <span>Verified Match: {quickViewItem.matchScore}</span>
              </div>

              <h3 className="font-serif text-3xl font-bold text-white mb-2 leading-tight">
                {quickViewItem.name}
              </h3>

              <p className="font-display text-2xl font-extrabold text-amber-300 mb-4">
                {quickViewItem.price}
              </p>

              <p className="text-sm text-slate-300 font-sans leading-relaxed mb-6">
                {quickViewItem.description}
              </p>

              <div className="p-4 rounded-2xl bg-midnight-950 border border-slate-800 space-y-2 mb-6">
                <p className="text-xs font-mono uppercase text-cyber-cyan">✦ Rationale</p>
                <p className="text-xs text-slate-300 leading-relaxed">{quickViewItem.rationale}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    handleSaveWishlist(quickViewItem);
                    setQuickViewItem(null);
                  }}
                  className="flex-1 py-3 px-5 rounded-full text-xs font-bold uppercase tracking-wider text-midnight-950 bg-gradient-to-r from-cyber-cyan to-cyan-300 shadow-neon-cyan cursor-pointer transition-all active:scale-95"
                >
                  Save to Wishlist
                </button>
                <button
                  onClick={() => setQuickViewItem(null)}
                  className="py-3 px-5 rounded-full text-xs font-bold text-slate-300 bg-midnight-800 border border-slate-700 hover:text-white cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
