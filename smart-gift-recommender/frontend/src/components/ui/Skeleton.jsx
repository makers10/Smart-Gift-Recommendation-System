/**
 * Skeleton loader primitives — Gift with Love design system.
 *
 * Used as placeholders while data is loading to prevent layout shift
 * and jarring blank-flash transitions (fixes C3 from the audit).
 *
 * The `animate-pulse` animation is suppressed automatically when
 * `prefers-reduced-motion: reduce` is set (handled in index.css).
 *
 * Usage:
 *   <Skeleton className="h-6 w-48" />
 *   <Skeleton.Card />        — standard gift / list card placeholder
 *   <Skeleton.Text lines={3} /> — paragraph block
 */
function Skeleton({ className = "", ...props }) {
  return (
    <div
      role="status"
      aria-label="Loading…"
      className={[
        "animate-pulse bg-ivory-300 rounded-base",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

/** A card-shaped placeholder matching the gift result card dimensions. */
Skeleton.Card = function SkeletonCard({ className = "" }) {
  return (
    <div
      role="status"
      aria-label="Loading gift…"
      className={[
        "bg-white border border-ivory-300 rounded-card p-5 shadow-sm space-y-3",
        className,
      ].join(" ")}
    >
      {/* Top color bar */}
      <div className="h-1.5 bg-ivory-300 animate-pulse rounded-full" />
      {/* Icon + title row */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-ivory-300 animate-pulse rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-ivory-300 animate-pulse rounded w-3/4" />
          <div className="h-3 bg-ivory-200 animate-pulse rounded w-1/3" />
        </div>
      </div>
      {/* Action buttons row */}
      <div className="flex gap-2 pt-1">
        <div className="flex-1 h-8 bg-ivory-200 animate-pulse rounded-base" />
        <div className="flex-1 h-8 bg-ivory-200 animate-pulse rounded-base" />
      </div>
      <span className="sr-only">Loading gift…</span>
    </div>
  );
};

/** A paragraph-shaped placeholder for text blocks. */
Skeleton.Text = function SkeletonText({ lines = 3, className = "" }) {
  return (
    <div role="status" aria-label="Loading…" className={["space-y-2", className].join(" ")}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={[
            "h-3.5 bg-ivory-300 animate-pulse rounded",
            i === lines - 1 ? "w-3/4" : "w-full",
          ].join(" ")}
        />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
};

/** A stat card placeholder matching the Dashboard stat card layout. */
Skeleton.StatCard = function SkeletonStatCard({ className = "" }) {
  return (
    <div
      role="status"
      aria-label="Loading…"
      className={["bg-white border border-ivory-300 rounded-card p-5 space-y-2", className].join(" ")}
    >
      <div className="h-4 bg-ivory-300 animate-pulse rounded w-1/2 mx-auto" />
      <div className="h-8 bg-ivory-300 animate-pulse rounded w-1/3 mx-auto" />
      <div className="h-3 bg-ivory-200 animate-pulse rounded w-2/3 mx-auto" />
      <span className="sr-only">Loading…</span>
    </div>
  );
};

export default Skeleton;
