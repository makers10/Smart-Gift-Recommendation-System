# Gift with Love — Design System

**Stage:** B — Design Tokens & Foundation  
**Status:** Baseline established; pages to be migrated incrementally in Stages C–F.

---

## 1. Brand Identity

Gift with Love is a premium, emotionally resonant gifting platform. The design language communicates warmth, elegance, and trustworthiness without resorting to flashy gradients or excessive decoration.

**Visual direction:**
- Warm ivory and soft cream backgrounds
- Deep burgundy as the primary brand color
- Muted rose as a secondary accent
- Restrained champagne-gold highlights used sparingly
- Elegant serif headings + highly legible sans-serif body text
- Spacious layouts, refined borders, soft shadows

**Avoid:**
- Generic SaaS dashboard aesthetics on storefront pages
- Excessive pink gradients, glassmorphism, or neon accents
- Emoji-heavy button labels
- Oversized rounded pills as the dominant UI shape
- Animations that delay interaction

---

## 2. Typography

### Font Families
| Role | Family | Loaded via |
|---|---|---|
| **Serif** (headings, editorial) | Cormorant Garamond | Google Fonts CDN |
| **Sans** (body, UI text) | Inter | Google Fonts CDN |

Both fonts are declared in `index.html` with `display=swap` to avoid render-blocking.  
`index.css` resolves the previous Lato/Inter conflict (audit issue V7):

```css
/* body text — Inter */
body { font-family: var(--font-sans); }

/* headings — Cormorant Garamond */
h1, h2, h3, h4, h5, h6, .font-serif { font-family: var(--font-serif); }
```

Tailwind `font-sans` → `['Inter', system-ui, sans-serif]`  
Tailwind `font-serif` → `['Cormorant Garamond', Georgia, serif]`

### Type Scale
Uses Tailwind's default scale. Key editorial sizes:
- Hero headline: `text-6xl` / `text-7xl` serif
- Section heading: `text-3xl` / `text-4xl` serif
- Card title: `text-xl` / `text-2xl` serif
- Body: `text-base` sans (16px / 1.625 line-height)
- Labels / captions: `text-sm` / `text-xs` sans

---

## 3. Color Palette

All tokens are defined in `src/tokens.js` and registered in `tailwind.config.js` as utility classes.

### Ivory (backgrounds)
| Token | Hex | Usage |
|---|---|---|
| `ivory-50` | `#fdfaf6` | Lightest surface (select option bg) |
| `ivory-100` | `#faf5ef` | **Default page background** |
| `ivory-200` | `#f5ede0` | Section contrast backgrounds |
| `ivory-300` | `#ecdcc8` | Card borders, dividers, skeleton loaders |

### Burgundy (primary brand)
| Token | Hex | Usage |
|---|---|---|
| `burgundy-50` | `#fdf2f4` | Hover backgrounds |
| `burgundy-100` | `#fce7eb` | Light tints |
| `burgundy-500` | `#c2274b` | Primary action buttons, focus rings |
| `burgundy-600` | `#9f1239` | **Main brand color** — nav active, headings |
| `burgundy-700` | `#7e0f2e` | Deep heading text |

### Rose (secondary accent)
The existing rose scale is preserved for backward compatibility with components not yet migrated.

### Gold (sparingly)
| Token | Hex | Usage |
|---|---|---|
| `gold-300` | `#f8d878` | Featured/top-pick highlights |
| `gold-400` | `#f0b429` | Gold icon or accent |
| `gold-500` | `#d4941c` | Deep gold text |

---

## 4. Shadows

All defined in `tailwind.config.js`. Use `shadow-*` utility classes:

| Class | Use case |
|---|---|
| `shadow-xs` | Input focus ring area |
| `shadow-sm` | Default card |
| `shadow-md` | Hovered card, dropdown |
| `shadow-lg` | Modal, elevated panel |
| `shadow-xl` | Full-page overlay |
| `shadow-brand` | Primary button (tinted burgundy) |
| `shadow-brand-lg` | Hovered primary button |

---

## 5. Border Radius

| Class | Value | Use case |
|---|---|---|
| `rounded-sm` | 4px | Tags, chips |
| `rounded-base` | 8px | Inputs, small buttons (custom, see tailwind.config) |
| `rounded-card` | 12px | Standard cards (custom alias) |
| `rounded-panel` | 16px | Panels, modals |
| `rounded-feature` | 20px | Feature cards |
| `rounded-full` | 9999px | Pill badges, avatars |

---

## 6. Focus Ring (Accessibility)

Global `:focus-visible` rule in `index.css`:
```css
:focus-visible {
  outline: 2px solid var(--color-burgundy-500);
  outline-offset: 2px;
  border-radius: 4px;
}
```

All interactive elements must remain keyboard-navigable. The `.focus-visible:ring-burgundy-500` Tailwind utilities in the Button primitive enforce this at the component level as well.

---

## 7. Spacing

Tailwind's default 4px base scale is used. No custom spacing values are added — this prevents fragmentation.

---

## 8. Motion

