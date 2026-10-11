# Gift with Love — Redesign Audit

**Stage:** Phase 1 — Stage A (Audit & Baseline)  
**Spec:** `.kiro/Design/UI-ux-new-design.md`  
**Auditor:** Kiro (automated code audit — no application code modified)

---

## 1. Project Structure

```
Smart Gift Recommendation System/
├── .env                          # Contains .gitignore patterns only — no actual secrets
├── .gitignore
├── README.md                     # One-line description only
├── docs/
│   └── REDESIGN_AUDIT.md         ← this file
└── smart-gift-recommender/
    ├── .kiro/Design/UI-ux-new-design.md
    ├── backend/
    │   ├── data/
    │   │   ├── __init__.py
    │   │   └── gifts.py          # 823 lines — 282 gift-bucket entries
    │   ├── routes/               # EMPTY directory (placeholder only)
    │   ├── database.py           # SQLite init + connection helpers
    │   ├── gift_data.db          # SQLite runtime artifact
    │   ├── main.py               # FastAPI app, ~280 lines
    │   ├── requirements.txt      # fastapi==0.111.0, uvicorn[standard]==0.29.0
    │   └── venv/                 # Python 3.11.9 — gitignored
    └── frontend/
        ├── index.html
        ├── package.json
        ├── postcss.config.js
        ├── tailwind.config.js
        ├── vite.config.js
        └── src/
            ├── App.jsx                      # Root SPA shell — tab-based nav
            ├── index.css                    # Tailwind + global overrides
            ├── main.jsx                     # ReactDOM entry
            ├── components/
            │   ├── Dashboard.jsx            # Analytics + Recharts (10.2 KB)
            │   ├── GiftForm.jsx             # 4-field recommendation form (5.5 KB)
            │   ├── GiftResults.jsx          # Gift card grid, vote & wishlist (8.0 KB)
            │   ├── Hero.jsx                 # Slideshow + stats + occasion pills (10.7 KB)
            │   ├── History.jsx              # Per-user search history (4.6 KB)
            │   ├── Marketplace.jsx          # Custom-made orders/offers/chat (20.1 KB)
            │   └── Wishlist.jsx             # Per-user saved gifts (2.8 KB)
            ├── data/
            │   └── options.js               # Relationship, occasion, budget arrays
            └── utils/
                └── api.js                   # apiFetch wrapper + localStorage user ID
```

**No `src/assets/` folder. No `public/` folder. No router library. No test files.**

---

## 2. Technology Stack

### Frontend

| Concern | Library / Tool | Version |
|---|---|---|
| UI framework | React | ^18.2.0 |
| Charts | Recharts | ^2.15.4 |
| Bundler | Vite | ^4.4.0 |
| CSS utility | Tailwind CSS | ^3.4.0 |
| PostCSS | autoprefixer | ^10.4.19 |
| Fonts | Google Fonts CDN | Playfair Display + Inter |
| Icons | None — emoji only | — |
| Animation | None — CSS transitions only | — |
| Router | **None** — tab-based `useState` | — |
| State management | React local `useState` only | — |
| Testing | **None configured** | — |

### Backend

| Concern | Library | Version |
|---|---|---|
| API framework | FastAPI | 0.111.0 |
| Server | Uvicorn (standard) | 0.29.0 |
| Validation | Pydantic v2 | 2.12.5 |
| Database | SQLite (stdlib `sqlite3`) | — |
| Python | 3.11.9 | — |

---

## 3. Page & Feature Inventory

### 3.1 Navigation Model

The app is a **flat tab SPA with no URL routing**. Navigation is a single `tab` state string in `App.jsx`. There are no browser-history entries, no shareable links, and no back-button support.

| Tab ID | Label | Primary Component(s) | Notes |
|---|---|---|---|
| `home` | 🎁 Find a Gift | `Hero` → `GiftForm` → `GiftResults` | Default on load |
| `custom` | ✂️ Custom Made | `Marketplace` | 3-view sub-state machine |
| `history` | 🕰️ History | `History` | Per-user, requires user ID header |
| `wishlist` | 💌 Wishlist | `Wishlist` | Per-user, requires user ID header |
| `dashboard` | 📊 Dashboard | `Dashboard` | Global analytics |

### 3.2 Feature Detail

#### Find a Gift (home tab)

