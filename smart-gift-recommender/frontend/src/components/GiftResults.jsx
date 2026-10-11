/**
 * GiftResults — Gift with Love
 *
 * Displays gift recommendations after a successful GET /api/recommend call.
 *
 * Behaviour preserved exactly:
 *   - Recommendations sorted descending by community vote score
 *   - Vote (👍/👎) via POST /api/vote — one vote per gift per session
 *   - Score updates optimistically in UI
 *   - Save to Wishlist via POST /api/wishlist
 *   - "Buy on Amazon" → amazon.in search link (opens new tab)
 *   - "Search Again" button calls onReset() to return to Hero + GiftForm
 *
 * Design changes (Stage E):
 *   - Card and Button primitives used throughout
 *   - Badge primitive for score display
 *   - Emoji removed from button/action labels (V1 fix); aria-label used
 *   - Vote and wishlist buttons use aria-pressed / aria-label
 *   - "Top Pick" badge uses gold variant
 *   - Card accent bar uses brand burgundy-to-rose gradient
 *   - Results header uses design tokens + occasion emoji as decorative only
 *   - role="status" on feedback messages (A4 fix)
 */
import { useState } from "react";
import { apiFetch } from "../utils/api";
import { fmt, occasionEmojis, amazonLink } from "../utils/format";
import { Card } from "./ui/Card";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

// Inline SVG icons (Lucide-style)
function IconThumbUp({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
    </svg>
  );
}

function IconThumbDown({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/>
      <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
    </svg>
  );
}

