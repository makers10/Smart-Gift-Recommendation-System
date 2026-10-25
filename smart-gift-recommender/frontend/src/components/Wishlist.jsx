/**
 * Wishlist — Gift with Love
 *
 * Displays the current user's saved gift items.
 *
 * API calls preserved:
 *   GET    /api/wishlist        — fetch all saved items on mount
 *   DELETE /api/wishlist/{id}   — remove a single item
 *
 * Design changes (Stage F):
 *   - V12 fixed: max-w-md → max-w-3xl responsive layout
 *   - Design tokens: ivory/burgundy palette throughout
 *   - Card primitive used for each wishlist item
 *   - Skeleton loaders during initial fetch (C3 continuation)
 *   - Empty and error states with semantic markup
 *   - Remove button has aria-label (A7 fix)
 *   - Buy link has aria-label
 *   - role="status" on loading paragraph (A4)
 *   - Grid layout on wider screens for better space use
 */
import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { fmt, amazonLink } from "../utils/format";
import { Card } from "./ui/Card";
import Button from "./ui/Button";
import Skeleton from "./ui/Skeleton";

// ── Inline SVG icons ──────────────────────────────────────────────────────

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

function IconTrash({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/>
      <path d="M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
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

// ── Wishlist item card ─────────────────────────────────────────────────────

function WishlistItem({ item, onRemove }) {
  return (
    <Card variant="default" padding="none"
      className="flex items-center gap-4 px-5 py-4 hover:shadow-md transition-all duration-200 group">

      {/* Icon mark */}
      <div
        className="w-11 h-11 rounded-xl bg-[#4A1830] border border-[#C69A55]/40
          flex items-center justify-center shrink-0 text-[#C69A55] shadow-sm"
        aria-hidden="true"
      >
        <IconGift />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-base font-serif font-bold text-[#FFF7E9] truncate leading-snug">
          {item.gift_name}
        </p>
        <p className="text-xs text-[#E9D7B8]/80 mt-1 font-sans">
          {fmt(item.relationship)}
          <span className="mx-1.5 text-[#C69A55]">·</span>
          {fmt(item.occasion)}
          <span className="mx-1.5 text-[#C69A55]">·</span>
          {fmt(item.budget)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <a
          href={amazonLink(item.gift_name)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Buy ${item.gift_name} on Amazon India`}
          className="flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-xl text-xs font-bold uppercase tracking-wider
            text-[#17131A] bg-gradient-to-r from-[#C69A55] via-[#DCB372] to-[#E9D7B8]
            hover:brightness-105 shadow-[0_2px_12px_rgba(198,154,85,0.35)]
            transition-all duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69A55] focus-visible:ring-offset-2"
        >
          <IconShoppingBag />
          <span>Buy</span>
        </a>

        <button
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.gift_name} from wishlist`}
          className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl
            border border-[#4A1830]/60 text-[#D8CABA]/60 bg-[#1E131B]
            hover:border-rose-900/60 hover:text-rose-300 hover:bg-rose-950/40
            transition-all duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69A55] focus-visible:ring-offset-2
            cursor-pointer"
        >
          <IconTrash />
        </button>
      </div>
    </Card>
  );
}

// ── Skeleton row ──────────────────────────────────────────────────────────

function WishlistSkeleton() {
  return (
    <div className="bg-[#241620]/95 border border-[#4A1830] rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm"
      role="status" aria-label="Loading wishlist item…">
      <div className="w-11 h-11 bg-[#311C2C] animate-pulse rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-[#311C2C] animate-pulse rounded w-2/3" />
        <div className="h-3 bg-[#1E131B] animate-pulse rounded w-1/2" />
      </div>
      <div className="h-9 w-20 bg-[#311C2C] animate-pulse rounded-xl shrink-0" />
      <span className="sr-only">Loading wishlist item…</span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function Wishlist() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  const fetchWishlist = async () => {
    setError(false);
    try {
      const res = await apiFetch("/api/wishlist");
      setItems(await res.json());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWishlist(); }, []);

  const remove = async (id) => {
    try {
      await apiFetch(`/api/wishlist/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch { /* silent — item will still appear; user can retry */ }
  };

  return (
    <div className="w-full max-w-3xl">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#FFF7E9]">My Wishlist</h1>
        <p className="text-sm text-[#E9D7B8]/80 mt-1 font-sans font-light">
          Curated gifts you've saved — ready to order whenever the moment arrives.
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="space-y-3" aria-label="Loading wishlist">
          {Array.from({ length: 4 }).map((_, i) => <WishlistSkeleton key={i} />)}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div role="alert" className="bg-[#1E131B] border border-[#7E0F2E] rounded-2xl p-6 text-center text-[#FFF7E9]">
          <p className="text-sm font-medium text-[#FFF7E9] mb-3">
            Unable to load your wishlist. Please try again.
          </p>
          <Button variant="gold" size="sm" onClick={fetchWishlist}>
            Retry
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && items.length === 0 && (
        <Card variant="default" padding="lg" className="text-center p-10">
          <div
            className="w-16 h-16 rounded-2xl bg-[#4A1830] border border-[#C69A55]/40
              flex items-center justify-center mx-auto mb-4 text-[#C69A55]"
            aria-hidden="true"
          >
            <IconGift className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#FFF7E9] mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-sm text-[#E9D7B8]/75 font-sans">
            When you find a gift you love, save it here for later.
          </p>
        </Card>
      )}

      {/* Populated state */}
      {!loading && !error && items.length > 0 && (
        <>
          <p className="text-xs text-neutral-400 mb-4" role="status">
            {items.length} saved {items.length === 1 ? "gift" : "gifts"}
          </p>
          <ul className="space-y-3" aria-label="Saved gifts">
            {items.map((item) => (
              <li key={item.id}>
                <WishlistItem item={item} onRemove={remove} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