**Hero** (visible only when no result is shown):
- Auto-advancing slideshow of 12 hardcoded gift ideas (4-second interval, pause-on-hover)
- Thumbnail strip of all 12 slides below the main slide
- Prev / Next navigation buttons
- Dot indicators (clickable)
- 16 occasion pills — decorative only, no interaction
- 3 stat cards: "282+ Gift Combinations", "20+ Relationships", "30+ Occasions"
- Animated bounce arrow pointing down to the form

**GiftForm**:
- 4 selects: Relationship (19 options), Gender (4 options), Budget (3 tiers), Occasion (34 options)
- Validation: all three required fields (relationship, occasion, budget) must be filled
- Submits `GET /api/recommend?relationship=&occasion=&budget=&gender=`
- Loading state on button while waiting

**GiftResults**:
- Sorted by community vote score (descending, re-sorted on every vote)
- Cards: gradient top bar, "Top Pick" badge on index 0, gift emoji icon, name, score chip
- Actions per card: 👍 Love / 👎 Nope (one-time vote), 🤍 Save to Wishlist, 🛒 Buy Now (Amazon India link)
- "Search Again" button resets to Hero + GiftForm view

#### Custom Made (custom tab — Marketplace)

Three internal views controlled by a `view` state string:

- **browse**: lists orders filtered by status (open / in_progress / closed); "How it works" 3-step guide; "Post a Request" button
- **post**: `PostOrderForm` — buyer name, title, description, occasion (free text), budget min/max (₹), deadline (date)
- **detail**: `OrderDetail` — order card, offers list (accept/reject for buyer), make-offer form (for non-buyers), negotiation message thread

Buyer identity determined by comparing `order.buyer_id` to `localStorage`-persisted user ID.

#### History (history tab)
- `GET /api/history` on mount; up to 50 entries
- Each entry: occasion emoji, occasion, relationship, gender badge, budget badge, timestamp (India locale)
- Re-search button (🔁) calls `handleReSearch(params)` in `App.jsx` → switches to home tab with prefill
- Delete individual or "Clear All"

#### Wishlist (wishlist tab)
- `GET /api/wishlist` on mount
- Each item: gift name, relationship · occasion · budget context, Amazon buy link, remove button
- Empty state with prompt

#### Dashboard (dashboard tab)
- `GET /api/analytics` on mount
- 4 stat cards: total searches, unique users, festival searches, voted-gift count
- Bar chart: top 10 occasions
- Horizontal bar: top 10 relationships
- Pie: gender breakdown
- Pie: festival vs non-festival
- Line: daily searches (7-day window)
- Table: top voted gifts (name, relationship, occasion, score, vote count)

---

## 4. User Flow Map

### Primary Gift-Finding Flow
```
App load → tab="home"
  → Hero renders (slideshow, pills, stats)
  → GiftForm renders
    → User selects relationship / gender / budget / occasion → Submit
      → GET /api/recommend
        → 200 OK → GiftResults renders
            → POST /api/vote (👍/👎)       — optimistic score update
            → POST /api/wishlist (🤍)      — save to wishlist
            → Amazon link (🛒)             — new tab
            → "Search Again" → clear result → Hero + GiftForm again
        → 4xx / 5xx → inline error message
```

### History Re-Search Flow
```
Tab: history → GET /api/history
  → User clicks 🔁 on a history item
    → App.handleReSearch({ relationship, occasion, budget, gender })
      → tab = "home", prefill = params, result = null
        → GiftForm renders with pre-populated selects
          → User adjusts or submits → normal flow
```

### Custom Made Flow
```
Tab: custom → view="browse" → GET /api/marketplace/orders?status=open
  → "+ Post a Request" → view="post"
      → PostOrderForm submit → POST /api/marketplace/orders → view="browse"
  → Click order card → view="detail" → GET /api/marketplace/orders/:id
      → Seller: fill offer form → POST .../offers → reload detail
      → Buyer: click Accept → PATCH /api/marketplace/offers/:id {status:"accepted"}
                click Reject → PATCH ...         {status:"rejected"}
      → Anyone: send message → POST .../messages → reload detail
      → "← Back" → view="browse", reload orders
```

---

## 5. API Surface (FastAPI — port 3001)

