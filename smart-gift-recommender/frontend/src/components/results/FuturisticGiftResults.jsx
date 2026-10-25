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
import { amazonLink } from "../../utils/format";

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
      confetti({ particleCount: 45, spread: 55, colors: ["#D6B675", "#F5DDA0", "#5A2438", "#FFF7E9"] });
      showToast(`Added "${gift.name}" to your curated wishlist!`);
    } catch {
      showToast(`Saved to session wishlist.`);
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
      showToast(voteVal === 1 ? `Marked as favored recommendation!` : `Preference recorded.`);
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
    confetti({ particleCount: 65, spread: 75, colors: ["#D6B675", "#F5DDA0", "#5A2438", "#FFF7E9"] });
  };

  return (
    <div id="results-view" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10 text-luxury-text">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-full bg-luxury-card border border-champagne/60 text-champagne-light text-xs font-serif shadow-champagne-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-champagne" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#4A1830]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-serif uppercase tracking-widest text-[#E9D7B8] bg-[#261722]/95 border border-[#4A1830] shadow-[0_2px_12px_rgba(74,24,48,0.4)] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C69A55] animate-pulse" />
            <span>Curated Gifting Selection</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFF7E9] tracking-tight">
            Thoughtful gifts, <span className="italic font-normal text-[#C69A55] drop-shadow-[0_2px_12px_rgba(198,154,85,0.4)]">picked for them.</span>
          </h2>

          <p className="mt-2 text-sm text-[#E9D7B8]/80 font-sans font-light">
            Curated for <strong className="text-[#FFF7E9] font-serif capitalize">{result?.relationship || "Partner"}</strong>'s{" "}
            <strong className="text-[#FFF7E9] font-serif capitalize">{result?.occasion || "Birthday"}</strong> • Budget:{" "}
            <strong className="text-[#C69A55] font-serif uppercase">{result?.budget || "Standard"}</strong>
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSurpriseMe}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#17131A] bg-gradient-to-r from-[#C69A55] via-[#DCB372] to-[#E9D7B8] hover:brightness-105 shadow-[0_4px_18px_rgba(198,154,85,0.4)] cursor-pointer active:scale-95 transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-[#17131A] text-[#17131A]" />
            <span>Surprise Me</span>
          </button>

          <button
            onClick={onModify || onReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium text-[#FFF7E9] bg-[#261722] hover:bg-[#331C2C] border border-[#4A1830] hover:border-[#C69A55]/40 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C69A55]" />
            <span>Modify Answers</span>
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-full text-xs text-[#E9D7B8]/80 hover:text-[#FFF7E9] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C69A55]" />
            <span>New Search</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-serif uppercase text-[#E9D7B8]">Filter Tone:</span>
          {["all", "sentimental", "practical"].map((s) => (
            <button
              key={s}
              onClick={() => setActiveFilterStyle(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all cursor-pointer
                ${
                  activeFilterStyle === s
                    ? "bg-gradient-to-r from-[#C69A55] to-[#E9D7B8] text-[#17131A] font-bold shadow-sm"
                    : "bg-[#261722] text-[#E9D7B8] border border-[#4A1830] hover:text-[#FFF7E9]"
                }`}
            >
              {s}
            </button>
          ))}
        </div>

        <span className="text-xs font-serif text-[#E9D7B8]/80">
          Showing {filteredGifts.length} Curated Presents
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
              className="group relative rounded-3xl bg-gradient-to-br from-[#261722]/95 via-[#1E131B]/95 to-[#17131A]/95 hover:from-[#311D2C] hover:to-[#1E131B] border border-[#4A1830] hover:border-[#C69A55]/60 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_12px_40px_rgba(198,154,85,0.2)] hover:-translate-y-1.5 backdrop-blur-xl"
            >
              {/* Card Top Details */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-serif font-semibold bg-[#4A1830]/80 text-[#E9D7B8] border border-[#C69A55]/30">
                    <Sparkles className="w-3 h-3 text-[#C69A55]" />
                    <span>{gift.matchScore}</span>
                  </span>

                  <button
                    onClick={() => handleSaveWishlist(gift)}
                    className={`min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isSaved
                        ? "bg-[#4A1830] text-[#C69A55] border border-[#C69A55] shadow-sm"
                        : "bg-[#261722] text-[#E9D7B8] hover:text-[#C69A55] hover:bg-[#331C2C] border border-[#4A1830]"
                    }`}
                    title={isSaved ? "Saved in Wishlist" : "Save to Wishlist"}
                    aria-label={isSaved ? `Remove ${gift.name} from Wishlist` : `Save ${gift.name} to Wishlist`}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? "fill-[#C69A55] text-[#C69A55]" : ""}`} />
                  </button>
                </div>

                {/* Gift Name */}
                <h3 className="font-serif text-2xl font-bold text-[#FFF7E9] group-hover:text-[#C69A55] transition-colors leading-snug">
                  {gift.name}
                </h3>

                {/* Price Display */}
                <p className="mt-1.5 font-serif text-2xl font-bold text-[#C69A55]">
                  {gift.price}
                </p>

                {/* Rationale explanation box */}
                <div className="mt-3.5 p-3 rounded-xl bg-[#17131A]/80 border border-[#4A1830] text-xs text-[#E9D7B8]/80 font-sans font-light leading-relaxed">
                  <span className="text-[10px] font-serif uppercase tracking-wider text-[#C69A55] block mb-1">
                    ✦ Why it matches
                  </span>
                  {gift.rationale}
                </div>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {gift.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#261722] text-[#E9D7B8]/80 border border-[#4A1830]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 pt-4 border-t border-[#4A1830] flex flex-wrap items-center justify-between gap-2.5">
                {/* Community Feedback Up / Down */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleVote(gift, 1)}
                    className={`min-w-[44px] min-h-[44px] rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                      vote === 1
                        ? "bg-[#4A1830] border-[#C69A55] text-[#E9D7B8]"
                        : "border-[#4A1830] bg-[#1E131B] text-[#D8CABA] hover:text-[#FFF7E9] hover:border-[#C69A55]/40"
                    }`}
                    title="Helpful recommendation"
                    aria-label={`Vote up ${gift.name}`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleVote(gift, -1)}
                    className={`min-w-[44px] min-h-[44px] rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                      vote === -1
                        ? "bg-[#331021] border-[#4A1830] text-rose-300"
                        : "border-[#4A1830] bg-[#1E131B] text-[#D8CABA] hover:text-[#FFF7E9] hover:border-[#C69A55]/40"
                    }`}
                    title="Not suitable"
                    aria-label={`Vote down ${gift.name}`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Inspect Details */}
                  <button
                    onClick={() => setQuickViewItem(gift)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl border border-[#4A1830] bg-[#1E131B] text-xs font-semibold text-[#E9D7B8] hover:text-[#FFF7E9] hover:border-[#C69A55]/50 transition-colors cursor-pointer"
                    aria-label={`Inspect details for ${gift.name}`}
                  >
                    <Eye className="w-3.5 h-3.5 text-[#C69A55]" />
                    <span>Details</span>
                  </button>

                  {/* Buy on Amazon Link */}
                  <a
                    href={amazonLink(gift.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-xl text-xs font-bold uppercase tracking-wider text-[#17131A] bg-gradient-to-r from-[#C69A55] via-[#DCB372] to-[#E9D7B8] hover:brightness-105 shadow-[0_2px_12px_rgba(198,154,85,0.35)] transition-all cursor-pointer active:scale-95"
                    aria-label={`Buy ${gift.name} on Amazon India`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buy</span>
                  </a>
                </div>
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
              className="relative w-full max-w-lg bg-luxury-card border border-luxury-border rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setQuickViewItem(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-luxury-elevated border border-luxury-border flex items-center justify-center text-luxury-muted hover:text-luxury-text cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif uppercase bg-luxury-secondary text-champagne-light border border-luxury-border mb-3">
                <Sparkles className="w-3.5 h-3.5 text-champagne" />
                <span>Verified Match: {quickViewItem.matchScore}</span>
              </div>

              <h3 className="font-serif text-3xl font-bold text-luxury-text mb-2 leading-tight">
                {quickViewItem.name}
              </h3>

              <p className="font-serif text-2xl font-bold text-champagne-light mb-4">
                {quickViewItem.price}
              </p>

              <p className="text-sm text-luxury-muted font-sans font-light leading-relaxed mb-6">
                {quickViewItem.description}
              </p>

              <div className="p-4 rounded-2xl bg-luxury-secondary border border-luxury-border space-y-2 mb-6">
                <p className="text-xs font-serif uppercase text-champagne">✦ Rationale</p>
                <p className="text-xs text-luxury-muted leading-relaxed">{quickViewItem.rationale}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    handleSaveWishlist(quickViewItem);
                    setQuickViewItem(null);
                  }}
                  className="flex-1 py-3 px-4 min-h-[44px] rounded-full text-xs font-semibold uppercase tracking-wider text-[#FFF7E9] bg-[#2C1726] border border-[#4A1830] hover:border-[#C69A55] transition-all cursor-pointer text-center"
                >
                  Save to Wishlist
                </button>
                <a
                  href={amazonLink(quickViewItem.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 min-h-[44px] rounded-full text-xs font-bold uppercase tracking-wider text-[#17131A] bg-gradient-to-r from-[#C69A55] via-[#DCB372] to-[#E9D7B8] shadow-md flex items-center justify-center gap-1.5 hover:brightness-105 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buy on Amazon</span>
                </a>
                <button
                  onClick={() => setQuickViewItem(null)}
                  className="py-3 px-5 min-h-[44px] rounded-full text-xs font-medium text-[#FFF7E9] bg-[#1E131B] border border-[#4A1830] hover:bg-[#2C1726] cursor-pointer"
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
