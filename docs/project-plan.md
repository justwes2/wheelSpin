# wheelSpin

tl;dr

A simple react app that can be deployed to github pages (built on push by github actions).

There are lots of tools out there to create a virtual spin-the-wheel with custom slices. However, this tool will also let users configure weights for each slice, so for slices 1 and 2, they maybe 25% likely to happen each, but slice 3 will be 50% likely to happen.

The slices will be stored in a json file in the repo. Note that the totals notionally equal 100, but this isn't a firm requirement- probablities are calcluated by dividing the weight of a slice by the sum of all weights. This respects the relative weights and gives users flexiblity to add and remove slices without having to rebalance the entire set.

```json
{
  "slices": [
    { "label": "apples", "weight": 25 },
    { "label": "bananas", "weight": 25 },
    { "label": "pears", "weight": 50 }
  ]
}
```

When the user opens the app, they will be able to click the 'spin the wheel' button, and after a suitable animation, they will get a random slice, per the assigned weights.

The app should be optimized for mobile viewing, but will be a static web page, not a web or phone app.

## Decisions & Requirements (finalized during planning)

### Tech stack
- **Vite + React + TypeScript**
- **Plain CSS** (CSS Modules per-component) - no Tailwind, to keep the stack simple
- **SVG** for rendering the wheel (precise pie-slice geometry, crisp text labels, scalable)
- Deployed to GitHub Pages via GitHub Actions, base path `/wheelSpin/`

### Slice data
- Slices are a **developer-maintained, build-time** JSON file (`src/data/slices.json`), imported directly into the app.
- Not dynamic/user-editable at runtime - no in-app editor. To change slices, a developer edits the JSON, commits, and pushes; GitHub Actions rebuilds and redeploys automatically.
- Format: `{ "slices": [{ "label": string, "weight": number }, ...] }`

### Wheel visuals
- Colors: a fixed, curated palette (aesthetically chosen), assigned consistently by slice index.
- Each slice must show its label, and slices are sized proportional to their weight.
- Small slices (e.g. ~1%) must remain legible alongside large ones (e.g. 10-30%): font size scales down with slice angle down to a minimum; below a threshold angle, the label moves outside the wheel with a leader line pointing to its slice.
- A **Legend modal** (opened via a button/icon) shows the exact computed probability (percentage) and color swatch for every slice.

### Spin behavior
- Clicking "Spin the wheel" disables the button, runs a **1-2 second** CSS rotation animation (ease-out), and lands a fixed pointer on the winning slice.
- The winning slice is determined by weighted-random selection *before* the animation starts, and the final rotation angle is computed to land the pointer within that slice, plus several extra full rotations for visual effect.
- After the animation completes, a **Result modal** pops up announcing the winning slice name, and the spin button re-enables.
- Users can spin repeatedly with the same slice set (not an elimination game).

### Deployment
- Repo/base path: `wheelSpin` → Vite `base: '/wheelSpin/'`.
- `.github/workflows/deploy.yml` builds on push to `main` and deploys `dist/` to GitHub Pages.
- Enabling GitHub Pages (Settings → Pages → Source: GitHub Actions) is a manual one-time step in the repo UI.

### Testing
- Out of scope for the initial prototype.
- After the prototype is deployed, add tests (e.g. Vitest) for the weighted-random-selection logic and wheel angle/label math. Core logic (`weightedRandom.ts`, `wheelMath.ts`) is being written as pure functions to make this straightforward later.

See `docs/status.md` for the current implementation checklist and progress tracking across sessions.
