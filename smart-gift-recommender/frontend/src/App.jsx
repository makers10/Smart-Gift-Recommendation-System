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

  const handleReSearch = (params) => {
    setPrefill(params);
    setResult(null);
    setTab("home");
  };

  // Navigate to a tab, always resetting the result state
  const handleNavigate = (id) => {
    setTab(id);
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory-100">

      {/* ── Global header + navigation ───────────────────────────────────── */}
      <SiteHeader tab={tab} onNavigate={handleNavigate} />

      {/* ── Main page content ────────────────────────────────────────────── */}
      <main id="main-content" className="flex-1 flex flex-col items-center px-4 pb-16">

        {/* Home — Find a Gift ─────────────────────────────────────────── */}
        {tab === "home" && !result && <Hero />}
        {tab === "home" && (
          <div className={`w-full flex flex-col items-center ${!result ? "mt-0" : "mt-10"}`}>
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

        {/* Custom Made ────────────────────────────────────────────────── */}
        {tab === "custom" && (
          <div className="mt-8 w-full flex justify-center">
            <ErrorBoundary label="Custom Made">
              <Marketplace />
            </ErrorBoundary>
          </div>
        )}

        {/* History ────────────────────────────────────────────────────── */}
        {tab === "history" && (
          <div className="mt-8 w-full flex justify-center">
            <ErrorBoundary label="your search history">
              <History onReSearch={handleReSearch} />
            </ErrorBoundary>
          </div>
        )}

        {/* Wishlist ───────────────────────────────────────────────────── */}
        {tab === "wishlist" && (
          <div className="mt-8 w-full flex justify-center">
            <ErrorBoundary label="your wishlist">
              <Wishlist />
            </ErrorBoundary>
          </div>
        )}

        {/* Dashboard ──────────────────────────────────────────────────── */}
        {tab === "dashboard" && (
          <div className="mt-8 w-full flex justify-center">
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