- CSS transitions: `transition-all duration-200` (180ms) for hover states
- `prefers-reduced-motion: reduce` disables all animations globally via `index.css`
- JS intervals (Hero slideshow) should check `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
- No `transition-duration > 400ms` on user-initiated interactions

---

## 9. UI Primitives (Stage B)

Located in `src/components/ui/`:

| File | Component | Purpose |
|---|---|---|
| `Button.jsx` | `Button` | All interactive button needs; variants + sizes |
| `Card.jsx` | `Card`, `CardHeader`, `CardTitle`, `CardBody` | Composable card surfaces |
| `Badge.jsx` | `Badge` | Inline status and context labels |
| `Skeleton.jsx` | `Skeleton`, `Skeleton.Card`, `Skeleton.Text`, `Skeleton.StatCard` | Loading placeholders |
| `ErrorBoundary.jsx` | `ErrorBoundary` | React error catch with branded fallback UI |

Primitives are **not yet applied to all existing components** — migration happens in Stages C–F. The primitives are available for use immediately.

---

## 10. Shared Utilities (Stage B)

| File | Exports | Description |
|---|---|---|
| `src/utils/format.js` | `fmt`, `occasionEmojis`, `formatDate`, `amazonLink` | Shared text/data formatting — replaces 5 duplicate `fmt()` definitions |
| `src/utils/api.js` | `apiFetch`, `getUserId`, `authHeaders` | Centralized API fetch with env-based URL |
| `src/tokens.js` | All design token values | JS-accessible token reference for non-Tailwind contexts |

---

## 11. CSS Custom Properties

Declared in `:root` in `index.css`:

```css
--color-ivory-100:    #faf5ef;   /* page background */
--color-burgundy-500: #c2274b;   /* primary action */
--color-burgundy-600: #9f1239;   /* brand heading */
--font-serif: 'Cormorant Garamond', Georgia, serif;
--font-sans:  'Inter', system-ui, sans-serif;
--transition-base:   180ms cubic-bezier(0.4, 0, 0.2, 1);
--ring-color: var(--color-burgundy-500);
```

These are particularly useful for Recharts `fill` and `stroke` props and inline styles where Tailwind classes cannot be used.

---

## 12. Known Remaining Issues (to address in Stages C–G)

| ID | Issue | Target Stage |
|---|---|---|
| C2 | No URL routing | C |
| C3 | No loading skeletons in existing components | ✅ Done — Stage E (GiftForm shows Skeleton.Card grid while loading) |
| C5 | Budget labels use USD ($) | ✅ Done — Stage E (options.js updated to ₹) |
| V1 | Emoji in button labels | ✅ Done — Stage E (GiftForm + GiftResults buttons emoji-free; aria-label used) |
| V5 | Hero slideshow uses mock data | ✅ Done — Stage D |
| V6 | Occasion pills are decorative only | ✅ Done — Stage D |
| V9 | Old card gradients still in GiftResults (replaced with brand palette in B) | Done ✓ |
| V10 | Decorative gradient blobs in App.jsx (removed in B) | Done ✓ |
| V11 | Grain texture body::before (removed in B) | Done ✓ |
| V12 | Wishlist/History too narrow | ✅ Done — Stage F (max-w-md → max-w-3xl) |
| V13 | Dashboard stat card gradients | ✅ Done — Stage F (ivory/white Card primitive) |
| V15 | No mobile nav | ✅ Done — Stage C |
| A1–A8 | Accessibility fixes | ✅ Done — Stages E, F, G (see detail below) |

**A1** — Emoji in button labels: Fixed in GiftForm (Stage E), GiftResults (Stage E), Hero buttons use aria-label (Stage D), Marketplace loading/buttons (Stage G).  
**A2** — Carousel prev/next: N/A — carousel removed in Stage D.  
**A3** — Hero dot indicators: N/A — carousel removed in Stage D.  
**A4** — role=status/alert: Fixed in GiftForm (Stage E), GiftResults (Stage E), Wishlist/History/Dashboard (Stage F), Marketplace loading (Stage G), App tab live region (Stage G).  
**A5** — lang="en": Fixed in Stage B.  
**A6** — Marketplace label linkage: Fixed in Stage G (htmlFor/id on PostOrderForm; aria-label on offer and message form inputs).  
**A7** — Remove buttons without aria-label: Fixed in Wishlist and History (Stage F).  
**A8** — Select arrow contrast: Arrow is burgundy-600 (#9f1239) on ivory background — passes WCAG AA. Documented in Stage B.
| P1–P2 | Bundle size / code splitting | ✅ Done — Stage H (Dashboard lazy-loaded; initial bundle reduced from 608.99 kB to 221.80 kB / 63.63 kB gzip; >500 kB chunk warning resolved) |

**Stage H Verification & Test Coverage Summary:**
- **Automated Testing Suite**: Vitest + React Testing Library configured in `vite.config.js` and `package.json`. 6 focused test suites covering App navigation, GiftForm, GiftResults, Wishlist, History, and Dashboard (31/31 tests passing, 87.05% statement coverage).
- **Bundle Splitting**: `Dashboard.jsx` (Recharts + d3 + lodash) split into a standalone dynamic chunk (`Dashboard-*.js` ~420.85 kB). Initial client JS reduced by 63.6% (608.99 kB → 221.80 kB; 171.20 kB → 63.63 kB gzipped).
- **Touch Targets**: Systematic upgrade across `SiteHeader` (hamburger, drawer close), `GiftResults` (vote, save, buy), `Wishlist` (remove, buy), and `History` (remove, re-search) to ensure interactive controls meet 44 × 44 CSS pixels.
- **Dynamic Prefill Bug Fixed**: Added `useEffect` in `GiftForm.jsx` to ensure shortcut chips on the homepage properly prefill the form when already mounted.

---

*Last updated: Stage H — Testing, Optimization & Regression Verification (Complete)*
