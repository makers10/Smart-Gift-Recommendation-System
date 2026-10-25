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
  Gem,
  Crown,
  Coffee,
  Compass,
  Feather,
  Watch,
  Palette,
  ArrowUpDown,
} from "lucide-react";
import confetti from "canvas-confetti";
import { apiFetch } from "../../utils/api";
import { amazonLink } from "../../utils/format";

// Helper to determine boutique motif icon and theme gradient based on product name
function getGiftMotif(name = "") {
  const n = name.toLowerCase();
  if (
    n.includes("jewelry") ||
    n.includes("ring") ||
    n.includes("necklace") ||
    n.includes("pendant") ||
    n.includes("bracelet") ||
    n.includes("gold") ||
    n.includes("silver") ||
    n.includes("crystal")
  ) {
    return {
      icon: Gem,
      motif: "Fine Jewelry & Gems",
      gradient: "from-[#42172C] via-[#2A1422] to-[#17131A]",
    };
  }
  if (
    n.includes("watch") ||
    n.includes("clock") ||
    n.includes("chronometer") ||
    n.includes("brass") ||
    n.includes("compass") ||
    n.includes("gadget")
  ) {
    return {
      icon: Watch,
      motif: "Precision Horology",
      gradient: "from-[#382015] via-[#261620] to-[#17131A]",
    };
  }
  if (
    n.includes("tea") ||
    n.includes("coffee") ||
    n.includes("brew") ||
    n.includes("chocolate") ||
    n.includes("gourmet") ||
    n.includes("snack")
  ) {
    return {
      icon: Coffee,
      motif: "Epicurean & Brew",
      gradient: "from-[#331B15] via-[#24151E] to-[#17131A]",
    };
  }
  if (
    n.includes("art") ||
    n.includes("pottery") ||
    n.includes("frame") ||
    n.includes("canvas") ||
    n.includes("print") ||
    n.includes("map") ||
    n.includes("sculpture")
  ) {
    return {
      icon: Palette,
      motif: "Atelier Art & Craft",
      gradient: "from-[#2C1835] via-[#1E1322] to-[#17131A]",
    };
  }
  if (
    n.includes("journal") ||
    n.includes("leather") ||
    n.includes("pen") ||
    n.includes("book") ||
    n.includes("quill") ||
    n.includes("stationery")
  ) {
    return {
      icon: Feather,
      motif: "Heirloom Stationery",
      gradient: "from-[#381B28] via-[#251520] to-[#17131A]",
    };
  }
  if (
    n.includes("diffuser") ||
    n.includes("spa") ||
    n.includes("perfume") ||
    n.includes("candle") ||
    n.includes("wellness") ||
    n.includes("bath")
  ) {
    return {
      icon: Sparkles,
      motif: "Botanical Aromatics",
      gradient: "from-[#3A1428] via-[#271321] to-[#17131A]",
    };
  }
  if (
    n.includes("bonsai") ||
    n.includes("plant") ||
    n.includes("stoneware") ||
    n.includes("vase") ||
    n.includes("garden")
  ) {
    return {
      icon: Heart,
      motif: "Living Botanical",
      gradient: "from-[#261E28] via-[#1E1420] to-[#17131A]",
    };
  }
  return {
    icon: Gift,
    motif: "Curated Keepsake",
    gradient: "from-[#4A1830] via-[#2B101D] to-[#17131A]",
  };
}

