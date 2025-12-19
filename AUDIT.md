# SongBinder — Codebase Audit (v2)

Date: 2025-11-05

Scope: Full application (index, performance, editor). Focus on Security (EARS), Code Quality, Performance, and Accessibility. No external frameworks added; all changes in vanilla HTML/CSS/JS.

## Summary

Overall architecture is solid and offline‑first. Key risks centered on XSS via unescaped user content (song titles/lyrics) injected with `innerHTML`. We implemented a robust escaping layer, improved a11y semantics/keyboard support, deferred non‑critical scripts, and added two high‑ROI features: Favorites and Undo Delete.

## Security (EARS)
- XSS: Fixed multiple sinks where user text was interpolated into HTML:
  - `renderSongs`, `renderSetlistSongs`, performance header: now use `escapeHTML()`.
  - `confirmDialog` rebuilt to use `textContent` instead of raw `innerHTML` for messages.
- State: No secrets stored client‑side; IndexedDB is primary store. LocalStorage used for preferences only.
- Resources/API: Client‑only; external libs via same‑origin or CDN. SW caches only same‑origin; traineddata avoids cache.
- Errors: Kept console logging; user toasts now used for failures without leaking internals.

## Code Quality
- Introduced a reusable `escapeHTML()` utility and `showActionToast()` for safe action toasts.
- Reduced implicit global risks; kept modules and functions cohesive.
- Added safer event wiring and reusable tab activation helper; improved ARIA synchronization.

## Performance
- Marked library scripts with `defer` across pages to reduce render‑blocking.
- Lazy‑load app logo; added explicit dimensions to reduce CLS.
- Kept DOM updates batched via `innerHTML` but escaped inputs; heavy lists still render efficiently.

## Accessibility
- Added skip links on all pages.
- Declared tablist/role=tab/aria‑selected/tabindex and added Arrow key navigation for tabs.
- Marked modals with `role="dialog"` + `aria-modal` + `aria-labelledby`.
- Added minimal styles for skip link visibility and toast action buttons.

## Features Added (ROI)
- Favorites: Star songs, filter “Favorites only”, persisted in DB.
  - ROI: Faster retrieval of high‑value songs; reduces search/sort time during rehearsal/performances.
- Undo Delete: Actionable toast allows restoring a deleted song and its setlist references within 8 seconds.
  - ROI: Prevents destructive errors; reduces rework and anxiety during live edits.

## Files Touched
- index.html: Defer scripts, a11y roles, skip link, modal ARIA, img hints.
- performance/performance.html: Defer scripts, skip link.
- editor/editor.html: Defer scripts, skip link.
- script.js: XSS sanitization, confirmDialog safety, Favorites feature, Undo Delete, a11y tab keyboard handling, favorites filter.
- performance/performance.js: XSS sanitization for title, safe confirmDialog.
- style.css: Skip‑link and toast action styles.

## Open Recommendations
- Consider a CSP once all inline code is externalized and CDN domains are enumerated. Current use of WASM may require `'wasm-unsafe-eval'`.
- Consider self‑hosting fonts/icons for privacy and offline reliability.
- Explore focus trapping and Escape‑to‑close for modals for full WCAG parity.

---
# SongBinder — Codebase Audit (v1)

Date: 2025-10-31

Scope: Current repository at project root. Primarily a static web app (HTML/CSS/JS) with an offline-first PWA, IndexedDB persistence, and an editor sub-app. No Flask/React code is present.

## Summary

Overall quality is solid for a static PWA. IndexedDB is used via `idb`, search via Fuse.js, OCR via Tesseract.js, and DOCX parsing via Mammoth. The service worker implements cache-first strategies with care around redirected responses and heavy assets. A few small runtime risks were identified (notably reliance on CDN for SortableJS), and there was no lint/CI pipeline. This audit adds a CI workflow, ESLint/Prettier configuration, .gitignore improvements, and a defensive fix for Sortable usage to avoid errors when offline.

## Findings

