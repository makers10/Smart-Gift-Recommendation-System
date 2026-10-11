/**
 * History — Gift with Love
 *
 * Displays the current user's previous gift searches.
 *
 * API calls preserved:
 *   GET    /api/history        — fetch up to 50 entries on mount
 *   DELETE /api/history/{id}   — remove a single entry
 *   DELETE /api/history        — clear all entries
 *
 * Re-search flow preserved:
 *   Clicking "Search again" on a history entry calls onReSearch({ relationship, occasion, budget, gender })
 *   which is wired in App.jsx to prefill GiftForm and navigate to the home tab.
 *
 * Design changes (Stage F):
 *   - V12 fixed: max-w-md → max-w-3xl responsive layout
 *   - Design tokens throughout: ivory/burgundy palette
 *   - Skeleton loaders during initial fetch
 *   - Remove button has aria-label (A7 fix)
 *   - Re-search button has aria-label
 *   - role="status" on loading state (A4)
 *   - role="alert" on error state
 *   - Clear All has confirmation pattern (destructive action)
 *   - Occasion emoji kept as aria-hidden decorative
 */
import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { fmt, occasionEmojis, formatDate } from "../utils/format";
import { Card } from "./ui/Card";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

// ── Inline SVG icons ──────────────────────────────────────────────────────

function IconRefresh({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
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

// ── History item row ──────────────────────────────────────────────────────

function HistoryItem({ item, onReSearch, onRemove }) {
  const emoji = occasionEmojis[item.occasion] || "🎁";

  return (
    <Card variant="default" padding="none"
      className="px-5 py-4 hover:shadow-md transition-all duration-200">

      <div className="flex items-start justify-between gap-4">

        {/* Left — occasion emoji + details */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Occasion emoji — decorative */}
          <span
            className="text-xl mt-0.5 shrink-0 leading-none"
            aria-hidden="true"
          >
            {emoji}
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="text-sm font-semibold text-neutral-800">
                {fmt(item.occasion)}
              </span>
              <span className="text-xs text-neutral-400">for</span>
              <span className="text-sm text-neutral-700">{fmt(item.relationship)}</span>
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" size="xs">{fmt(item.budget)}</Badge>
              {item.gender && item.gender !== "any" && (
                <Badge variant="neutral" size="xs">{fmt(item.gender)}</Badge>
              )}
            </div>

            {/* Timestamp */}
            <p className="text-xs text-neutral-400 mt-1.5">{formatDate(item.created_at)}</p>
          </div>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onReSearch({
              relationship: item.relationship,
              occasion:     item.occasion,
              budget:       item.budget,
              gender:       item.gender,
            })}
            aria-label={`Search again: ${fmt(item.occasion)} for ${fmt(item.relationship)}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-base text-xs font-medium
              border border-burgundy-200 text-burgundy-600
              hover:bg-burgundy-50 hover:border-burgundy-400
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-500 focus-visible:ring-offset-1
              cursor-pointer"
          >
            <IconRefresh />
            Search again
          </button>

          <button
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${fmt(item.occasion)} search from history`}
            className="flex items-center justify-center w-8 h-8 rounded-base
              border border-transparent text-neutral-400
              hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-500 focus-visible:ring-offset-1
              cursor-pointer"
          >
            <IconTrash />
          </button>
        </div>
      </div>
    </Card>
  );
}

// ── Skeleton row ──────────────────────────────────────────────────────────

function HistorySkeleton() {
  return (
    <div className="bg-white border border-ivory-300 rounded-card px-5 py-4 flex items-start gap-3 shadow-xs"
      role="status" aria-label="Loading history entry…">
      <div className="w-6 h-6 bg-ivory-300 animate-pulse rounded mt-0.5 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-ivory-300 animate-pulse rounded w-3/4" />
        <div className="h-3 bg-ivory-200 animate-pulse rounded w-1/3" />
        <div className="h-3 bg-ivory-200 animate-pulse rounded w-1/4" />
      </div>
      <span className="sr-only">Loading history entry…</span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function History({ onReSearch }) {
  const [items,          setItems]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(false);
  const [confirmClear,   setConfirmClear]   = useState(false);

  const fetchHistory = async () => {
    setError(false);
    try {
      const res = await apiFetch("/api/history");
      setItems(await res.json());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const remove = async (id) => {
    try {
      await apiFetch(`/api/history/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch { /* silent */ }
  };

  const clearAll = async () => {
    try {
      await apiFetch("/api/history", { method: "DELETE" });
      setItems([]);
    } catch { /* silent */ } finally {
      setConfirmClear(false);
    }
  };

  return (
    <div className="w-full max-w-3xl">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-burgundy-800">Search History</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Your previous gift searches — private to this browser session.
          </p>
        </div>

        {/* Clear All — shown only when there are items, with confirmation */}
        {!loading && !error && items.length > 0 && (
          <>
            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                aria-label="Clear all search history"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-base
                  border border-neutral-200 text-neutral-500
                  hover:border-rose-200 hover:text-rose-600 hover:bg-rose-50
                  transition-colors duration-150
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-500 focus-visible:ring-offset-1
                  cursor-pointer self-start"
              >
                <IconTrash />
                Clear all
              </button>
            ) : (
              <div className="flex items-center gap-2 self-start">
                <span className="text-xs text-neutral-500">Remove all?</span>
                <button
                  onClick={clearAll}
                  className="text-xs px-3 py-1.5 rounded-base bg-rose-500 text-white
                    hover:bg-rose-600 transition-colors duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-500 focus-visible:ring-offset-1
                    cursor-pointer font-medium"
                >
                  Yes, clear
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="text-xs px-3 py-1.5 rounded-base border border-neutral-200 text-neutral-500
                    hover:bg-neutral-50 transition-colors duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-500 focus-visible:ring-offset-1
                    cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="space-y-3" aria-label="Loading search history">
          {Array.from({ length: 4 }).map((_, i) => <HistorySkeleton key={i} />)}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div role="alert" className="bg-burgundy-50 border border-burgundy-200 rounded-card p-6 text-center">
          <p className="text-sm font-medium text-burgundy-700 mb-3">
            Unable to load your search history. Please try again.
          </p>
          <Button variant="secondary" size="sm" onClick={fetchHistory}>
            Retry
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && items.length === 0 && (
        <Card variant="flat" padding="lg" className="text-center">
          <div
            className="w-16 h-16 rounded-full bg-burgundy-50 border border-burgundy-100
              flex items-center justify-center mx-auto mb-4 text-burgundy-400"
            aria-hidden="true"
          >
            {/* Clock icon */}
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <h2 className="font-serif text-xl font-semibold text-burgundy-700 mb-2">
            No searches yet
          </h2>
          <p className="text-sm text-neutral-500">
            Your gift searches will appear here so you can revisit them anytime.
          </p>
        </Card>
      )}

      {/* Populated state */}
      {!loading && !error && items.length > 0 && (
        <>
          <p className="text-xs text-neutral-400 mb-4" role="status">
            {items.length} {items.length === 1 ? "search" : "searches"}
          </p>
          <ul className="space-y-3" aria-label="Search history entries">
            {items.map((item) => (
              <li key={item.id}>
                <HistoryItem item={item} onReSearch={onReSearch} onRemove={remove} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