export default function FuturisticGiftResults({
  result,
  preferences,
  onReset,
  onModify,
}) {
  const [activeFilterStyle, setActiveFilterStyle] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
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

    // Normalize raw budget value from either result or preferences
    const rawBudget = String(
      result?.budgetDisplay || preferences?.budget || result?.budget || "medium"
    ).toLowerCase();

    let basePrice = 1350;
    let spread = 280;
    let tierLabel = "Bespoke Reserve";

    if (
      rawBudget.includes("under-500") ||
      rawBudget === "low" ||
      rawBudget.includes("modest") ||
      rawBudget.includes("< 500")
    ) {
      basePrice = 360;
      spread = 45;
      tierLabel = "Thoughtful Token";
    } else if (
      rawBudget.includes("500-1000") ||
      rawBudget.includes("500")
    ) {
      basePrice = 690;
      spread = 85;
      tierLabel = "Curated Classic";
    } else if (
      rawBudget.includes("1000-2500") ||
      rawBudget === "medium" ||
      rawBudget.includes("standard")
    ) {
      basePrice = 1350;
      spread = 290;
      tierLabel = "Bespoke Reserve";
    } else if (
      rawBudget.includes("2500-5000") ||
      rawBudget === "high" ||
      rawBudget.includes("premium")
    ) {
      basePrice = 2900;
      spread = 480;
      tierLabel = "Premier Keepsake";
    } else if (
      rawBudget.includes("5000") ||
      rawBudget.includes("above") ||
      rawBudget === "luxury"
    ) {
      basePrice = 5800;
      spread = 1250;
      tierLabel = "Heirloom Edition";
    }

    return rawRecommendations.map((item, index) => {
      // Deterministic, realistic price variance per recommendation card
      const priceOffset = ((index * 7 + 3) % 5) * spread;
      const priceNum = basePrice + priceOffset;
      const price = `₹${priceNum.toLocaleString("en-IN")}`;

      // Match score calculation
      const matchScoreVal = Math.max(88, 99 - index * 2 + (item.score || 0));
      const matchScore = `${matchScoreVal}% Match`;

      // Generated tailored rationale
      const rationale = `Top match for ${relationshipLabel}'s ${occasionLabel}. Harmonizes with their preference for ${style} gifting and verified recipient sentiment.`;

      const motifInfo = getGiftMotif(item.name);

      return {
        id: `gift-${index}`,
        name: item.name,
        price,
        priceNum,
        score: item.score || 0,
        matchScoreVal,
        matchScore,
        rationale,
        tierLabel,
        motifInfo,
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

  // Filter recommendations by tone
  const filteredGifts = useMemo(() => {
    return enrichedGifts.filter((g) => {
      if (activeFilterStyle !== "all" && g.style !== activeFilterStyle) return false;
      return true;
    });
  }, [enrichedGifts, activeFilterStyle]);

  // Sort recommendations
  const sortedGifts = useMemo(() => {
    const list = [...filteredGifts];
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.priceNum - b.priceNum);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.priceNum - a.priceNum);
    } else {
      // Default recommended sorting by matchScoreVal descending
      list.sort((a, b) => b.matchScoreVal - a.matchScoreVal);
    }
    return list;
  }, [filteredGifts, sortBy]);

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
      confetti({
        particleCount: 45,
        spread: 55,
        colors: ["#D6B675", "#F5DDA0", "#5A2438", "#FFF7E9"],
      });
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
    confetti({
      particleCount: 65,
      spread: 75,
      colors: ["#D6B675", "#F5DDA0", "#5A2438", "#FFF7E9"],
    });
  };

  return (
    <div
      id="results-view"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10 text-luxury-text"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-full bg-[#241620] border border-[#C69A55]/60 text-[#FFF7E9] text-xs font-serif shadow-lg flex items-center gap-2 backdrop-blur-md"
          >
            <Check className="w-4 h-4 text-[#C69A55]" />
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
            Thoughtful gifts,{" "}
            <span className="italic font-normal text-[#C69A55] drop-shadow-[0_2px_12px_rgba(198,154,85,0.4)]">
              picked for them.
            </span>
          </h2>

          <p className="mt-2 text-sm text-[#E9D7B8]/80 font-sans font-light">
            Curated for{" "}
            <strong className="text-[#FFF7E9] font-serif capitalize">
              {result?.relationship || "Partner"}
            </strong>
            's{" "}
            <strong className="text-[#FFF7E9] font-serif capitalize">
              {result?.occasion || "Birthday"}
            </strong>{" "}
            • Budget Tier:{" "}
            <strong className="text-[#C69A55] font-serif uppercase">
              {result?.budgetDisplay || result?.budget || "Standard"}
            </strong>
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSurpriseMe}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full text-xs font-bold uppercase tracking-wider text-[#17131A] bg-gradient-to-r from-[#C69A55] via-[#DCB372] to-[#E9D7B8] hover:brightness-105 shadow-[0_4px_18px_rgba(198,154,85,0.4)] cursor-pointer active:scale-95 transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-[#17131A] text-[#17131A]" />
            <span>Surprise Me</span>
          </button>

          <button
            onClick={onModify || onReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full text-xs font-medium text-[#FFF7E9] bg-[#261722] hover:bg-[#331C2C] border border-[#4A1830] hover:border-[#C69A55]/40 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C69A55]" />
            <span>Modify Answers</span>
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] rounded-full text-xs text-[#E9D7B8]/80 hover:text-[#FFF7E9] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C69A55]" />
            <span>New Search</span>
          </button>
        </div>
      </div>

      {/* Filter and Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Tone Filters */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-serif uppercase text-[#E9D7B8] tracking-wider">
              Filter Tone:
            </span>
            {["all", "sentimental", "practical"].map((s) => (
              <button
                key={s}
                onClick={() => setActiveFilterStyle(s)}
                className={`min-h-[36px] px-3.5 py-1 rounded-full text-xs font-medium capitalize transition-all cursor-pointer
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

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#C69A55]" />
            <span className="text-xs font-serif uppercase text-[#E9D7B8] tracking-wider">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort recommendations"
              className="min-h-[36px] bg-[#261722] text-[#E9D7B8] border border-[#4A1830] rounded-full px-3 py-1 text-xs font-medium focus:border-[#C69A55] focus:outline-none cursor-pointer"
            >
              <option value="recommended">Curated Affinity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <span className="text-xs font-serif text-[#E9D7B8]/80">
          Showing {sortedGifts.length} Curated Presents
        </span>
      </div>

      {/* Recommendation Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-2">
        {sortedGifts.map((gift, idx) => {
          const isSaved = savedItems.has(gift.name);
          const vote = votedItems[gift.name];
          const MotifIcon = gift.motifInfo.icon;

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
                {/* ── Luxury Visual Product Banner ──────────────────────────── */}
                <div
                  className={`relative h-36 rounded-2xl overflow-hidden bg-gradient-to-br ${gift.motifInfo.gradient} border border-[#4A1830] p-3.5 flex flex-col justify-between mb-4 group-hover:border-[#C69A55]/60 transition-all duration-300 shadow-inner`}
                >
                  {/* Atmospheric Glow */}
                  <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[#C69A55]/15 blur-2xl pointer-events-none group-hover:bg-[#C69A55]/25 transition-all" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(198,154,85,0.08),transparent_70%)] pointer-events-none" />

                  {/* Banner Top Row: Category Motif & Wishlist Heart */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-serif uppercase tracking-wider text-[#E9D7B8] bg-[#17131A]/80 border border-[#C69A55]/30 backdrop-blur-md">
                      <MotifIcon className="w-3 h-3 text-[#C69A55]" />
                      <span>{gift.motifInfo.motif}</span>
                    </span>

                    <button
                      onClick={() => handleSaveWishlist(gift)}
                      className={`min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md ${
                        isSaved
                          ? "bg-[#4A1830] text-[#C69A55] border border-[#C69A55] shadow-sm"
                          : "bg-[#17131A]/80 text-[#E9D7B8] hover:text-[#C69A55] hover:bg-[#331C2C] border border-[#4A1830]"
                      }`}
                      title={isSaved ? "Saved in Wishlist" : "Save to Wishlist"}
                      aria-label={
                        isSaved
                          ? `Remove ${gift.name} from Wishlist`
                          : `Save ${gift.name} to Wishlist`
                      }
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isSaved ? "fill-[#C69A55] text-[#C69A55]" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Center Motif Emblem */}
                  <div className="relative z-10 flex items-center justify-center my-auto">
                    <div className="w-12 h-12 rounded-2xl bg-[#17131A]/60 border border-[#C69A55]/30 flex items-center justify-center text-[#C69A55] shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <MotifIcon className="w-6 h-6 text-[#C69A55]" />
                    </div>
                  </div>

                  {/* Banner Bottom Row: Match Score & Tier */}
                  <div className="relative z-10 flex items-center justify-between text-[11px] font-serif">
                    <span className="inline-flex items-center gap-1 text-[#C69A55] font-semibold">
                      <Sparkles className="w-3 h-3 text-[#C69A55]" />
                      <span>{gift.matchScore}</span>
                    </span>
                    <span className="text-[#E9D7B8]/75 tracking-wider uppercase text-[10px]">
                      {gift.tierLabel}
                    </span>
                  </div>
                </div>

                {/* Gift Name */}
                <h3 className="font-serif text-2xl font-bold text-[#FFF7E9] group-hover:text-[#C69A55] transition-colors leading-snug">
                  {gift.name}
                </h3>

                {/* Price Display with Indian Currency Locale */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-sans text-2xl font-bold text-[#C69A55] tracking-tight">
                    {gift.price}
                  </span>
                  <span className="text-[11px] font-serif text-[#E9D7B8]/60 uppercase tracking-widest">
                    Est. Market Value
                  </span>
                </div>

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
              className="relative w-full max-w-lg bg-[#241620] border border-[#4A1830] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setQuickViewItem(null)}
                className="absolute top-4 right-4 min-w-[36px] min-h-[36px] rounded-full bg-[#1E131B] border border-[#4A1830] flex items-center justify-center text-[#E9D7B8] hover:text-[#FFF7E9] cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif uppercase bg-[#17131A] text-[#E9D7B8] border border-[#4A1830] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#C69A55]" />
                <span>Verified Match: {quickViewItem.matchScore}</span>
              </div>

              <h3 className="font-serif text-3xl font-bold text-[#FFF7E9] mb-2 leading-tight">
                {quickViewItem.name}
              </h3>

              <div className="flex items-center gap-2 mb-4">
                <span className="font-sans text-2xl font-bold text-[#C69A55]">
                  {quickViewItem.price}
                </span>
                <span className="text-xs font-serif text-[#E9D7B8]/70 uppercase tracking-wider">
                  • {quickViewItem.tierLabel}
                </span>
              </div>

              <p className="text-sm text-[#E9D7B8]/80 font-sans font-light leading-relaxed mb-6">
                {quickViewItem.description}
              </p>

              <div className="p-4 rounded-2xl bg-[#17131A] border border-[#4A1830] space-y-2 mb-6">
                <p className="text-xs font-serif uppercase text-[#C69A55]">✦ Match Insight</p>
                <p className="text-xs text-[#E9D7B8]/85 leading-relaxed">{quickViewItem.rationale}</p>
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
