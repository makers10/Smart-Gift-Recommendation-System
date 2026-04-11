import { useEffect, useRef, useState } from "react";

const slides = [
  { emoji: "💍", name: "Diamond Pendant Necklace",   tag: "Wedding",        desc: "Timeless elegance for the most special day",        gradient: "from-rose-500 via-pink-500 to-fuchsia-500" },
  { emoji: "🌹", name: "Luxury Perfume Set",          tag: "Valentine's Day", desc: "A fragrance that lingers like a beautiful memory",   gradient: "from-pink-500 via-rose-400 to-red-400" },
  { emoji: "⌚", name: "Premium Smart Watch",         tag: "Birthday",       desc: "Style meets technology on their wrist",             gradient: "from-purple-500 via-pink-500 to-rose-400" },
  { emoji: "🧴", name: "Luxury Skincare Hamper",      tag: "Anniversary",    desc: "Pamper them with the finest skincare collection",    gradient: "from-fuchsia-500 via-pink-400 to-rose-400" },
  { emoji: "👜", name: "Designer Handbag",            tag: "Sister's Wedding","desc": "A statement piece she'll treasure forever",       gradient: "from-rose-600 via-pink-500 to-fuchsia-400" },
  { emoji: "🎧", name: "Apple AirPods Pro",           tag: "Graduation",     desc: "Premium sound for their next big adventure",        gradient: "from-indigo-500 via-purple-500 to-pink-500" },
  { emoji: "🛁", name: "Spa Day Retreat",             tag: "Mother's Day",   desc: "Give the gift of pure relaxation and bliss",        gradient: "from-pink-400 via-rose-400 to-fuchsia-500" },
  { emoji: "🪔", name: "Premium Diwali Hamper",       tag: "Diwali",         desc: "Celebrate the festival of lights in luxury",        gradient: "from-orange-500 via-rose-500 to-pink-500" },
  { emoji: "🎄", name: "Christmas Gift Hamper",       tag: "Christmas",      desc: "Spread joy with a curated festive collection",      gradient: "from-green-500 via-teal-400 to-rose-400" },
  { emoji: "💐", name: "Flower Subscription",         tag: "Mom's Birthday", desc: "Fresh blooms delivered every week with love",       gradient: "from-rose-400 via-pink-400 to-fuchsia-400" },
  { emoji: "📸", name: "Personalized Photo Book",     tag: "Farewell",       desc: "Memories bound together in a beautiful keepsake",   gradient: "from-amber-500 via-rose-400 to-pink-500" },
  { emoji: "🍫", name: "Artisan Chocolate Box",       tag: "Thank You",      desc: "Handcrafted chocolates to sweeten any moment",      gradient: "from-rose-500 via-amber-400 to-pink-400" },
];

