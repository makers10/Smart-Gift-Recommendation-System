import { useState, lazy, Suspense } from "react";
import GiftForm from "./components/GiftForm";
import GiftResults from "./components/GiftResults";
import Wishlist from "./components/Wishlist";
import History from "./components/History";
import Hero from "./components/Hero";
import Marketplace from "./components/Marketplace";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import Skeleton from "./components/ui/Skeleton";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import AmbientBackground from "./components/AmbientBackground";

/**
 * Dashboard is lazy-loaded so Recharts + lodash + d3 (~440 KB) are
 * excluded from the initial bundle and only fetched when the user
 * navigates to the Dashboard tab.
 */
const Dashboard = lazy(() => import("./components/Dashboard"));

/** Fallback shown while the Dashboard chunk is being fetched. */
function DashboardFallback() {
  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton.StatCard key={i} />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-card" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-52 rounded-card" />
        <Skeleton className="h-52 rounded-card" />
      </div>
      <p className="sr-only" role="status">Loading dashboard…</p>
    </div>
  );
}

export default function App() {
  const [result,  setResult]  = useState(null);
  const [tab,     setTab]     = useState("home");
  const [prefill, setPrefill] = useState(null);

  // Switch tab + optionally prefill GiftForm — used by History re-search
  const handleReSearch = (params) => {
    setPrefill(params);
    setResult(null);
    setTab("home");
  };

  // Global tab navigation, resets result
  const handleNavigate = (id) => {
    setTab(id);
    setResult(null);
  };

  /**
   * Called by Hero when a user clicks an occasion chip, a relationship card,
   * or a "Custom Made" CTA.
   *
   * Accepts a partial params object:
   *   { occasion: "birthday" }      → prefills + scrolls to form
   *   { relationship: "mom" }        → prefills + scrolls to form
   *   { __navigate: "custom" }       → navigates to Custom Made tab
   */
  const handleQuickSearch = (params) => {
    if (params.__navigate) {
      handleNavigate(params.__navigate);
      return;
    }
    setPrefill(params);
    setResult(null);
    setTab("home");
    setTimeout(() => {
      document.getElementById("gift-discovery-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  // Human-readable page name announced to screen readers on tab change
  const PAGE_NAMES = {
    home:      "Find a Gift",
    custom:    "Custom Made",
    history:   "Search History",
    wishlist:  "Wishlist",
    dashboard: "Dashboard",
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory-100 relative overflow-x-hidden">
      {/* ThreeUI / 21st.dev style Ambient Canvas & Floating Mesh */}
      <AmbientBackground />

      {/* Live region — announces tab name to screen readers on navigation */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {PAGE_NAMES[tab] ?? ""}
      </div>

      {/* ── Global header + responsive navigation ────────────────────────── */}
      <SiteHeader tab={tab} onNavigate={handleNavigate} />

      {/* ── Main page content ─────────────────────────────────────────────── */}
      <main id="main-content" className="flex-1 flex flex-col">

        {/* ── Home — Find a Gift ─────────────────────────────────────────── */}
        {tab === "home" && !result && (
          <Hero onQuickSearch={handleQuickSearch} />
        )}

        {tab === "home" && (
          <div
            id="gift-discovery-form"
            className={`w-full flex flex-col items-center px-4 ${!result ? "py-12 sm:py-16" : "py-10"}`}
          >
            <ErrorBoundary label="the gift finder">
              {!result
                ? <GiftForm
                    onRecommend={setResult}
                    prefill={prefill}
                    onPrefillUsed={() => setPrefill(null)}
                  />
                : <GiftResults result={result} onReset={() => setResult(null)} />}
            </ErrorBoundary>
          </div>
        )}

        {/* ── Custom Made ──────────────────────────────────────────────────── */}
        {tab === "custom" && (
          <div className="mt-8 w-full flex justify-center px-4 pb-16">
            <ErrorBoundary label="Custom Made">
              <Marketplace />
            </ErrorBoundary>
          </div>
        )}

        {/* ── History ──────────────────────────────────────────────────────── */}
        {tab === "history" && (
          <div className="mt-8 w-full flex justify-center px-4 pb-16">
            <ErrorBoundary label="your search history">
              <History onReSearch={handleReSearch} />
            </ErrorBoundary>
          </div>
        )}

        {/* ── Wishlist ─────────────────────────────────────────────────────── */}
        {tab === "wishlist" && (
          <div className="mt-8 w-full flex justify-center px-4 pb-16">
            <ErrorBoundary label="your wishlist">
              <Wishlist />
            </ErrorBoundary>
          </div>
        )}

        {/* ── Dashboard — lazy-loaded to exclude Recharts from initial bundle ── */}
        {tab === "dashboard" && (
          <div className="mt-8 w-full flex justify-center px-4 pb-16">
            <ErrorBoundary label="the dashboard">
              <Suspense fallback={<DashboardFallback />}>
                <Dashboard />
              </Suspense>
            </ErrorBoundary>
          </div>
        )}
      </main>

      {/* ── Global footer ────────────────────────────────────────────────── */}
      <SiteFooter onNavigate={handleNavigate} />
    </div>
  );
}
