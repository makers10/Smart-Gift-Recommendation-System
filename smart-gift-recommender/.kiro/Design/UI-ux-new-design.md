# Project: Gift with Love — Premium Website Redesign

## Role

Act as a senior UI/UX designer, senior React engineer, design systems architect, and frontend performance engineer.

Redesign my existing Gift with Love website into a polished, premium, production-ready gifting platform.

**Current stack:** React + Tailwind CSS  
**Development tools:** Kiro, Cursor, or Claude Code  
**Component inspiration:** Origin UI, 21st.dev, and carefully selected modern React UI libraries.

This is a complete website redesign, not a new project.

## 1. First: Audit the Existing Codebase

Before modifying any files:

1. Inspect the project structure, package.json, routing, components, styles, assets, API integrations, state management, and data models.
2. Identify all existing pages, routes, user interactions, and functionality.
3. Understand how Find a Gift, Custom Made, History, Wishlist, Dashboard, featured gift carousels, filters, and any existing gift-selection workflows operate.
4. Identify the existing design inconsistencies, duplicated components, responsive issues, and potential performance problems.
5. Run the existing build and tests if available.
6. Create a feature inventory and regression checklist.

Document your findings in `docs/REDESIGN_AUDIT.md`.

Do not assume that every feature shown in a screenshot represents the complete application.

Do not replace working business logic with mock data or a static UI.

## 2. Establish the New Brand Identity

Create a luxury editorial design system for Gift with Love.

Visual direction:
- Warm ivory and soft cream backgrounds.
- Deep burgundy as the primary brand color.
- Muted rose and blush pink as secondary accents.
- Subtle champagne-gold accents used sparingly.
- Elegant serif headings and highly readable sans-serif body text.
- High-quality gift photography with consistent image ratios.
- Spacious layouts, refined borders, soft shadows, and carefully controlled whitespace.

Avoid:
- Generic SaaS dashboard aesthetics on the storefront.
- Excessive pink gradients and glassmorphism.
- Emoji-heavy product cards.
- Excessive rounded pills and occasion chips.
- Oversized empty hero sections.
- Unnecessary decorative animations.
- Randomly combining components from multiple design systems.

The finished website should feel warm, emotional, premium, trustworthy, and easy to shop.

Create design tokens for colors, typography, spacing, radii, shadows, transitions, and responsive breakpoints. Use shared tokens instead of scattered hardcoded styling values.

Document the system in `docs/DESIGN_SYSTEM.md`.

## 3. Use UI Resources Strategically

Inspect:
- https://www.originkit.dev/
- https://21st.dev/
- https://motion.dev/docs/react
- https://lucide.dev/

Use Origin UI for appropriate reusable form controls and interface components.

Use 21st.dev to discover distinctive hero sections, interactive product cards, navigation patterns, and other components that genuinely improve the experience.

Use Motion for React only where animation adds value. Prefer CSS transitions for simple hover states.

Use Lucide for consistent interface icons.

Before installing dependencies:
- Inspect the existing stack and package.json.
- Reuse compatible installed packages.
- Check each component's dependencies and licensing.
- Adapt copied components to the established design tokens.
- Avoid installing overlapping libraries for the same purpose.

Do not assume every external example can be copied without adaptation.

## 4. Redesign the Global Layout

Create a consistent, responsive application shell.

Header:
- Premium brand logo and wordmark.
- Search entry point.
- Find a Gift navigation.
- Custom Made navigation.
- Wishlist with an appropriate item count if available.
- History and Dashboard links where appropriate.
- Responsive mobile navigation with an accessible menu.

The storefront navigation must prioritize shopping and gift discovery. Administrative navigation should not overwhelm the shopping experience.

Footer:
- Brand introduction.
- Relevant gift discovery links.
- Existing contact or support links, if present.
- Existing policies and social links, if present.

Never invent contact details, business claims, policies, or social profiles.

## 5. Redesign the Homepage

Build the homepage in the following order, adapting to existing product capabilities:

1. Compact announcement bar only if useful.
2. Premium header.
3. Editorial hero with an emotional headline, supporting text, compelling gift imagery, and a clear “Find Your Perfect Gift” CTA.
4. A quick gift-discovery entry point.
5. Curated gift collections.
6. Featured or trending gifts using existing product data.
7. Occasion-based discovery.
8. Relationship-based recommendations.
9. Budget-based gift discovery.
10. A custom-made gift promotion, if supported.
11. Trust-building content only when existing information supports it.
12. Complete footer.

Use real product data where available.

Create a cohesive visual hierarchy. Do not simply rearrange the existing sections while retaining the same cluttered appearance.

The hero should communicate the brand immediately and provide a clear next step.

## 6. Redesign Existing Functional Pages

### Find a Gift
- Clear, guided gift-discovery experience.
- Filters for recipient, relationship, occasion, and budget where supported.
- Search, sorting, result counts, and empty states where appropriate.
- Clear selected-filter indicators and reset functionality.
- Preserve existing recommendation logic and data flow.

### Custom Made
- Clear customization steps and intuitive form layout.
- Proper validation and useful error messages.
- Preserve all existing customization options and submission behavior.

