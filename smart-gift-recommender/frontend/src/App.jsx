import { useState } from "react";
import GiftForm from "./components/GiftForm";
import GiftResults from "./components/GiftResults";
import Dashboard from "./components/Dashboard";
import Wishlist from "./components/Wishlist";
import History from "./components/History";
import Hero from "./components/Hero";

const tabs = [
  { id: "home",      label: "💝 Find a Gift" },
  { id: "history",   label: "🕰️ History" },
  { id: "wishlist",  label: "💌 Wishlist" },
  { id: "dashboard", label: "📊 Dashboard" },
];

export default function App() {
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("home");
  const [prefill, setPrefill] = useState(null);

  const handleReSearch = (params) => {
    setPrefill(params);
    setResult(null);
    setTab("home");
  };

  return (
    <div className="min-h-screen flex flex-col font-sans"
      style={{ background: "linear-gradient(160deg,#fff0f3 0%,#fdf2f8 40%,#fce7f3 100%)" }}>

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-rose-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 bg-pink-300 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-fuchsia-200 rounded-full opacity-20 blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-20 flex justify-center gap-2 pt-6 px-4 flex-wrap">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => { setTab(t.id); setResult(null); }}
            className={`px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all cursor-pointer
              ${tab === t.id
                ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-200 scale-105"
                : "bg-white/70 text-rose-500 border border-rose-200 hover:bg-white backdrop-blur-sm"}`}>
            {t.label}
          </button>
        ))}
      </nav>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-4 pb-16">
        {tab === "home" && !result && <Hero onStartSearch={() => {}} />}

        {tab === "home" && (
          <div className={`w-full flex flex-col items-center ${!result ? "mt-0" : "mt-10"}`}>
            {!result
              ? <GiftForm onRecommend={setResult} prefill={prefill} onPrefillUsed={() => setPrefill(null)} />
              : <GiftResults result={result} onReset={() => setResult(null)} />}
          </div>
        )}
        {tab === "history"   && <div className="mt-10 w-full flex justify-center"><History onReSearch={handleReSearch} /></div>}
        {tab === "wishlist"  && <div className="mt-10 w-full flex justify-center"><Wishlist /></div>}
        {tab === "dashboard" && <div className="mt-10 w-full flex justify-center"><Dashboard /></div>}
      </main>

      <footer className="relative z-10 text-center py-5 text-rose-300 text-xs tracking-widest uppercase">
        Made with ❤️ — Gift with Love
      </footer>
    </div>
  );
}
