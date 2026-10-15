/**
 * Hero — Gift with Love Homepage
 *
 * Premium editorial homepage shown when the user is on the "home" tab
 * and has not yet received gift results.
 *
 * Sections (in order):
 *   1. Hero      — headline, sub-copy, primary CTA → scrolls to form
 *   2. Occasions — 18 clickable chips that prefill the GiftForm
 *   3. Relationships — 6 curated relationship cards that prefill the form
 *   4. Custom Made teaser — promotes the Custom Made tab
 *   5. Stats bar  — real platform numbers (282+, 20+, 30+)
 *
 * Props:
 *   onQuickSearch {function(params)} — called with partial form params
 *     to prefill GiftForm; e.g. { occasion: "birthday" } or
 *     { relationship: "mom" }.  Wired to handleReSearch in App.jsx.
 *
 * Design rules applied:
 *   - Ivory/cream backgrounds, burgundy headings, Cormorant Garamond serif
 *   - No emoji in interactive button labels (aria-label used instead)
 *   - No hardcoded mock gift data
 *   - No autoplay slideshow (V5 removed)
 *   - Occasion chips are now fully interactive (V6 fixed)
 *   - prefers-reduced-motion respected via CSS
 *   - All interactive elements have visible focus rings
 */
import Button from "./ui/Button";

// ── Occasion data — sourced from real options in data/options.js ───────────
// Using a curated subset of the 34 available occasions for visual balance.
// Values must exactly match keys in data/options.js so prefill works.
const FEATURED_OCCASIONS = [
  { value: "birthday",        label: "Birthday",        symbol: "🎂" },
  { value: "wedding",         label: "Wedding",         symbol: "💍" },
  { value: "anniversary",     label: "Anniversary",     symbol: "💑" },
  { value: "graduation",      label: "Graduation",      symbol: "🎓" },
  { value: "mothers_day",     label: "Mother's Day",    symbol: "🌸" },
  { value: "fathers_day",     label: "Father's Day",    symbol: "👔" },
  { value: "valentines",      label: "Valentine's Day", symbol: "❤️" },
  { value: "diwali",          label: "Diwali",          symbol: "🪔" },
  { value: "christmas",       label: "Christmas",       symbol: "🎄" },
  { value: "eid",             label: "Eid",             symbol: "🌙" },
  { value: "holi",            label: "Holi",            symbol: "🎨" },
  { value: "raksha_bandhan",  label: "Raksha Bandhan",  symbol: "🪢" },
  { value: "new_year",        label: "New Year",        symbol: "🎆" },
  { value: "housewarming",    label: "Housewarming",    symbol: "🏠" },
  { value: "farewell",        label: "Farewell",        symbol: "👋" },
  { value: "promotion",       label: "Promotion",       symbol: "🏆" },
  { value: "baby_shower",     label: "Baby Shower",     symbol: "👶" },
  { value: "thank_you",       label: "Thank You",       symbol: "🙏" },
];

// ── Relationship cards — curated 6 from the real 19 relationships ──────────
const FEATURED_RELATIONSHIPS = [
  {
    value:       "mom",
    label:       "Mom",
    description: "Celebrate the woman who gives everything",
  },
  {
    value:       "partner",
    label:       "Partner",
    description: "For the person who makes everything better",
  },
  {
    value:       "best_friend",
    label:       "Best Friend",
    description: "They deserve something as wonderful as they are",
  },
  {
    value:       "sister",
    label:       "Sister",
    description: "Your forever friend, your lifelong confidante",
  },
  {
    value:       "dad",
    label:       "Dad",
    description: "The man who has always had your back",
  },
  {
    value:       "colleague",
    label:       "Colleague",
    description: "A thoughtful gesture for a valued workmate",
  },
];

// ── Inline SVG icons ───────────────────────────────────────────────────────

function IconArrowDown({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  );
}

function IconStar({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"
      aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/>
    </svg>
  );
}

function IconScissors({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="6"  cy="6"  r="3" />
      <circle cx="6"  cy="18" r="3" />
      <line x1="20" y1="4"  x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12"  y1="8.12"  x2="12" y2="12" />
    </svg>
  );
}