| Method | Path | Used By |
|---|---|---|
| GET | `/api/recommend` | GiftForm |
| GET | `/api/history` | History |
| DELETE | `/api/history/{id}` | History |
| DELETE | `/api/history` | History (clear all) |
| GET | `/api/options` | Not called by frontend — unused |
| POST | `/api/vote` | GiftResults |
| GET | `/api/wishlist` | Wishlist |
| POST | `/api/wishlist` | GiftResults |
| DELETE | `/api/wishlist/{id}` | Wishlist |
| GET | `/api/analytics` | Dashboard |
| POST | `/api/marketplace/orders` | Marketplace |
| GET | `/api/marketplace/orders` | Marketplace |
| GET | `/api/marketplace/orders/mine` | **Never called by frontend** |
| GET | `/api/marketplace/orders/{id}` | Marketplace (OrderDetail) |
| POST | `/api/marketplace/orders/{id}/offers` | Marketplace (OrderDetail) |
| PATCH | `/api/marketplace/offers/{id}` | Marketplace (OrderDetail) |
| POST | `/api/marketplace/orders/{id}/messages` | Marketplace (OrderDetail) |
| DELETE | `/api/marketplace/orders/{id}` | **Never called by frontend** |

**Note:** `GET /api/options` and `GET /api/marketplace/orders/mine` and `DELETE /api/marketplace/orders/{id}` exist in the backend but have no frontend callers. These are unreferenced endpoints.

---

## 6. Database Schema (SQLite — `gift_data.db`)

```sql
search_logs      (id, user_id, relationship, occasion, budget, gender, created_at)
gift_votes       (id, gift_name, relationship, occasion, vote, created_at)
wishlist         (id, user_id, gift_name, relationship, occasion, budget, created_at)
custom_orders    (id, buyer_id, buyer_name, title, description, occasion,
                  budget_min, budget_max, deadline, status, created_at)
custom_offers    (id, order_id, seller_id, seller_name, description, price,
                  delivery_days, status, created_at)
custom_messages  (id, order_id, offer_id, sender_id, sender_name, message, created_at)
```

`init_db()` uses `CREATE TABLE IF NOT EXISTS` — safe to run on every startup. Migration attempts for `ALTER TABLE ADD COLUMN` are wrapped in bare `except: pass` — silent failures hide potential schema issues.

---

## 7. Design Issues Found

> **Issue count:** 33 total across four categories — 5 Critical (C1–C5), 15 Visual/Design (V1–V15), 8 Accessibility (A1–A8), 5 Performance (P1–P5). The chat summary from Stage A incorrectly stated 22; the individual lists below are the authoritative record. Reconciled in Stage B.


### 7.1 Critical (must address in redesign)

| # | Issue | Location | Impact |
|---|---|---|---|
| C1 | API base URL hardcoded to `http://localhost:3001` | `utils/api.js:1` | Breaks in any non-local deployment |
| C2 | No URL routing — navigation state lost on page refresh; no shareable links; no back button | `App.jsx` | Core UX regression vs. any real website |
| C3 | No loading skeletons — pages flash blank then populate | All components | Jarring, unprofessional |
| C4 | No React error boundary | App-wide | Any thrown error crashes entire app |
| C5 | Budget labels use USD (`$`) but buy links target Amazon India (`.in`) | `options.js`, `GiftResults`, `Wishlist` | Currency inconsistency |

### 7.2 Visual & Design System Issues

| # | Issue | Location |
|---|---|---|
| V1 | Emoji used inside button labels, headings, and stat cards throughout — clashes with premium goal | All components |
| V2 | `fmt()` helper (snake_case → Title Case) duplicated in 5 separate files | GiftResults, History, Wishlist, Dashboard, Marketplace |
| V3 | `occasionEmojis` map duplicated in both GiftResults and History | Both files |
| V4 | Page `<title>` is "Smart Gift Recommender" not "Gift with Love"; no favicon | `index.html` |
| V5 | Hero slideshow content is **entirely hardcoded mock data** — no tie to the real gift database | `Hero.jsx:3-15` |
| V6 | Occasion pills in Hero are **decorative only** — no click action, no filtering | `Hero.jsx:18-26` |
| V7 | Font family conflict: `index.css` declares `font-family: 'Inter'` globally but `tailwind.config.js` sets `font-sans` to `'Lato'` — Lato is never loaded via Google Fonts | `index.css`, `tailwind.config.js` |
| V8 | Custom Tailwind tokens `wine`, `blush`, `petal` defined but **never used** in any component | `tailwind.config.js` |
| V9 | Card gradient colors cycle through loud pink/fuchsia/purple — contradicts ivory + deep burgundy target palette | `GiftResults.jsx:15-24` |
| V10 | 3 decorative full-screen radial gradient blobs fixed behind all content | `App.jsx:19-28` |
| V11 | SVG grain texture `body::before` at 2.5% opacity provides no visible value | `index.css:22-29` |
| V12 | Wishlist and History containers are `max-w-md` (28 rem) — extremely narrow on desktop | `Wishlist.jsx`, `History.jsx` |
| V13 | Dashboard stat cards use bright gradient backgrounds inconsistent with app style | `Dashboard.jsx` |
| V14 | Hardcoded `rounded-3xl` / `rounded-2xl` scattered everywhere with no design-token origin | All components |
| V15 | No responsive mobile navigation — all 5 tabs shown as pill row that wraps awkwardly on small screens | `App.jsx` |

