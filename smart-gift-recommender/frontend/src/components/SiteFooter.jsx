/**
 * SiteFooter — Gift with Love
 *
 * Brand footer with:
 *   - Left column: brand wordmark, short description, stat highlights
 *   - Center column: gift discovery section links
 *   - Right column: account/utility links
 *   - Bottom bar: copyright, no-invented policies
 *
 * Rules applied:
 *   - No invented contact details, business addresses, social profiles, or policies
 *   - Only links to sections that actually exist in the application
 *   - All links are tab-navigation buttons (no external URLs except Amazon buy links,
 *     which live in the gift cards themselves — not here)
 *
 * Props:
 *   onNavigate {function} — called with tab id when user clicks a nav link
 */

function FooterLink({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="block text-sm text-neutral-500 hover:text-burgundy-600 transition-colors
        duration-150 text-left focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-burgundy-500 focus-visible:ring-offset-2 rounded-sm"
    >
      {label}
    </button>
  );
}

export default function SiteFooter({ onNavigate }) {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-white border-t border-ivory-300 mt-auto"
      aria-label="Site footer"
    >
      {/* ── Main footer grid ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">

          {/* ── Brand column ─────────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <button
              onClick={() => onNavigate("home")}
              className="inline-flex items-center gap-2 mb-4 group
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-500
                focus-visible:ring-offset-2 rounded-sm"
              aria-label="Gift with Love — home"
            >
              <span
                className="w-7 h-7 rounded-full bg-burgundy-600 flex items-center justify-center
                  group-hover:bg-burgundy-700 transition-colors duration-150 shrink-0"
                aria-hidden="true"
              >
                {/* Gift ribbon mark — simple inline SVG */}
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                  strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 12 20 22 4 22 4 12" />
                  <rect x="2" y="7" width="20" height="5" />
                  <line x1="12" y1="22" x2="12" y2="7" />
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                </svg>
              </span>
              <span className="font-serif text-lg font-semibold text-burgundy-700
                group-hover:text-burgundy-900 transition-colors duration-150">
                Gift with Love
              </span>
            </button>

            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs mb-6">
              Thoughtfully curated gift recommendations for every relationship,
              occasion, and budget — because the right gift says everything words cannot.
            </p>

            {/* Mini stats */}
            <div className="flex gap-6">
              {[
                { value: "282+", label: "Gift ideas" },
                { value: "20+",  label: "Relationships" },
                { value: "30+",  label: "Occasions" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-serif text-xl font-semibold text-burgundy-600">{s.value}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Discover column ───────────────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-widest mb-4">
              Discover
            </h3>
            <nav aria-label="Footer discovery links" className="space-y-2.5">
              <FooterLink label="Find a Gift"  onClick={() => onNavigate("home")} />
              <FooterLink label="Custom Made"  onClick={() => onNavigate("custom")} />
              <FooterLink label="Wishlist"     onClick={() => onNavigate("wishlist")} />
              <FooterLink label="Search History" onClick={() => onNavigate("history")} />
            </nav>
          </div>

          {/* ── Your account column ───────────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-widest mb-4">
              Insights
            </h3>
            <nav aria-label="Footer account links" className="space-y-2.5">
              <FooterLink label="Dashboard &amp; Analytics" onClick={() => onNavigate("dashboard")} />
            </nav>

            {/*
              Note: contact, social media, privacy policy, and terms of service links
              are intentionally omitted — no real business details exist to reference.
              These sections should be added when actual information is available.
            */}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────────────── */}
      <div className="border-t border-ivory-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4
          flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* neutral-500 (#71717a on white = ~4.6:1) passes WCAG AA for small text */}
          <p className="text-xs text-neutral-500">
            &copy; {year} Gift with Love. All rights reserved.
          </p>
          <p className="text-xs text-neutral-500">
            Made with care for every special moment.
          </p>
        </div>
      </div>
    </footer>
  );
}
