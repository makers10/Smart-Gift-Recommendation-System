import { useEffect, useRef, useState } from "react";

const slides = [
  { emoji: "💍", name: "Diamond Pendant Necklace",   tag: "Wedding",         desc: "Timeless elegance for the most special day of her life",          gradient: "from-rose-500 via-pink-500 to-fuchsia-600" },
  { emoji: "🌹", name: "Luxury Perfume Set",          tag: "Valentine's Day", desc: "A fragrance that lingers like a beautiful memory forever",         gradient: "from-pink-600 via-rose-500 to-red-500" },
  { emoji: "⌚", name: "Premium Smart Watch",         tag: "Birthday",        desc: "Style meets technology — the perfect gift for any wrist",          gradient: "from-violet-600 via-purple-500 to-pink-500" },
  { emoji: "🧴", name: "Luxury Skincare Hamper",      tag: "Anniversary",     desc: "Pamper them with the finest skincare collection available",        gradient: "from-fuchsia-600 via-pink-500 to-rose-400" },
  { emoji: "👜", name: "Designer Handbag",            tag: "Sister's Wedding","desc": "A statement piece she will treasure and cherish forever",        gradient: "from-rose-600 via-pink-600 to-fuchsia-500" },
  { emoji: "🎧", name: "Apple AirPods Pro",           tag: "Graduation",      desc: "Premium sound quality for their next big adventure ahead",         gradient: "from-indigo-600 via-violet-500 to-pink-500" },
  { emoji: "🛁", name: "Spa Day Retreat",             tag: "Mother's Day",    desc: "Give the gift of pure relaxation, bliss and self-care",            gradient: "from-pink-500 via-rose-400 to-fuchsia-500" },
  { emoji: "🪔", name: "Premium Diwali Hamper",       tag: "Diwali",          desc: "Celebrate the festival of lights with a luxurious hamper",         gradient: "from-orange-500 via-rose-500 to-pink-600" },
  { emoji: "🎄", name: "Christmas Gift Hamper",       tag: "Christmas",       desc: "Spread festive joy with a beautifully curated gift collection",    gradient: "from-emerald-500 via-teal-500 to-rose-500" },
  { emoji: "💐", name: "Flower Subscription",         tag: "Mom's Birthday",  desc: "Fresh blooms delivered every week — a gift that keeps giving",     gradient: "from-rose-400 via-pink-500 to-fuchsia-500" },
  { emoji: "📸", name: "Personalized Photo Book",     tag: "Farewell",        desc: "Precious memories bound together in a beautiful keepsake book",    gradient: "from-amber-500 via-rose-500 to-pink-500" },
  { emoji: "🍫", name: "Artisan Chocolate Box",       tag: "Thank You",       desc: "Handcrafted luxury chocolates to sweeten any special moment",      gradient: "from-rose-500 via-amber-500 to-pink-400" },
];