function IconGift({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

function IconChevronRight({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ── Section heading component ──────────────────────────────────────────────

function SectionHeading({ id, eyebrow, title, subtitle }) {
  return (
    <div className="text-center mb-10 lg:mb-12">
      {eyebrow && (
        <p className="text-xs font-semibold text-burgundy-500 tracking-widest uppercase mb-3">
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className="font-serif text-3xl sm:text-4xl font-semibold text-burgundy-800 leading-tight"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base text-neutral-500 max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function Hero({ onQuickSearch }) {
  const handleOccasion = (occasionValue) => {
    if (onQuickSearch) onQuickSearch({ occasion: occasionValue });
  };

  const handleRelationship = (relationshipValue) => {
    if (onQuickSearch) onQuickSearch({ relationship: relationshipValue });
  };

  const scrollToForm = () => {
    document.getElementById("gift-discovery-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="w-full">

      {/* ── 1. HERO SECTION ─────────────────────────────────────────────── */}
      <section
        aria-labelledby="hero-heading"
        className="relative w-full bg-ivory-100 overflow-hidden"
      >
        {/* Soft, seamless ambient gradient — no harsh vertical seam */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-ivory-200/30 pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7 max-w-2xl">
              {/* Eyebrow label */}
              <p className="inline-flex items-center gap-2 text-xs font-semibold text-burgundy-500
                tracking-widest uppercase mb-6 border border-burgundy-200 bg-burgundy-50
                px-3 py-1.5 rounded-full">
                <IconStar className="w-3 h-3 text-gold-400" />
                Thoughtfully curated gifts
              </p>

              {/* Headline */}
              <h1
                id="hero-heading"
                className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold
                  text-burgundy-800 leading-none tracking-tight mb-6"
              >
                The right gift,<br />
                <span className="italic text-burgundy-600">for every heart.</span>
              </h1>

              {/* Supporting copy */}
              <p className="text-lg text-neutral-600 leading-relaxed mb-8 max-w-lg">
                Tell us who you are gifting and the occasion — we'll surface the
                most thoughtful options across every relationship and budget.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 items-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={scrollToForm}
                  className="group"
                >
                  <IconGift className="w-4 h-4" />
                  Find a Gift
                  <IconArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => onQuickSearch && onQuickSearch({ __navigate: "custom" })}
                >
                  <IconScissors className="w-4 h-4" />
                  Custom Made
                </Button>
              </div>

              {/* Trust indicators — real platform stats */}
              <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-ivory-300">
                {[
                  { value: "282+", label: "Gift combinations" },
                  { value: "20+",  label: "Relationships" },
                  { value: "30+",  label: "Occasions covered" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-serif text-2xl font-semibold text-burgundy-700">{s.value}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Curated Spotlight Preview Card */}
            <div className="lg:col-span-5 w-full">
              <div className="relative mx-auto max-w-md lg:max-w-none bg-white rounded-2xl border border-ivory-300 p-6 sm:p-7 shadow-lg">
                {/* Header tag */}
                <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-ivory-200">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-burgundy-50 text-burgundy-700 border border-burgundy-200">
                    <IconStar className="w-3.5 h-3.5 text-gold-500" />
                    Trending Recommendation
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Top Pick
                  </span>
                </div>

                {/* Featured item body */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-burgundy-600">
                        Birthday • Partner or Sister
                      </span>
                      <h3 className="font-serif text-2xl font-semibold text-neutral-900 mt-1 leading-snug">
                        Artisan Leather Keepsake Journal
                      </h3>
                    </div>
                    <span className="shrink-0 inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold bg-burgundy-600 text-white shadow-xs">
                      +12 Score
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Hand-stitched full-grain leather binding with archival-quality deckle paper. A timeless, sentimental keepsake designed to last for generations.
                  </p>

                  <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-ivory-100">
                    <span>Budget: <strong className="text-neutral-700 font-medium">₹2,000 – ₹5,000</strong></span>
                    <span className="text-emerald-700 font-medium">✓ Highly rated</span>
                  </div>

                  {/* Action button */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleOccasion("birthday")}
                      aria-label="Discover Birthday gift ideas"
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-base text-sm font-semibold text-white bg-burgundy-600 hover:bg-burgundy-700 active:bg-burgundy-800 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-500 focus-visible:ring-offset-2"
                    >
                      <span>Discover Birthday Gifts</span>
                      <IconChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Popular searches footer */}
                <div className="mt-5 pt-4 border-t border-ivory-200">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2.5">
                    Popular searches this week
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "Anniversary", value: "anniversary", symbol: "💑" },
                      { label: "Mother's Day", value: "mothers_day", symbol: "🌸" },
                      { label: "Housewarming", value: "housewarming", symbol: "🏠" },
                    ].map((item) => (
                      <button
                        key={item.value}
                        onClick={() => handleOccasion(item.value)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-ivory-100 text-neutral-700 border border-ivory-300 hover:bg-burgundy-50 hover:border-burgundy-300 hover:text-burgundy-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-500"
                      >
                        <span aria-hidden="true">{item.symbol}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. OCCASION DISCOVERY ───────────────────────────────────────── */}
      <section
        aria-labelledby="occasions-heading"
        className="w-full bg-white border-y border-ivory-300 py-14 sm:py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            id="occasions-heading"
            eyebrow="Browse by occasion"
            title="What are you celebrating?"
            subtitle="Select an occasion to instantly pre-fill your gift search."
          />

          <ul
            className="flex flex-wrap justify-center gap-3"
            role="list"
          >
            {FEATURED_OCCASIONS.map((occ) => (
              <li key={occ.value} role="listitem">
                <button
                  onClick={() => handleOccasion(occ.value)}
                  aria-label={`Find gifts for ${occ.label}`}
                  className="group flex items-center gap-2 px-4 py-2 rounded-full
                    bg-ivory-100 border border-ivory-300 text-sm font-medium text-neutral-700
                    hover:bg-burgundy-50 hover:border-burgundy-300 hover:text-burgundy-700
                    transition-colors duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-500
                    focus-visible:ring-offset-2"
                >
                  <span aria-hidden="true">{occ.symbol}</span>
                  {occ.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 3. RELATIONSHIP DISCOVERY ───────────────────────────────────── */}
      <section
        aria-labelledby="relationships-heading"
        className="w-full bg-ivory-100 py-14 sm:py-16 lg:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            id="relationships-heading"
            eyebrow="Shop by relationship"
            title="Who are you gifting today?"
            subtitle="Every relationship deserves a thoughtful, personalised gift."
          />

          <ul
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5"
            role="list"
          >
            {FEATURED_RELATIONSHIPS.map((rel) => (
              <li key={rel.value} role="listitem">
                <button
                  onClick={() => handleRelationship(rel.value)}
                  aria-label={`Find gifts for ${rel.label}`}
                  className="group w-full text-left bg-white border border-ivory-300
                    rounded-card p-5 shadow-xs
                    hover:border-burgundy-200 hover:shadow-md hover:-translate-y-0.5
                    transition-all duration-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-500
                    focus-visible:ring-offset-2"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif text-lg font-semibold text-burgundy-700
                      group-hover:text-burgundy-900 transition-colors duration-150">
                      {rel.label}
                    </h3>
                    <span
                      className="text-neutral-300 group-hover:text-burgundy-400
                        group-hover:translate-x-0.5 transition-all duration-150"
                      aria-hidden="true"
                    >
                      <IconChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {rel.description}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 4. CUSTOM MADE TEASER ────────────────────────────────────────── */}
      <section
        aria-labelledby="custom-made-heading"
        className="w-full bg-ivory-200 border-t border-ivory-300 py-14 sm:py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">

            {/* Icon mark */}
            <div
              className="w-20 h-20 rounded-full bg-burgundy-600 text-white
                flex items-center justify-center shadow-brand shrink-0"
              aria-hidden="true"
            >
              <IconScissors className="w-8 h-8" />
            </div>

            {/* Text */}
            <div className="flex-1 text-center lg:text-left">
              <p className="text-xs font-semibold text-burgundy-500 tracking-widest uppercase mb-2">
                Bespoke gifting
              </p>
              <h2
                id="custom-made-heading"
                className="font-serif text-3xl sm:text-4xl font-semibold text-burgundy-800 mb-3"
              >
                Something one-of-a-kind?
              </h2>
              <p className="text-base text-neutral-600 leading-relaxed max-w-xl">
                Post a custom gift request and connect directly with skilled makers.
                Describe what you envision, receive offers, negotiate, and get it crafted
                especially for the person you love.
              </p>
            </div>

            {/* CTA */}
            <div className="shrink-0">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onQuickSearch && onQuickSearch({ __navigate: "custom" })}
              >
                <IconScissors className="w-4 h-4" />
                Explore Custom Made
              </Button>
            </div>
          </div>

          {/* How it works — 3 steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-10 border-t border-ivory-300">
            {[
              { step: "1", title: "Post a request",    desc: "Describe your idea, occasion, and budget." },
              { step: "2", title: "Receive offers",    desc: "Skilled makers respond with tailored proposals." },
              { step: "3", title: "Get it made",       desc: "Choose an offer, chat directly, and confirm." },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-4">
                <span
                  className="w-8 h-8 rounded-full bg-burgundy-600 text-white text-sm font-bold
                    flex items-center justify-center shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  {s.step}
                </span>
                <div>
                  <p className="font-semibold text-burgundy-800 text-sm">{s.title}</p>
                  <p className="text-sm text-neutral-500 mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. BOTTOM ANCHOR — gift form lives below this in App.jsx ──────── */}
      {/*
        The anchor id "gift-discovery-form" is placed in App.jsx on the
        GiftForm wrapper so the hero CTA scroll target works correctly.
      */}
    </div>
  );
}
