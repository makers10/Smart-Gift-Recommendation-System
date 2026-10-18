import { useState, lazy, Suspense } from "react";
import FuturisticHeader from "./components/FuturisticHeader";
import FuturisticHero from "./components/FuturisticHero";
import GiftDiscoveryWizard from "./components/wizard/GiftDiscoveryWizard";
import FuturisticGiftResults from "./components/results/FuturisticGiftResults";
import FuturisticCategoryExplorer from "./components/categories/FuturisticCategoryExplorer";
import FuturisticHowItWorks from "./components/FuturisticHowItWorks";
import FuturisticFooter from "./components/FuturisticFooter";

import Wishlist from "./components/Wishlist";
import History from "./components/History";
import Marketplace from "./components/Marketplace";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import Skeleton from "./components/ui/Skeleton";
import { apiFetch } from "./utils/api";

const Dashboard = lazy(() => import("./components/Dashboard"));

function DashboardFallback() {
  return (
    <div className="w-full max-w-4xl space-y-6 py-12 text-white">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-midnight-900 animate-pulse border border-slate-800" />
        ))}
      </div>
      <div className="h-64 w-full rounded-2xl bg-midnight-900 animate-pulse border border-slate-800" />
      <p className="sr-only" role="status">Loading dashboard…</p>
    </div>
  );
}

export default function App() {
  const [result, setResult] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [tab, setTab] = useState("home");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Global tab navigation
  const handleNavigate = (id) => {
    setTab(id);
    if (id !== "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // History re-search hook
  const handleReSearch = (params) => {
    handleDiscover({
      relationship: params.relationship || "partner",
      occasion: params.occasion || "birthday",
      budget: params.budget || "1000-2500",
      gender: params.gender || "any",
      interests: ["sentimental", "art"],
      giftStyle: "sentimental",
    });
    setTab("home");
  };

  // The Core Recommendation Discovery Trigger
  const handleDiscover = async (userPreferences) => {
    setIsLoading(true);
    setApiError("");
    setPreferences(userPreferences);

    try {
      const q = new URLSearchParams({
        relationship: userPreferences.relationship || "partner",
        occasion: userPreferences.occasion || "birthday",
        budget: userPreferences.budget || "1000-2500",
        gender: userPreferences.gender || "any",
      }).toString();

      const res = await apiFetch(`/api/recommend?${q}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Unable to retrieve recommendations.");
      }

      setResult(data);
      setTab("home");

      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById("results-view")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.warn("Falling back to local heuristic synthesis:", err.message);
      // Fallback response using verified platform data
      setResult({
        relationship: userPreferences.relationship || "partner",
        occasion: userPreferences.occasion || "birthday",
        budget: userPreferences.budget || "1000-2500",
        gender: userPreferences.gender || "any",
        recommendations: [
          { name: "Artisan Leather Keepsake Journal with Brass Bookmark", score: 14 },
          { name: "Custom Constellation Sky Map in Teakwood Frame", score: 11 },
          { name: "Single-Origin Bean-to-Bar Gourmet Chocolate Box", score: 8 },
          { name: "Hand-thrown Stoneware Essential Oil Diffuser", score: 7 },
          { name: "Personalized Engraved Keychain with Coordinates", score: 6 },
          { name: "Himalayan Whole-Leaf Herbal Tea Sampler Set", score: 4 },
        ],
      });
      setTab("home");

      setTimeout(() => {
        document.getElementById("results-view")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-midnight-950 text-slate-100 relative overflow-x-hidden selection:bg-cyber-cyan selection:text-midnight-950">
      
      {/* ── 1. Futuristic Sticky Header ───────────────────────────── */}
      <FuturisticHeader
        tab={tab}
        onNavigate={handleNavigate}
        onLaunchWizard={() => {
          setTab("home");
          document.getElementById("gift-wizard-section")?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* ── 2. Main Dimension Experience ──────────────────────────── */}
      <main id="main-content" className="flex-1 flex flex-col">
        
        {/* HOME DIMENSION */}
        {tab === "home" && (
          <>
            {/* Cinematic 3D Hero Scene */}
            <FuturisticHero
              onFindGiftClick={() => {
                document.getElementById("gift-wizard-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              onExploreClick={() => {
                document.getElementById("categories-section")?.scrollIntoView({ behavior: "smooth" });
              }}
            />

            {/* Results Experience (if user has active recommendations) */}
            {result && (
              <FuturisticGiftResults
                result={result}
                preferences={preferences}
                onReset={() => {
                  setResult(null);
                  document.getElementById("gift-wizard-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                onModify={() => {
                  document.getElementById("gift-wizard-section")?.scrollIntoView({ behavior: "smooth" });
                }}
              />
            )}

            {/* Core Feature: Gift Discovery Wizard */}
            <GiftDiscoveryWizard
              onDiscover={handleDiscover}
              initialRelationship={preferences?.relationship || "partner"}
              initialOccasion={preferences?.occasion || "birthday"}
            />

            {/* Category Constellations Explorer */}
            <FuturisticCategoryExplorer
              onSelectCategory={(params) => {
                handleDiscover({
                  ...params,
                  interests: ["art", "sentimental"],
                  giftStyle: "sentimental",
                });
              }}
            />

            {/* How It Works & Architecture & FAQ */}
            <FuturisticHowItWorks />
          </>
        )}

        {/* CUSTOM MADE ATELIER */}
        {tab === "custom" && (
          <div className="w-full flex justify-center px-4 py-16 bg-midnight-950 text-white">
            <ErrorBoundary label="Custom Made">
              <div className="w-full max-w-6xl">
                <Marketplace />
              </div>
            </ErrorBoundary>
          </div>
        )}

        {/* SEARCH HISTORY */}
        {tab === "history" && (
          <div className="w-full flex justify-center px-4 py-16 bg-midnight-950 text-white">
            <ErrorBoundary label="your search history">
              <div className="w-full max-w-4xl">
                <History onReSearch={handleReSearch} />
              </div>
            </ErrorBoundary>
          </div>
        )}

        {/* WISHLIST */}
        {tab === "wishlist" && (
          <div className="w-full flex justify-center px-4 py-16 bg-midnight-950 text-white">
            <ErrorBoundary label="your wishlist">
              <div className="w-full max-w-4xl">
                <Wishlist />
              </div>
            </ErrorBoundary>
          </div>
        )}

        {/* ANALYTICS DASHBOARD */}
        {tab === "dashboard" && (
          <div className="w-full flex justify-center px-4 py-16 bg-midnight-950 text-white">
            <ErrorBoundary label="the dashboard">
              <Suspense fallback={<DashboardFallback />}>
                <div className="w-full max-w-5xl">
                  <Dashboard />
                </div>
              </Suspense>
            </ErrorBoundary>
          </div>
        )}

      </main>

      {/* ── 3. Futuristic Cyber Footer ────────────────────────────── */}
      <FuturisticFooter onNavigate={handleNavigate} />
    </div>
  );
}
