const featuredGifts = [
  { emoji: "💍", name: "Diamond Pendant Necklace", tag: "Wedding", color: "from-rose-400 to-pink-500" },
  { emoji: "🌹", name: "Luxury Perfume Set", tag: "Valentine's", color: "from-pink-400 to-fuchsia-500" },
  { emoji: "⌚", name: "Premium Smart Watch", tag: "Birthday", color: "from-purple-400 to-pink-500" },
  { emoji: "🧴", name: "Luxury Skincare Hamper", tag: "Anniversary", color: "from-rose-500 to-red-400" },
  { emoji: "👜", name: "Designer Handbag", tag: "Sister's Wedding", color: "from-fuchsia-400 to-rose-500" },
  { emoji: "🎧", name: "Apple AirPods Pro", tag: "Graduation", color: "from-pink-500 to-rose-400" },
  { emoji: "🛁", name: "Spa Day Retreat", tag: "Mother's Day", color: "from-rose-300 to-pink-400" },
  { emoji: "🍫", name: "Artisan Chocolate Box", tag: "Thank You", color: "from-amber-400 to-rose-400" },
  { emoji: "📚", name: "Personalized Photo Book", tag: "Farewell", color: "from-pink-400 to-purple-400" },
  { emoji: "🪔", name: "Premium Diwali Hamper", tag: "Diwali", color: "from-orange-400 to-rose-400" },
  { emoji: "🎄", name: "Christmas Gift Hamper", tag: "Christmas", color: "from-green-400 to-rose-400" },
  { emoji: "💐", name: "Flower Subscription", tag: "Mom's Birthday", color: "from-rose-400 to-fuchsia-400" },
];

const occasions = [
  { emoji: "💍", label: "Wedding" },
  { emoji: "🎂", label: "Birthday" },
  { emoji: "🎓", label: "Graduation" },
  { emoji: "❤️", label: "Valentine's" },
  { emoji: "🌸", label: "Mother's Day" },
  { emoji: "🪔", label: "Diwali" },
  { emoji: "🎄", label: "Christmas" },
  { emoji: "🌙", label: "Eid" },
  { emoji: "🎆", label: "New Year" },
  { emoji: "🏠", label: "Housewarming" },
];

export default function Hero() {
  return (
    <div className="w-full max-w-5xl mx-auto pt-6 pb-4">

      {/* Main headline */}
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🌹</div>
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-rose-700 leading-tight">
          Gift with Love
        </h1>
        <p className="text-rose-400 mt-3 text-base tracking-widest uppercase font-light">
          Curated gifts for every heart & occasion
        </p>
        <div className="flex justify-center gap-6 mt-5 text-sm text-rose-500">
          <span className="flex items-center gap-1"><span>✨</span> 280+ Gift Ideas</span>
          <span className="flex items-center gap-1"><span>💝</span> 20+ Relationships</span>
          <span className="flex items-center gap-1"><span>🎉</span> 30+ Occasions</span>
        </div>
      </div>

      {/* Occasion pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {occasions.map((o) => (
          <span key={o.label}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-white/80 border border-rose-100
              rounded-full text-sm text-rose-600 font-medium shadow-sm hover:shadow-rose-100
              hover:bg-rose-50 transition cursor-default backdrop-blur-sm">
            {o.emoji} {o.label}
          </span>
        ))}
      </div>

      {/* Featured gift cards grid */}
      <div className="mb-8">
        <h2 className="font-serif text-2xl font-bold text-rose-700 text-center mb-5">
          ✨ Featured Gift Ideas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {featuredGifts.map((g, i) => (
            <div key={i}
              className={`bg-gradient-to-br ${g.color} rounded-2xl p-4 text-white shadow-lg
                hover:scale-105 hover:shadow-xl transition-all duration-200 cursor-default`}>
              <div className="text-3xl mb-2">{g.emoji}</div>
              <p className="font-semibold text-sm leading-tight">{g.name}</p>
              <span className="inline-block mt-2 text-xs bg-white/25 px-2 py-0.5 rounded-full">
                {g.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: "🎁", value: "282+", label: "Gift Combinations" },
          { icon: "💑", value: "20+", label: "Relationships" },
          { icon: "🌍", value: "30+", label: "Festivals & Occasions" },
        ].map((s) => (
          <div key={s.label}
            className="bg-white/70 backdrop-blur-sm border border-rose-100 rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="font-serif text-2xl font-bold text-rose-600">{s.value}</p>
            <p className="text-xs text-rose-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Arrow pointing down to form */}
      <div className="text-center text-rose-300 animate-bounce text-2xl mb-2">↓</div>
      <p className="text-center text-rose-400 text-sm mb-4 tracking-wide">
        Fill in the form below to discover your perfect gift
      </p>
    </div>
  );
}