const occasions = [
  "💍 Wedding","🎂 Birthday","🎓 Graduation","❤️ Valentine's",
  "🌸 Mother's Day","🪔 Diwali","🎄 Christmas","🌙 Eid",
  "🎆 New Year","🏠 Housewarming","👋 Farewell","🏆 Promotion",
  "🪢 Raksha Bandhan","🐘 Ganesh Chaturthi","🌺 Onam","🐉 Chinese New Year",
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);
  const timerRef = useRef(null);

  const goTo = (i) => setCurrent((i + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 4000);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  const slide = slides[current];

  return (
    <div className="w-full max-w-6xl mx-auto pt-6 pb-4 px-2">

      {/* ── HEADLINE ── */}
      <div className="text-center mb-10">
        <div className="text-7xl mb-4 drop-shadow-sm">🌹</div>
        <h1 className="font-serif text-6xl md:text-7xl font-bold text-rose-800 leading-tight tracking-tight">
          Gift with Love
        </h1>
        <p className="text-rose-400 mt-3 text-sm tracking-[0.3em] uppercase font-light">
          Curated gifts for every heart & occasion
        </p>
        <div className="flex justify-center gap-6 mt-5 text-sm text-rose-500 font-medium">
          <span>✨ 282+ Gift Ideas</span>
          <span className="text-rose-200">|</span>
          <span>💝 20+ Relationships</span>
          <span className="text-rose-200">|</span>
          <span>🎉 30+ Occasions</span>
        </div>
      </div>

      {/* ── SLIDING WINDOW ── */}
      <div className="mb-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}>

        <h2 className="text-rose-500 text-sm font-semibold tracking-[0.2em] uppercase text-center mb-5">
          ✨ Featured Gift Ideas
        </h2>

        {/* Main large slide */}
        <div className={`relative bg-gradient-to-br ${slide.gradient} rounded-3xl overflow-hidden shadow-2xl shadow-black/40`}
          style={{ minHeight: 320 }}>

          {/* Decorative circles */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full" />

          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-10 md:p-14">

            {/* Big emoji box */}
            <div className="w-40 h-40 md:w-52 md:h-52 bg-white/20 backdrop-blur-md rounded-3xl
              flex items-center justify-center shadow-2xl shrink-0 border border-white/30
              hover:scale-105 transition-transform duration-300">
              <span className="text-7xl md:text-8xl drop-shadow-lg">{slide.emoji}</span>
            </div>

            {/* Text content */}
            <div className="text-white text-center md:text-left flex-1">
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold
                px-4 py-1.5 rounded-full mb-4 border border-white/30 tracking-widest uppercase shadow-sm">
                {slide.tag}
              </span>
              <h3 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-3 drop-shadow-md">
                {slide.name}
              </h3>
              <p className="text-white/75 text-lg md:text-xl leading-relaxed max-w-lg">
                {slide.desc}
              </p>

              {/* Progress bar */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white/70 rounded-full transition-all duration-300"
                    style={{ width: `${((current + 1) / slides.length) * 100}%` }} />
                </div>
              <span className="text-white/50 text-xs font-medium whitespace-nowrap">
                {current + 1} / {slides.length}
              </span>
              </div>
            </div>
          </div>

          {/* Prev / Next */}
          <button onClick={() => goTo(current - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/20 hover:bg-black/40
              backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl font-bold
              border border-white/20 transition-all cursor-pointer z-20 hover:scale-110">
            ‹
          </button>
          <button onClick={() => goTo(current + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/20 hover:bg-black/40
              backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl font-bold
              border border-white/20 transition-all cursor-pointer z-20 hover:scale-110">
            ›
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-5">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer
                ${i === current
                  ? "w-8 h-2.5 bg-rose-500"
                  : "w-2.5 h-2.5 bg-rose-200 hover:bg-rose-300"}`} />
          ))}
        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-3 mt-5 overflow-x-auto pb-2 scrollbar-hide">
          {slides.map((s, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl
                border transition-all cursor-pointer min-w-[90px]
                ${i === current
                  ? "border-rose-400 bg-rose-50 shadow-md scale-105"
                  : "border-rose-100 bg-white hover:bg-rose-50 hover:border-rose-200"}`}>
              <span className="text-2xl">{s.emoji}</span>
              <span className="text-xs font-medium text-gray-700 whitespace-nowrap max-w-[80px] truncate text-center">{s.name}</span>
              <span className="text-xs text-rose-400 whitespace-nowrap">{s.tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── OCCASION PILLS ── */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {occasions.map((o) => (
          <span key={o}
            className="px-4 py-1.5 bg-white border border-rose-100 rounded-full
              text-sm text-rose-600 font-medium hover:bg-rose-50 hover:border-rose-300
              transition cursor-default shadow-sm">
            {o}
          </span>
        ))}
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: "🎁", value: "282+", label: "Gift Combinations" },
          { icon: "💑", value: "20+",  label: "Relationships" },
          { icon: "🌍", value: "30+",  label: "Festivals & Occasions" },
        ].map((s) => (
          <div key={s.label}
            className="bg-white border border-rose-100 rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition">
            <div className="text-3xl mb-2">{s.icon}</div>
            <p className="font-serif text-3xl font-bold text-rose-700">{s.value}</p>
            <p className="text-xs text-rose-400 mt-1 tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Arrow */}
      <div className="text-center mb-4">
        <div className="inline-flex flex-col items-center gap-1 text-rose-300">
          <span className="text-xs tracking-widest uppercase">Find your perfect gift below</span>
          <span className="text-3xl animate-bounce">↓</span>
        </div>
      </div>
    </div>
  );
}
