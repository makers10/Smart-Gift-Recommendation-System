import { useState } from "react";
import GiftForm from "./components/GiftForm";
import GiftResults from "./components/GiftResults";
import "./App.css";

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="app">
      <header>
        <h1>🎁 Smart Gift Recommender</h1>
        <p>Find the perfect gift for every person and every occasion</p>
      </header>

      <main>
        {!result ? (
          <GiftForm onRecommend={setResult} />
        ) : (
          <GiftResults result={result} onReset={() => setResult(null)} />
        )}
      </main>

      <footer>
        <p>Made with ❤️ — Smart Gift Recommender</p>
      </footer>
    </div>
  );
}