### Wishlist
- Attractive saved-product cards.
- Functional save/remove interactions.
- Persistent wishlist behavior consistent with the existing application.
- Helpful empty state and clear navigation back to gift discovery.

### History
- Present existing history records in a readable format.
- Preserve sorting, filtering, and navigation functionality where supported.
- Include loading, empty, and error states.

### Dashboard
- Preserve existing metrics, actions, data sources, and administrative functionality.
- Use a more information-dense dashboard layout than the storefront.
- Add responsive charts or tables only where the existing data justifies them.

### Shared interfaces
- Product details or quick-view dialogs.
- Search interface.
- Filter panels.
- Confirmation dialogs.
- Notifications.
- Loading skeletons.
- Error and empty states.

Only implement features that match existing functionality or are explicitly added as a separate, documented enhancement.

## 7. Product Cards and Image Strategy

Design a reusable product-card component with:
- Consistent image aspect ratio.
- Product name and category.
- Price only when available.
- Wishlist action.
- Appropriate badges only when supported by data.
- Accessible product details interaction.
- Subtle hover and focus states.

Use optimized, appropriately licensed product imagery.

Do not invent product images, prices, discounts, ratings, availability, or reviews and present them as real inventory.

If product data lacks images, provide an intentional branded fallback.

Use lazy loading for below-the-fold images and avoid loading large assets unnecessarily.

## 8. Responsive Design

Use a mobile-first approach.

Verify:
- Small mobile screens.
- Larger phones.
- Tablets.
- Laptops.
- Wide desktop screens.

Requirements:
- No unintended horizontal overflow.
- Touch-friendly controls.
- Readable text and appropriate spacing.
- Responsive navigation and filters.
- Product grids that adapt naturally.
- Carousels usable with touch, keyboard, and visible controls.
- Modals that fit smaller screens.
- Consistent visual hierarchy at all breakpoints.

Do not merely shrink the desktop design for mobile. Adapt the experience to the available space.

## 9. Motion and Interaction

Use subtle, purposeful interactions:
- Short hover transitions.
- Small product-card lift or image zoom.
- Restrained section entrance animations.
- Smooth carousel transitions.
- Clear button press feedback.
- Animated dialogs when appropriate.

Prefer transform and opacity animations when possible.

Respect `prefers-reduced-motion`.

Avoid excessive parallax, continuously moving backgrounds, unnecessary particle effects, and animations that delay interaction.

Core navigation and actions must remain usable if animations are disabled.

## 10. Accessibility and Performance

Implement:
- Semantic HTML.
- Accessible form labels.
- Keyboard navigation.
- Visible focus indicators.
- Appropriate contrast.
- Accessible dialog behavior.
- Descriptive image alt text.
- Correct button and link semantics.
- Reduced-motion support.

Performance:
- Reuse the existing bundler and configuration.
- Avoid unnecessary dependencies and oversized client-side bundles.
- Optimize images and fonts.
- Lazy-load appropriate noncritical content.
- Avoid unnecessary React re-renders.
- Keep expensive work out of frequent render paths.
- Preserve existing SEO and routing behavior.

Use Lighthouse or equivalent tooling when available. Record actual results rather than claiming unmeasured scores.

## 11. Preserve Existing Functionality

This requirement is critical.

Do not:
- Delete working routes.
- Replace real APIs with hardcoded arrays.
- Break authentication or authorization if present.
- Change backend contracts without necessity.
- Remove existing validation.
- Break wishlist or history persistence.
- Expose environment variables or API keys.
- Rewrite the entire application without understanding its dependencies.

Preserve current behavior unless a change is required and explicitly documented.

If an existing feature is broken, document the issue and fix it only when the cause and intended behavior are clear.

## 12. Implementation Workflow

Work in small, verifiable stages:

Stage A: Audit and baseline.

Stage B: Design tokens and shared components.

Stage C: Global header, navigation, and footer.

Stage D: Homepage.

Stage E: Find a Gift and shared product components.

Stage F: Custom Made, Wishlist, History, and Dashboard.

Stage G: Responsive behavior, accessibility, and motion.

Stage H: Testing, optimization, and regression verification.

After each stage:
1. Run the relevant build or tests.
2. Check for console errors.
3. Verify the affected user flows.
4. Review the responsive layout.
5. Fix regressions before continuing.

Create or update documentation for significant architectural decisions.

## 13. Definition of Done

The redesign is complete only when:

- All existing routes remain functional.
- Existing APIs and data integrations still work.
- Find a Gift, Custom Made, History, Wishlist, and Dashboard work as intended.
- All major pages share the same design system.
- Mobile, tablet, and desktop layouts have been checked.
- Loading, empty, success, and error states are handled appropriately.
- Keyboard navigation and reduced-motion behavior are verified.
- No known critical build errors remain.
- Relevant automated tests pass.
- No fake production data or exposed secrets have been introduced.
- Actual test results and known limitations are documented.

At the end, provide:
1. Summary of the redesign.
2. Files created, modified, or removed.
3. Dependencies added and why.
4. Existing functionality preserved.
5. Tests and build commands executed with actual results.
6. Remaining bugs or limitations.
7. Recommended next steps.

Start with the codebase audit and design-system plan. Then implement the redesign incrementally. Do not stop after producing a plan or mockup; continue through implementation and verification wherever the available environment permits.