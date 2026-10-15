/**
 * SiteHeader — Gift with Love
 *
 * Premium, responsive application header.
 *
 * Desktop (md+):
 *   [Logo / Wordmark]   [Find a Gift] [Custom Made]   [History] [Wishlist] [Dashboard]
 *
 * Mobile (<md):
 *   [Logo / Wordmark]                                            [Hamburger button]
 *   ↓ Drawer slides in from the right with all nav items
 *
 * Accessibility:
 *   - <header> landmark with aria-label
 *   - <nav> landmark with aria-label
 *   - Active item carries aria-current="page"
 *   - Hamburger button carries aria-expanded and aria-controls
 *   - Drawer is role="dialog" aria-modal="true" with a REAL focus trap
 *   - Escape key closes drawer and returns focus to hamburger
 *   - Overlay click closes drawer
 *   - Tab/Shift+Tab cycle stays within the drawer while it is open
 *   - All interactive elements have visible focus rings from global CSS
 *
 * Props:
 *   tab        {string}   — current active tab id
 *   onNavigate {function} — called with tab id when user navigates
 */
import { useState, useEffect, useRef, useCallback } from "react";

// ── Inline SVG icons (Lucide-style, 24×24 stroke) ─────────────────────────

function IconMenu({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <line x1="4" y1="6"  x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

function IconX({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <line x1="18" y1="6"  x2="6"  y2="18" />
      <line x1="6"  y1="6"  x2="18" y2="18" />
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

// ── Navigation items ────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "home",      label: "Find a Gift",  isPrimary: true  },
  { id: "custom",    label: "Custom Made",  isPrimary: true  },
  { id: "history",   label: "History",      isPrimary: false },
  { id: "wishlist",  label: "Wishlist",     isPrimary: false },
  { id: "dashboard", label: "Dashboard",    isPrimary: false },
];

// ── Component ───────────────────────────────────────────────────────────────

export default function SiteHeader({ tab, onNavigate }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef    = useRef(null);
  const hamburgerRef = useRef(null);

  // ── Focus trap inside the drawer ─────────────────────────────────────────
  // When the drawer is open, Tab/Shift+Tab cycle only within focusable drawer
  // elements, preventing keyboard users from reaching background content.
  const handleDrawerKeyDown = useCallback((e) => {
    if (!drawerOpen) return;

    if (e.key === "Escape") {
      setDrawerOpen(false);
      hamburgerRef.current?.focus();
      return;
    }

    if (e.key !== "Tab") return;

    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusable = drawer.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      // Shift+Tab: if on first element, wrap to last
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // Tab: if on last element, wrap to first
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [drawerOpen]);

  useEffect(() => {
    document.addEventListener("keydown", handleDrawerKeyDown);
    return () => document.removeEventListener("keydown", handleDrawerKeyDown);
  }, [handleDrawerKeyDown]);

  // Move focus into the drawer when it opens
  useEffect(() => {
    if (drawerOpen && drawerRef.current) {
      // Focus the close button (first focusable element in the drawer header)
      const firstFocusable = drawerRef.current.querySelector("button");
      firstFocusable?.focus();
    }
  }, [drawerOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const navigate = (id) => {
    onNavigate(id);
    setDrawerOpen(false);
  };

  // ── Desktop nav link ──────────────────────────────────────────────────────
  const DesktopLink = ({ item }) => {
    const isActive = tab === item.id;
    return (
      <button
        onClick={() => navigate(item.id)}
        aria-current={isActive ? "page" : undefined}
        className={[
          "relative px-1 py-5 text-sm font-medium tracking-wide transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-500 focus-visible:ring-offset-2 rounded-sm",
          // Primary items (shopping-focused) are slightly more prominent
          item.isPrimary
            ? isActive
              ? "text-burgundy-600"
              : "text-neutral-700 hover:text-burgundy-600"
            : isActive
              ? "text-burgundy-500"
              : "text-neutral-500 hover:text-burgundy-500",
        ].join(" ")}
      >
        {item.label}
        {/* Active underline */}
        <span
          className={[
            "absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-200",
            isActive ? "bg-burgundy-600 opacity-100" : "opacity-0 bg-burgundy-400",
          ].join(" ")}
          aria-hidden="true"
        />
      </button>
    );
  };

  // ── Mobile drawer link ────────────────────────────────────────────────────
  const DrawerLink = ({ item }) => {
    const isActive = tab === item.id;
    return (
      <button
        onClick={() => navigate(item.id)}
        aria-current={isActive ? "page" : undefined}
        className={[
          "relative w-full flex items-center gap-3 px-6 py-3.5 text-left text-base font-medium",
          "transition-colors duration-150 rounded-none border-b border-ivory-200 last:border-0",
          "focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-burgundy-500",
          isActive
            ? "bg-burgundy-50 text-burgundy-600"
            : "text-neutral-700 hover:bg-ivory-200 hover:text-burgundy-600",
        ].join(" ")}
      >
        {/* Active indicator bar */}
        <span
          className={[
            "absolute left-0 top-0 bottom-0 w-0.5 rounded-r-full transition-opacity duration-150",
            isActive ? "bg-burgundy-600 opacity-100" : "opacity-0",
          ].join(" ")}
          aria-hidden="true"
        />
        <span className="flex-1">{item.label}</span>
        {isActive && (
          <span className="w-1.5 h-1.5 rounded-full bg-burgundy-500 shrink-0" aria-hidden="true" />
        )}
      </button>
    );
  };

  return (
    <>
      {/* ── HEADER BAR ───────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-ivory-300"
        style={{ boxShadow: "0 1px 0 0 #ecdcc8" }}
        aria-label="Site header"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">

            {/* ── Wordmark ───────────────────────────────────────────────── */}
            <button
              onClick={() => navigate("home")}
              className="flex items-center gap-2.5 mr-8 shrink-0 group
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-500
                focus-visible:ring-offset-2 rounded-sm"
              aria-label="Gift with Love — home"
            >
              <span
                className="flex items-center justify-center w-8 h-8 rounded-full
                  bg-burgundy-600 text-white shadow-sm
                  group-hover:bg-burgundy-700 transition-colors duration-150"
                aria-hidden="true"
              >
                <IconGift className="w-4 h-4" />
              </span>
              <span className="font-serif text-xl font-semibold text-burgundy-700
                group-hover:text-burgundy-900 transition-colors duration-150 leading-none">
                Gift with Love
              </span>
            </button>

            {/* ── Desktop navigation ─────────────────────────────────────── */}
            <nav
              className="hidden md:flex items-center gap-1 flex-1"
              aria-label="Main navigation"
            >
              {NAV_ITEMS.map((item) => (
                <DesktopLink key={item.id} item={item} />
              ))}
            </nav>

            {/* ── Mobile hamburger ───────────────────────────────────────── */}
            <div className="flex md:hidden ml-auto">
              <button
                ref={hamburgerRef}
                onClick={() => setDrawerOpen((o) => !o)}
                aria-expanded={drawerOpen}
                aria-controls="mobile-nav-drawer"
                aria-label={drawerOpen ? "Close navigation menu" : "Open navigation menu"}
                className="min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center rounded-base text-neutral-600 hover:text-burgundy-600
                  hover:bg-burgundy-50 transition-colors duration-150
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-500
                  focus-visible:ring-offset-2"
              >
                {drawerOpen ? <IconX /> : <IconMenu />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ──────────────────────────────────────────────────── */}
      {/* Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <div
        id="mobile-nav-drawer"
        ref={drawerRef}
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
        aria-hidden={!drawerOpen}
        className={[
          "fixed top-0 right-0 bottom-0 z-50 w-72 bg-white shadow-xl",
          "flex flex-col md:hidden",
          "transition-all duration-200 ease-out",
          drawerOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none invisible",
        ].join(" ")}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-ivory-300 shrink-0">
          <span className="font-serif text-lg font-semibold text-burgundy-700">
            Gift with Love
          </span>
          <button
            onClick={() => { setDrawerOpen(false); hamburgerRef.current?.focus(); }}
            aria-label="Close navigation menu"
            className="min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center rounded-base text-neutral-500 hover:text-burgundy-600
              hover:bg-burgundy-50 transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-500
              focus-visible:ring-offset-2"
          >
            <IconX />
          </button>
        </div>

        {/* Drawer nav items */}
        <nav
          className="flex-1 overflow-y-auto py-2"
          aria-label="Mobile navigation"
        >
          <div className="relative">
            {NAV_ITEMS.map((item) => (
              <DrawerLink key={item.id} item={item} />
            ))}
          </div>
        </nav>

        {/* Drawer footer */}
        <div className="px-6 py-4 border-t border-ivory-300 shrink-0">
          <p className="text-xs text-neutral-500 tracking-wide">
            Curated gifts for every heart &amp; occasion
          </p>
        </div>
      </div>
    </>
  );
}
