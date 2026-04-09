import { useState } from "react";
import GiftForm from "./components/GiftForm";
import GiftResults from "./components/GiftResults";

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-pink-50 flex flex-col">
      {/* Header */}
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold text-violet-700">🎁 Smart Gift Recommender</h1>
        <p className="text-gray-500 mt-2 text-base">Find the perfect gift for every person and every occasion</p>
      </header>

      {/* Main Card */}
      <main className="flex-1 flex items-start justify-center px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
          {!result ? (
            <GiftForm onRecommend={setResult} />
          ) : (
            <GiftResults result={result} onReset={() => setResult(null)} />
          )}
        </div>
      </main>

      <footer className="text-center py-4 text-gray-400 text-sm">
        Made with ❤️ — Smart Gift Recommender
      </footer>
    </div>
  );
}