### 7.3 Accessibility Issues

| # | Issue | Location |
|---|---|---|
| A1 | Emoji inside `<button>` labels have no `aria-label` | GiftResults, Hero, App |
| A2 | Carousel prev/next buttons use `‹` / `›` characters with no accessible label | `Hero.jsx` |
| A3 | Hero dot indicator buttons have no text content | `Hero.jsx` |
| A4 | No `role="status"` or `aria-live` on loading/error states | All components |
| A5 | No `lang` attribute on `<html>` | `index.html` |
| A6 | `<label>` elements in Marketplace forms have no `for`/`id` linkage | `Marketplace.jsx` |
| A7 | Wishlist and History remove buttons use `✕` with no `aria-label` | Both files |
| A8 | `<select>` custom arrow SVG may have insufficient contrast | `index.css` |

### 7.4 Performance Issues

| # | Issue | Detail |
|---|---|---|
| P1 | Single JS bundle: **609 KB minified / 171 KB gzipped** | Recharts + lodash + d3 + React in one chunk; no code splitting |
| P2 | Recharts (+ lodash + d3) loaded on every page load | Even users who never visit Dashboard pay the full bundle cost |
| P3 | Hero `setInterval` fires every 4 s for all users on the home tab | Cleans up on unmount, but non-trivial for a decorative feature |
| P4 | Google Fonts loaded synchronously via `<link>` in `<head>` | Render-blocking on first load |
| P5 | No image assets, so no lazy-loading problem today — but no pattern is established | Future images will need `loading="lazy"` strategy |

---

## 8. Build & Test Results

### Production Build

```
Command : npx vite build
Directory: smart-gift-recommender/frontend

✓  838 modules transformed
   dist/index.html                   0.71 kB │ gzip:   0.40 kB
   dist/assets/index-XXXX.css       33.84 kB │ gzip:   6.33 kB
   dist/assets/index-XXXX.js       608.99 kB │ gzip: 171.20 kB

⚠  Warning: chunk > 500 kB after minification
✓  Built in 24.12 s
   Exit code: 0
```

**Result: BUILD PASSES. Zero errors. One size warning (P1 above).**

### Tests

**No test framework is configured.** `package.json` defines only `dev`, `build`, and `preview` scripts. No `*.test.*` or `*.spec.*` files exist anywhere in the source tree.

### Dev Servers (running at time of audit)

| Service | URL | Status |
|---|---|---|
| Backend (Uvicorn) | http://127.0.0.1:3001 | Running — startup complete |
| Frontend (Vite) | http://localhost:2001 | Running — ready in ~2.3 s |

---

## 9. What Must Be Preserved

### Backend Contracts (do not change)
- All 18 API endpoints — paths, methods, query params, request/response shapes
- The 6-level recommendation fallback algorithm in `main.py`
- SQLite schema (6 tables)
- `x-user-id` header convention for user identity
- `init_db()` startup hook

### Frontend Business Logic (preserve, potentially refactor)
- `getUserId()` + `localStorage` persistence (`utils/api.js`)
- `apiFetch()` wrapper — only change needed: make `BASE` URL configurable via env var
- All option values in `data/options.js` (relationships, occasions, budgets)
- History → GiftForm re-search prefill flow
- Optimistic vote scoring in GiftResults
- Marketplace 3-view state machine (browse / post / detail)
- Offer accept/reject buyer-identity check
- All 282 gift-bucket entries in `backend/data/gifts.py`