### 1) Reliability: CDN dependency for SortableJS
- Severity: Medium
- Details: `index.html` and `editor/editor.html` load SortableJS from a CDN. If offline or blocked, `Sortable` is undefined, causing runtime errors where used (main app’s setlist drag-and-drop). Editor already guards against missing Sortable; main app did not.
- Fix: Added a guard in `script.js` to check `typeof Sortable === 'undefined'` before creating the sortable list and show a one-time informational toast if unavailable.
- Patch: script.js updated; see diff.
- Recommendation: Vendor a local copy under `lib/sortable.min.js` and add a fallback loader in HTML to preserve offline reordering.

### 2) Linting/Formatting/CI missing
- Severity: Medium
- Details: No ESLint/Prettier config or CI existed. This raises long-term maintenance risks.
- Fix: Added `.eslintrc.json`, `.eslintignore`, `.prettierrc`, and a GitHub Actions workflow to run lint and formatting checks.
- Patch: Added files and updated `package.json` scripts and devDependencies.
- Recommendation: Run `npm ci` locally and in CI; maintain a zero-warnings policy.

### 3) Service Worker: Robustness and scope
- Severity: Low
- Details: SW precaches a list mixing paths with and without leading `/`. This typically resolves correctly; SW strips redirects for cached entries and avoids caching `eng.traineddata` which is good.
- Recommendation: Consider normalizing all entries with a leading `/` and adding a fallback for `editor/editor.html` and `performance/performance.html` if navigated directly with query strings. Current logic already handles navigations and ignores search for HTML.

### 4) Data migration flow
- Severity: Low
- Details: On init, the app migrates localStorage to IDB, then calls `loadData()` which reads songs from localStorage (likely empty post-migration), and then loads from IDB and overwrites the earlier state. Behavior is correct but redundant.
- Recommendation: Simplify `loadData()` to avoid reading songs from localStorage now that IDB is authoritative.

### 5) External assets and privacy
- Severity: Low
- Details: FontAwesome and Google Fonts load via external CDNs. `config.js` exposes AI settings; API key remains empty which is good.
- Recommendation: Consider self-hosting fonts/icons for fully offline use and privacy. Keep secrets out of the repo and rely on runtime configuration in `config.js`.

### 6) UX polish
- Severity: Low
- Details: Toasters, modals, and voice features are implemented. Some actions rely on browser features that may not be present.
- Recommendation: Continue graceful degradation: hide or disable voice/clipboard features if unsupported. This is largely done already.

## Performance Notes
- Fuse-based fuzzy search is used selectively; thresholds are sane. Consider limiting search scope when song counts grow large, and debounce search inputs.
- Service worker uses cache-first; consider `stale-while-revalidate` for select assets if desired. Current offline-first posture is reasonable.

## Security Notes
- All data is local; no sensitive writes. The optional OpenRouter integration is client-side; users must provide their own key. Ensure users understand their content may be sent to third parties if that feature is enabled.

## Implemented Changes (Patch Summary)
- script.js: Add global annotations for ESLint; guard Sortable usage with a toast when unavailable.
- package.json: Add `lint` and `format` scripts; devDependencies for ESLint/Prettier.
- .eslintrc.json / .eslintignore / .prettierrc: New configs.
- .github/workflows/ci.yml: New CI workflow to run lint + Prettier check.
- .gitignore: Add common ignores (`node_modules`, `dist`, etc.).

## Suggested Next Steps
- Vendor `Sortable.min.js` locally and add HTML fallback loader.
- Add basic unit tests for small pure functions (e.g., normalization helpers) using a lightweight test runner.
- Consider splitting very large `script.js` into smaller modules for maintainability if a build step is acceptable.
- Add Cypress or Playwright e2e tests for critical flows (import, setlist create/rename/reorder, performance mode) when introducing CI runners.

## How to Run the New Checks
1) Install Node 20+.
2) Run: `npm ci`
3) Lint: `npm run lint`
4) Format check: `npx prettier -c "**/*.{js,css,html,json,md}"`

CI will execute the same steps on pushes and pull requests to `main`/`master`.
