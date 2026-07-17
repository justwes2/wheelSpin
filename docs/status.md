# wheelSpin - Status & Progress Tracking

This file tracks implementation progress across sessions, plus notes on out-of-scope work, decisions, and follow-ups. See `docs/project-plan.md` for the full requirements/plan.

## Implementation Checklist

- [x] Scaffold Vite + React + TS project in repo root
- [x] Update devcontainer port forwarding for Vite dev server (5173, host: true)
- [x] Clean up default Vite/React boilerplate (App.tsx, index.css, index.html, removed unused assets)
- [x] Add `slices.json` data file + types (`src/types/slice.ts`)
- [x] Implement weighted-random selection utility (`src/utils/weightedRandom.ts`)
- [x] Implement color palette utility, 20 curated colors + generated fallback for >20 slices (`src/utils/colorPalette.ts`)
- [x] Implement SVG wheel geometry/math (`src/utils/wheelMath.ts`) - arc paths, angle layout, adaptive label font size, outside-label threshold, spin rotation targeting, radial label rotation
- [x] Implement SVG wheel component with proportional slices, palette, adaptive labels/leader-lines (`src/components/Wheel`)
- [x] Implement spin animation + rotation-targeting logic (wired in `App.tsx`, 1.6s ease-out CSS transition, 5 extra spins)
- [x] Implement Result modal (winner announcement) (`src/components/ResultModal`)
- [x] Implement Legend modal (exact probabilities + color swatches) (`src/components/LegendModal`)
- [x] Wire up main App layout, mobile-responsive styling (`src/App.tsx`, `src/App.module.css`)
- [x] Verify local build (`npm run build`) succeeds with no TypeScript/lint errors
- [x] Verify dev server runs correctly with `/wheelSpin/` base path (confirmed working by user)
- [x] Add GitHub Actions workflow for build & deploy to GitHub Pages (`.github/workflows/deploy.yml`)
- [x] Init git repo, create GitHub repo via `gh`, push, enable Pages (GitHub Actions source)
- [x] **v1 deployed and confirmed live on GitHub Pages** (user confirmed working)
- [x] Dark mode support via `prefers-color-scheme` + CSS custom properties (`src/index.css` + all component CSS modules)
- [x] Fix legend button invisible/low-contrast text (explicit theme-aware `color`/`background` on `.legendButton`)
- [x] Radially-oriented in-slice labels (read from center of wheel outward); outside/leader-line labels remain horizontal for readability

## Deferred / Out of Scope (for now)

- [ ] Add automated tests (Vitest) for `weightedRandom.ts` and `wheelMath.ts` - planned for **after** the prototype is deployed and stable
- [ ] In-app editor for slices (explicitly out of scope per requirements - slices are build-time/developer-maintained JSON)
- [ ] Manual/explicit light-dark toggle in the UI (currently follows OS/browser `prefers-color-scheme` only - revisit if user wants an in-app override)

## Notes / Decisions Log

- 2026-07-17: Clarified requirements with user; finalized stack (Vite + React + TS, plain CSS, SVG wheel), slice data as static build-time JSON, legend as a modal, result as a modal, spin duration 1-2s. See `docs/project-plan.md` for full details.
- 2026-07-17: Scaffolded Vite + React + TS app in repo root. Set `base: '/wheelSpin/'` and `server.host: true` in `vite.config.ts` (host binding needed for devcontainer port forwarding to reach the dev server from the host browser). Updated `.devcontainer/devcontainer.json` to forward port 5173 (Vite default) instead of the old CRA-era port 3000, so this persists across container rebuilds.
- 2026-07-17: Expanded the color palette from an initial 10 colors to 20 curated colors (plus a deterministic HSL-generated fallback beyond that), after feedback that the app needs to support at least 15 slices.
- 2026-07-17: Core wheel logic (`weightedRandom.ts`, `wheelMath.ts`) written as pure functions specifically to make adding Vitest tests straightforward later.
- 2026-07-17: `npm run build` and `npm run lint` both pass clean; dev server confirmed working visually by user at `http://localhost:5173/wheelSpin/`.
- 2026-07-17: Deploy pipeline set up entirely via `gh` CLI (no SSH key needed) - `git init`, `git branch -m master main` (fixed default branch name), `gh repo create wheelSpin --public --source=. --remote=origin --push`, and `gh api --method POST repos/<owner>/wheelSpin/pages -f build_type=workflow` to set Pages source to "GitHub Actions". Push to `main` triggered `.github/workflows/deploy.yml` automatically.
- 2026-07-17: **User confirmed v1 is live on GitHub Pages.**
- 2026-07-17: Post-v1 UI feedback addressed:
  - Added dark mode: introduced CSS custom properties (`--bg`, `--surface`, `--text`, `--text-muted`, `--border`, `--accent`, `--accent-text`, `--pointer-color`, `--backdrop`, `--shadow`, `--leader-line`) in `src/index.css`, with light defaults on `:root` and dark overrides inside `@media (prefers-color-scheme: dark)`. All component CSS modules updated to reference these variables instead of hardcoded hex colors. Slice palette colors themselves are unchanged in both themes (they're meant to stay vivid).
  - Fixed low/zero-contrast legend button text: root cause was `color-scheme: light dark` combined with no explicit `color` on `.legendButton`, causing the button to inherit browser dark-mode UA defaults (white-on-white in some browsers). Fixed by giving the button explicit theme-aware `color: var(--text)` and `background: var(--surface)`.
  - Added radial label orientation: added `getRadialLabelRotation()` to `wheelMath.ts` (rotates label by `midAngle - 90` degrees) and applied it as an SVG `rotate()` transform on in-slice `<text>` elements in `Wheel.tsx`, so labels read from the center of the wheel outward. Outside/leader-line labels (for very narrow slices) intentionally remain horizontal for readability.
