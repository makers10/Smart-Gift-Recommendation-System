import { useState } from "react";
import GiftForm from "./components/GiftForm";
import GiftResults from "./components/GiftResults";
import Dashboard from "./components/Dashboard";
import Wishlist from "./components/Wishlist";
import History from "./components/History";
import Hero from "./components/Hero";
import Marketplace from "./components/Marketplace";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

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
   *   { occasion: "birthday" }           → prefills + scrolls to form
   *   { relationship: "mom" }             → prefills + scrolls to form
   *   { __navigate: "custom" }            → navigates to Custom Made tab
   */
  const handleQuickSearch = (params) => {
    if (params.__navigate) {
      handleNavigate(params.__navigate);
      return;
    }
    // Prefill the form and scroll down to it
    setPrefill(params);
    setResult(null);
    setTab("home");
    // Small timeout so the DOM rerenders the form before we try to scroll
    setTimeout(() => {
      document.getElementById("gift-discovery-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  // Derive a human-readable page name for the live announcement
  const PAGE_NAMES = {
    home:      "Find a Gift",
    custom:    "Custom Made",
    history:   "Search History",
    wishlist:  "Wishlist",
    dashboard: "Dashboard",
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory-100">

      {/*
        Visually hidden live region — announces the current page name to
        screen readers whenever the tab changes (WCAG 4.1.3 Status Messages,
        helps with WCAG 2.4.2 Page Titled in SPA contexts).
      */}
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
          /*
           * Scroll anchor placed here so the hero "Find a Gift" CTA can
           * smoothly scroll the viewport to the GiftForm.
           */
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

        {/* ── Dashboard ────────────────────────────────────────────────────── */}
        {tab === "dashboard" && (
          <div className="mt-8 w-full flex justify-center px-4 pb-16">
            <ErrorBoundary label="the dashboard">
              <Dashboard />
            </ErrorBoundary>
          </div>
        )}
      </main>

      {/* ── Global footer ────────────────────────────────────────────────── */}
      <SiteFooter onNavigate={handleNavigate} />
    </div>
  );
}
