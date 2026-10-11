import { useState } from "react";
import GiftForm from "./components/GiftForm";
import GiftResults from "./components/GiftResults";
import Dashboard from "./components/Dashboard";
import Wishlist from "./components/Wishlist";
import History from "./components/History";
import Hero from "./components/Hero";
import Marketplace from "./components/Marketplace";
import ErrorBoundary from "./components/ui/ErrorBoundary";

const tabs = [
  { id: "home",      label: "Find a Gift" },
  { id: "custom",    label: "Custom Made" },
  { id: "history",   label: "History" },
  { id: "wishlist",  label: "Wishlist" },
  { id: "dashboard", label: "Dashboard" },
];

export default function App() {
  const [result,  setResult]  = useState(null);
  const [tab,     setTab]     = useState("home");
  const [prefill, setPrefill] = useState(null);

  const handleReSearch = (params) => {
    setPrefill(params);
    setResult(null);
    setTab("home");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-ivory-100)" }}>

      {/* Top nav — preserved as pill row; full responsive nav comes in Stage C */}
      <nav
        className="relative z-20 flex justify-center gap-2 pt-6 px-4 flex-wrap"
        aria-label="Main navigation"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setResult(null); }}
            aria-current={tab === t.id ? "page" : undefined}
            className={[
              "px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-500 focus-visible:ring-offset-2",
              tab === t.id
                ? "bg-burgundy-600 text-white shadow-brand"
                : "bg-white text-burgundy-600 border border-burgundy-200 hover:border-burgundy-400 hover:bg-burgundy-50 shadow-xs",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center px-4 pb-16">

        {/* Home — Find a Gift */}
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

        {/* Custom Made */}
        {tab === "custom" && (
          <div className="mt-8 w-full flex justify-center">
            <ErrorBoundary label="Custom Made">
              <Marketplace />
            </ErrorBoundary>
          </div>
        )}

        {/* History */}
        {tab === "history" && (
          <div className="mt-8 w-full flex justify-center">
            <ErrorBoundary label="your search history">
              <History onReSearch={handleReSearch} />
            </ErrorBoundary>
          </div>
        )}

        {/* Wishlist */}
        {tab === "wishlist" && (
          <div className="mt-8 w-full flex justify-center">
            <ErrorBoundary label="your wishlist">
              <Wishlist />
            </ErrorBoundary>
          </div>
        )}

        {/* Dashboard */}
        {tab === "dashboard" && (
          <div className="mt-8 w-full flex justify-center">
            <ErrorBoundary label="the dashboard">
              <Dashboard />
            </ErrorBoundary>
          </div>
        )}
      </main>

      <footer className="text-center py-5 text-burgundy-300 text-xs tracking-widest uppercase">
        Made with love — Gift with Love
      </footer>
    </div>
  );
}
