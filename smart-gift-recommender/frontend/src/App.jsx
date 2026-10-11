import { useState } from "react";
import GiftForm from "./components/GiftForm";
import GiftResults from "./components/GiftResults";
import Dashboard from "./components/Dashboard";
import Wishlist from "./components/Wishlist";
import History from "./components/History";
import Hero from "./components/Hero";
import Marketplace from "./components/Marketplace";

const tabs = [
  { id: "home",        label: "🎁 Find a Gift" },
  { id: "custom",      label: "✂️ Custom Made" },
  { id: "history",     label: "🕰️ History" },
  { id: "wishlist",    label: "💌 Wishlist" },
  { id: "dashboard",   label: "📊 Dashboard" },
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
    <div className="min-h-screen flex flex-col relative" style={{ background: "#faf7f4" }}>

      {/* Soft decorative blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #fde8e8 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, #fce7f3 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #fef3c7 0%, transparent 70%)" }} />
      </div>

      {/* Top nav */}
      <nav className="relative z-20 flex justify-center gap-2 pt-6 px-4 flex-wrap">
        {tabs.map((t) => (
          <button key={t.id}
            onClick={() => { setTab(t.id); setResult(null); }}
            className={`px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all cursor-pointer
              ${tab === t.id
                ? "bg-rose-600 text-white shadow-lg shadow-rose-200"
                : "bg-white text-rose-700 border border-rose-100 hover:border-rose-300 hover:bg-rose-50 shadow-sm"}`}>
            {t.label}
          </button>
        ))}
      </nav>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-4 pb-16">
        {tab === "home" && !result && <Hero />}
        {tab === "home" && (
          <div className={`w-full flex flex-col items-center ${!result ? "mt-0" : "mt-10"}`}>
            {!result
              ? <GiftForm onRecommend={setResult} prefill={prefill} onPrefillUsed={() => setPrefill(null)} />
              : <GiftResults result={result} onReset={() => setResult(null)} />}
          </div>
        )}
        {tab === "custom"    && <div className="mt-8 w-full flex justify-center"><Marketplace /></div>}
        {tab === "history"   && <div className="mt-8 w-full flex justify-center"><History onReSearch={handleReSearch} /></div>}
        {tab === "wishlist"  && <div className="mt-8 w-full flex justify-center"><Wishlist /></div>}
        {tab === "dashboard" && <div className="mt-8 w-full flex justify-center"><Dashboard /></div>}
      </main>

      <footer className="relative z-10 text-center py-5 text-rose-300 text-xs tracking-widest uppercase">
        Made with ❤️ — Gift with Love
      </footer>
    </div>
  );
}