function IconHeart({ filled = false, className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function IconShoppingBag({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}

function IconArrowLeft({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  );
}

function IconGift({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polyline points="20 12 20 22 4 22 4 12"/>
      <rect x="2" y="7" width="20" height="5"/>
      <line x1="12" y1="22" x2="12" y2="7"/>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
  );
}

function IconStar({ className = "w-3 h-3" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/>
    </svg>
  );
}

// ── Score badge helper ─────────────────────────────────────────────────────
function ScoreBadge({ score }) {
  if (score > 0)  return <Badge variant="rose">{`+${score}`}</Badge>;
  if (score < 0)  return <Badge variant="neutral">{score}</Badge>;
  return <Badge variant="outline">0</Badge>;
}

// ── Individual gift card ───────────────────────────────────────────────────
function GiftCard({ gift, index, result, scores, voted, wishlisted, feedback, onVote, onWishlist }) {
  const score      = scores[gift.name] ?? 0;
  const hasVoted   = !!voted[gift.name];
  const isSaved    = !!wishlisted[gift.name];
  const isTopPick  = index === 0;

  return (
    <Card
      variant="default"
      padding="none"
      className="group flex flex-col hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
    >
      {/* Accent bar */}
      <div
        className="h-1 bg-gradient-to-r from-burgundy-500 to-rose-400 rounded-t-card"
        aria-hidden="true"
      />

      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Title row */}
        <div className="flex items-start gap-3">
          {/* Icon mark */}
          <div
            className="w-10 h-10 rounded-base bg-burgundy-50 border border-burgundy-100
              flex items-center justify-center shrink-0 text-burgundy-500"
            aria-hidden="true"
          >
            <IconGift className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <h3 className="font-semibold text-neutral-800 text-sm leading-snug flex-1 min-w-0">
                {gift.name}
              </h3>
              {isTopPick && (
                <Badge variant="gold" className="shrink-0 gap-1 whitespace-nowrap">
                  <IconStar className="w-2.5 h-2.5" />
                  Top Pick
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <ScoreBadge score={score} />
              {feedback[gift.name] && (
                <span
                  role="status"
                  aria-live="polite"
                  className="text-xs text-neutral-500 italic"
                >
                  {feedback[gift.name]}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto space-y-2">
          {/* Vote row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onVote(gift.name, 1)}
              disabled={hasVoted}
              aria-pressed={voted[gift.name] === 1}
              aria-label={`Recommend ${gift.name}`}
              className={[
                "flex items-center justify-center gap-1.5 py-2 rounded-base text-xs font-medium",
                "border transition-colors duration-150 cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-500 focus-visible:ring-offset-1",
                "disabled:cursor-not-allowed disabled:opacity-60",
                voted[gift.name] === 1
                  ? "bg-burgundy-600 text-white border-burgundy-600"
                  : "border-ivory-300 text-neutral-600 hover:border-burgundy-300 hover:text-burgundy-600 hover:bg-burgundy-50",
              ].join(" ")}
            >
              <IconThumbUp />
              Love it
            </button>

            <button
              onClick={() => onVote(gift.name, -1)}
              disabled={hasVoted}
              aria-pressed={voted[gift.name] === -1}
              aria-label={`Not for me: ${gift.name}`}
              className={[
                "flex items-center justify-center gap-1.5 py-2 rounded-base text-xs font-medium",
                "border transition-colors duration-150 cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-500 focus-visible:ring-offset-1",
                "disabled:cursor-not-allowed disabled:opacity-60",
                voted[gift.name] === -1
                  ? "bg-neutral-400 text-white border-neutral-400"
                  : "border-ivory-300 text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50",
              ].join(" ")}
            >
              <IconThumbDown />
              Not for me
            </button>
          </div>

          {/* Wishlist + Buy row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onWishlist(gift)}
              disabled={isSaved}
              aria-pressed={isSaved}
              aria-label={isSaved ? `${gift.name} saved to wishlist` : `Save ${gift.name} to wishlist`}
              className={[
                "flex items-center justify-center gap-1.5 py-2 rounded-base text-xs font-medium",
                "border transition-colors duration-150 cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-500 focus-visible:ring-offset-1",
                "disabled:cursor-not-allowed",
                isSaved
                  ? "bg-rose-500 text-white border-rose-500"
                  : "border-ivory-300 text-neutral-600 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50",
              ].join(" ")}
            >
              <IconHeart filled={isSaved} className={isSaved ? "w-4 h-4 text-white" : "w-4 h-4"} />
              {isSaved ? "Saved" : "Save"}
            </button>

            <a
              href={amazonLink(gift.name)}
              target="_blank"
              rel="noreferrer"
              aria-label={`Buy ${gift.name} on Amazon India`}
              className={[
                "flex items-center justify-center gap-1.5 py-2 rounded-base text-xs font-medium",
                "border border-ivory-300 text-neutral-600",
                "hover:border-neutral-300 hover:bg-neutral-50",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-500 focus-visible:ring-offset-1",
              ].join(" ")}
            >
              <IconShoppingBag />
              Buy
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function GiftResults({ result, onReset }) {
  const [scores,     setScores]     = useState(
    () => Object.fromEntries(result.recommendations.map((g) => [g.name, g.score]))
  );
  const [voted,      setVoted]      = useState({});
  const [wishlisted, setWishlisted] = useState({});
  const [feedback,   setFeedback]   = useState({});

  const handleVote = async (giftName, vote) => {
    if (voted[giftName]) return;
    try {
      await apiFetch("/api/vote", {
        method: "POST",
        body: JSON.stringify({
          gift_name:    giftName,
          relationship: result.relationship,
          occasion:     result.occasion,
          vote,
        }),
      });
      setScores((p)   => ({ ...p, [giftName]: (p[giftName] || 0) + vote }));
      setVoted((p)    => ({ ...p, [giftName]: vote }));
      setFeedback((p) => ({ ...p, [giftName]: vote === 1 ? "Thanks for the rating!" : "Noted, we'll improve." }));
    } catch { /* silent — vote is best-effort */ }
  };

  const handleWishlist = async (gift) => {
    if (wishlisted[gift.name]) return;
    try {
      await apiFetch("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({
          gift_name:    gift.name,
          relationship: result.relationship,
          occasion:     result.occasion,
          budget:       result.budget,
        }),
      });
      setWishlisted((p) => ({ ...p, [gift.name]: true }));
    } catch { /* silent — wishlist is best-effort */ }
  };

  const occasionEmoji = occasionEmojis[result.occasion] || "🎁";
  const sorted = [...result.recommendations].sort(
    (a, b) => (scores[b.name] || 0) - (scores[a.name] || 0)
  );

  return (
    <div className="w-full max-w-4xl mx-auto">

      {/* ── Results header ─────────────────────────────────────────────── */}
      <div className="text-center mb-8 px-4">
        {/* Occasion emoji — decorative only */}
        <p className="text-5xl mb-3" aria-hidden="true">{occasionEmoji}</p>

        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-burgundy-800 mb-2">
          Gift Ideas for You
        </h2>

        {/* Context summary */}
        <p className="text-sm text-neutral-500">
          For your{" "}
          <span className="font-semibold text-burgundy-600">{fmt(result.relationship)}</span>
          {result.gender !== "any" && (
            <> (<span className="text-neutral-500">{fmt(result.gender)}</span>)</>
          )}
          {" · "}
          <span className="font-semibold text-burgundy-600">{fmt(result.occasion)}</span>
          {" · "}
          <span className="font-semibold text-burgundy-600">{fmt(result.budget)} budget</span>
        </p>

        {/* Result count */}
        <p className="mt-2 text-xs text-neutral-400">
          {sorted.length} curated {sorted.length === 1 ? "idea" : "ideas"} — rate each to improve future suggestions
        </p>
      </div>

      {/* ── Gift card grid ─────────────────────────────────────────────── */}
      <ul
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 px-4"
        aria-label={`${sorted.length} gift recommendations`}
      >
        {sorted.map((gift, i) => (
          <li key={gift.name}>
            <GiftCard
              gift={gift}
              index={i}
              result={result}
              scores={scores}
              voted={voted}
              wishlisted={wishlisted}
              feedback={feedback}
              onVote={handleVote}
              onWishlist={handleWishlist}
            />
          </li>
        ))}
      </ul>

      {/* ── Search again ───────────────────────────────────────────────── */}
      <div className="text-center pb-4">
        <Button
          variant="secondary"
          size="md"
          onClick={onReset}
          aria-label="Start a new gift search"
        >
          <IconArrowLeft />
          Search Again
        </Button>
      </div>
    </div>
  );
}