const occasions = [
  "💍 Wedding","🎂 Birthday","🎓 Graduation","❤️ Valentine's",
  "🌸 Mother's Day","🪔 Diwali","🎄 Christmas","🌙 Eid",
  "🎆 New Year","🏠 Housewarming","👋 Farewell","🏆 Promotion",
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);
  const timerRef = useRef(null);

  const goTo = (i) => setCurrent((i + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 3500);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  const slide = slides[current];

  return (
    <div className="w-full max-w-5xl mx-auto pt-4 pb-2">

      {/* ── HERO HEADLINE ── */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-3 drop-shadow-sm">🌹</div>
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-rose-700 leading-tight tracking-tight">
          Gift with Love
        </h1>
        <p className="text-rose-400 mt-2 text-sm tracking-[0.25em] uppercase font-light">
          Curated gifts for every heart & occasion
        </p>
        <div className="flex justify-center gap-6 mt-4 text-sm text-rose-500 font-medium">
          <span>✨ 282+ Gift Ideas</span>
          <span className="text-rose-200">|</span>
          <span>💝 20+ Relationships</span>
          <span className="text-rose-200">|</span>
          <span>🎉 30+ Occasions</span>
        </div>
      </div>

      {/* ── SLIDING WINDOW ── */}
      <div className="mb-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}>

        <h2 className="font-serif text-xl font-bold text-rose-600 text-center mb-4 tracking-wide">
          ✨ Featured Gift Ideas
        </h2>

        {/* Main slide */}
        <div className={`relative bg-gradient-to-br ${slide.gradient} rounded-3xl overflow-hidden shadow-2xl`}
          style={{ minHeight: 220 }}>

          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 p-8 md:p-10">
            {/* Emoji */}
            <div className="w-28 h-28 md:w-36 md:h-36 bg-white/20 backdrop-blur-sm rounded-3xl
              flex items-center justify-center text-6xl md:text-7xl shadow-xl shrink-0 border border-white/30">
              {slide.emoji}
            </div>

            {/* Text */}
            <div className="text-white text-center md:text-left flex-1">
              <span className="inline-block bg-white/25 backdrop-blur-sm text-white text-xs font-bold
                px-3 py-1 rounded-full mb-3 border border-white/30 tracking-wide uppercase">
                {slide.tag}
              </span>
              <h3 className="font-serif text-3xl md:text-4xl font-bold leading-tight mb-2">
                {slide.name}
              </h3>
              <p className="text-white/80 text-base">{slide.desc}</p>

              {/* Slide counter */}
              <p className="text-white/50 text-xs mt-3 font-medium">
                {current + 1} / {slides.length}
              </p>
            </div>
          </div>

          {/* Prev / Next arrows */}
          <button onClick={() => goTo(current - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/40
              backdrop-blur-sm rounded-full flex items-center justify-center text-white
              border border-white/30 transition cursor-pointer text-lg font-bold z-20">
            ‹
          </button>
          <button onClick={() => goTo(current + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/40
              backdrop-blur-sm rounded-full flex items-center justify-center text-white
              border border-white/30 transition cursor-pointer text-lg font-bold z-20">
            ›
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all cursor-pointer
                ${i === current ? "w-6 h-2.5 bg-rose-500" : "w-2.5 h-2.5 bg-rose-200 hover:bg-rose-300"}`} />
          ))}
        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
          {slides.map((s, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-2xl
                border-2 transition-all cursor-pointer text-center
                ${i === current
                  ? "border-rose-400 bg-rose-50 shadow-md scale-105"
                  : "border-transparent bg-white/60 hover:bg-white/80 hover:border-rose-200"}`}>
              <span className="text-xl">{s.emoji}</span>
              <span className="text-xs font-medium text-gray-700 whitespace-nowrap max-w-[72px] truncate">{s.name}</span>
              <span className="text-xs text-rose-400 whitespace-nowrap">{s.tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── OCCASION PILLS ── */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {occasions.map((o) => (
          <span key={o}
            className="px-4 py-1.5 bg-white/80 border border-rose-100 rounded-full
              text-sm text-rose-600 font-medium shadow-sm hover:bg-rose-50
              hover:border-rose-300 transition cursor-default backdrop-blur-sm">
            {o}
          </span>
        ))}
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: "🎁", value: "282+", label: "Gift Combinations" },
          { icon: "💑", value: "20+",  label: "Relationships" },
          { icon: "🌍", value: "30+",  label: "Festivals & Occasions" },
        ].map((s) => (
          <div key={s.label}
            className="bg-white/70 backdrop-blur-sm border border-rose-100 rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition">
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="font-serif text-2xl font-bold text-rose-600">{s.value}</p>
            <p className="text-xs text-rose-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Arrow to form */}
      <div className="text-center mb-2">
        <div className="inline-flex flex-col items-center gap-1 text-rose-300">
          <span className="text-sm tracking-wide">Find your perfect gift below</span>
          <span className="text-2xl animate-bounce">↓</span>
        </div>
      </div>
    </div>
  );
}
