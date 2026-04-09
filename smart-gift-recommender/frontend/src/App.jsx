import { useState } from "react";
import GiftForm from "./components/GiftForm";
import GiftResults from "./components/GiftResults";
import Dashboard from "./components/Dashboard";
import Wishlist from "./components/Wishlist";

const tabs = [
  { id: "home", label: "🎁 Recommend" },
  { id: "wishlist", label: "❤️ Wishlist" },
  { id: "dashboard", label: "📊 Dashboard" },
];

export default function App() {
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("home");

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-pink-50 flex flex-col">
      <header className="text-center pt-10 pb-4">
        <h1 className="text-4xl font-bold text-violet-700">🎁 Smart Gift Recommender</h1>
        <p className="text-gray-500 mt-1 text-sm">Find the perfect gift for every person and every occasion</p>
      </header>

      {/* Nav Tabs */}
      <nav className="flex justify-center gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setResult(null); }}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition cursor-pointer
              ${tab === t.id
                ? "bg-violet-600 text-white shadow"
                : "bg-white text-violet-600 border border-violet-300 hover:bg-violet-50"}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="flex-1 flex items-start justify-center px-4 pb-12">
        {tab === "home" && (
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
            {!result
              ? <GiftForm onRecommend={setResult} />
              : <GiftResults result={result} onReset={() => setResult(null)} />}
          </div>
        )}
        {tab === "wishlist" && <Wishlist />}
        {tab === "dashboard" && <Dashboard />}
      </main>

      <footer className="text-center py-4 text-gray-400 text-sm">
        Made with ❤️ — Smart Gift Recommender
      </footer>
    </div>
  );
}
