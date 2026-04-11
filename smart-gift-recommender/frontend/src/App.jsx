import { useState } from "react";
import GiftForm from "./components/GiftForm";
import GiftResults from "./components/GiftResults";
import Dashboard from "./components/Dashboard";
import Wishlist from "./components/Wishlist";
import History from "./components/History";

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
    <div className="min-h-screen flex flex-col" style={{background:"linear-gradient(160deg,#fff1f2 0%,#fdf2f8 50%,#fce7f3 100%)"}}>

      {/* Floating decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {["top-10 left-10","top-32 right-16","top-64 left-1/4","bottom-32 right-10","bottom-10 left-20","top-1/2 right-1/3"].map((pos,i) => (
          <span key={i} className={`absolute text-rose-200 opacity-40 select-none text-${i%2===0?"4xl":"2xl"} ${pos}`}>
            {["❤️","💕","🌹","💖","✨","💗"][i]}
          </span>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 text-center pt-12 pb-4 px-4">
        <div className="inline-block mb-2"><span className="text-5xl">🌹</span></div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-rose-700 tracking-wide">Gift with Love</h1>
        <p className="text-rose-400 mt-2 text-sm font-light tracking-widest uppercase">
          Curated gifts for every heart & occasion
        </p>
      </header>

      {/* Nav */}
      <nav className="relative z-10 flex justify-center gap-2 mb-6 px-4 flex-wrap">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => { setTab(t.id); setResult(null); }}
            className={`px-4 py-2 rounded-full text-sm font-medium tracking-wide transition-all cursor-pointer shadow-sm
              ${tab===t.id
                ?"bg-rose-500 text-white shadow-rose-200 shadow-md scale-105"
                :"bg-white/80 text-rose-500 border border-rose-200 hover:bg-rose-50 backdrop-blur-sm"}`}>
            {t.label}
          </button>
        ))}
      </nav>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-start justify-center px-4 pb-16">
        {tab === "home" && (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl shadow-rose-100 w-full max-w-md p-8 border border-rose-100">
            {!result
              ? <GiftForm onRecommend={setResult} prefill={prefill} onPrefillUsed={() => setPrefill(null)} />
              : <GiftResults result={result} onReset={() => setResult(null)} />}
          </div>
        )}
        {tab === "history"   && <History onReSearch={handleReSearch} />}
        {tab === "wishlist"  && <Wishlist />}
        {tab === "dashboard" && <Dashboard />}
      </main>

      <footer className="relative z-10 text-center py-5 text-rose-300 text-xs tracking-widest uppercase">
        Made with ❤️ — Gift with Love
      </footer>
    </div>
  );
}