### Stack (keep as-is)
- Vite + React 18 + Tailwind CSS
- Recharts for Dashboard charts
- Playfair Display (serif) + Inter (sans-serif) from Google Fonts — fix font conflict

---

## 10. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| No URL routing — deep redesign may warrant adding React Router | Medium | Introduce routing in Stage C as a documented enhancement; test all navigation flows after |
| Bundle size (609 KB) may worsen if new UI libraries are added | High | Lazy-load Dashboard with `React.lazy()` before adding any new deps |
| No tests means no regression safety net | High | Add Vitest + React Testing Library in Stage H; write smoke tests for core flows |
| `bare except: pass` in `database.py` migration code hides schema errors | Low | Document; fix if schema issues appear |
| Hero slideshow mock data — real gift data has no images | Medium | Design branded image-less card fallback; do not invent product imagery |
| `CORS allow_origins=["*"]` acceptable for dev; must restrict for production | Low | Document; restrict at deploy time |

---

## 11. Recommended Implementation Order

Following the spec's Stage A → H progression:

| Stage | Focus | Key Work |
|---|---|---|
| **A** | ✅ Audit & baseline | This document |
| **B** | ✅ Design tokens + shared components | `src/tokens.js`, `src/utils/format.js`, `ErrorBoundary`, skeleton components, font fix, env fix, index.html fix |
| **C** | ✅ Global layout — header, nav, footer | `SiteHeader.jsx` (sticky, responsive, drawer), `SiteFooter.jsx`, skip-to-content link, neutral color scale |
| **D** | ✅ Homepage redesign | `Hero.jsx` rewritten: editorial hero, interactive occasion chips (18), relationship cards (6), Custom Made teaser, stats bar. Autoplay slideshow removed. All values wired to real `options.js` data. |
| **E** | ✅ Find a Gift + GiftResults | `GiftForm.jsx` redesigned with design tokens, htmlFor labels, aria-required, loading skeleton, role=alert error; `GiftResults.jsx` redesigned with Card/Badge/Button primitives, aria-pressed, role=status; C3/C5/V1 fixed |
| **F** | Custom Made, Wishlist, History, Dashboard | Widen Wishlist/History, dashboard density improvements |
| **G** | Responsive, accessibility, motion | Mobile nav, ARIA attributes, `prefers-reduced-motion`, skeleton states |
| **H** | Testing, optimization, regression | Vitest setup, lazy-load Dashboard, code-split Recharts, Lighthouse run |

**Immediate priorities before any visual work:**
1. Fix the font conflict (Lato declared but Inter loaded — body font is Inter, not Lato)
2. Move `BASE` URL in `api.js` to a Vite env variable (`VITE_API_URL`)
3. Extract shared `fmt()` and `occasionEmojis` into `utils/format.js`
4. Fix `<html lang="en">` in `index.html` and update `<title>`

---

## 12. Files Inspected

| File | Lines / Size |
|---|---|
| `frontend/src/App.jsx` | 3 548 B |
| `frontend/src/main.jsx` | 245 B |
| `frontend/src/index.css` | 1 301 B |
| `frontend/src/components/Dashboard.jsx` | 10 484 B |
| `frontend/src/components/GiftForm.jsx` | 5 668 B |
| `frontend/src/components/GiftResults.jsx` | 8 219 B |
| `frontend/src/components/Hero.jsx` | 10 968 B |
| `frontend/src/components/History.jsx` | 4 740 B |
| `frontend/src/components/Marketplace.jsx` | 20 626 B |
| `frontend/src/components/Wishlist.jsx` | 2 844 B |
| `frontend/src/data/options.js` | 3 178 B |
| `frontend/src/utils/api.js` | 678 B |
| `frontend/index.html` | ~380 B |
| `frontend/package.json` | ~480 B |
| `frontend/tailwind.config.js` | ~720 B |
| `frontend/vite.config.js` | ~150 B |
| `frontend/postcss.config.js` | ~100 B |
| `backend/main.py` | ~280 lines |
| `backend/database.py` | ~70 lines |
| `backend/data/gifts.py` | 823 lines — 282 gift buckets |
| `backend/requirements.txt` | 2 deps |
| `.kiro/Design/UI-ux-new-design.md` | Full spec read |

---

*End of audit. No application code was modified.*
