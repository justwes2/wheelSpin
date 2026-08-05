# Developer Guide

Quick reference for common commands. This project uses Vite + React + TypeScript,
and is deployed to GitHub Pages via GitHub Actions on every push to `main`.

## Setup (first time only)

```
npm install
```

## Local development

Start the dev server (hot-reloading, served at `http://localhost:5173/wheelSpin/`
because of the `/wheelSpin/` base path configured for GitHub Pages):

```
npm run dev
```

Preview the production build locally (after running `npm run build`):

```
npm run preview
```

## Build & verify

Type-check + production build (output goes to `dist/`):

```
npm run build
```

Lint the codebase:

```
npm run lint
```

> **Note:** There is no automated test suite yet (`npm test`/Vitest is planned but
> not set up - see `docs/status.md` under "Deferred / Out of Scope"). Until then,
> `npm run build` and `npm run lint` are the two commands to run before considering
> a change "verified."

## Editing the wheel's slices

Slice data lives in `src/data/slices.json`. Add/remove/edit entries and their
`weight` values, then rebuild - probabilities are calculated automatically from
the relative weights (they don't need to sum to 100).

## Git / GitHub workflow

Per `.clinerules`, Cline will never run git write commands (`add`/`commit`/`push`)
on its own - that's always a manual step for you. Here's the cheat sheet:

### One-time setup (already done for this repo, included for reference)

Authenticate the GitHub CLI (opens a browser or lets you paste a token - no SSH
key needed, `gh` sets itself up as a git credential helper for HTTPS remotes):

```
gh auth login
```

Check you're logged in:

```
gh auth status
```

### Normal day-to-day workflow

Once `gh auth login` has been done once, pushing is just plain `git` - `gh`
handles authentication transparently in the background:

```
git status                          # see what changed
git add -A                          # stage everything
git commit -m "Describe the change" # commit
git push                            # push to origin/main
```

Pushing to `main` automatically triggers the deploy workflow
(`.github/workflows/deploy.yml`), which lints, builds, and publishes to GitHub
Pages.

### Useful `gh` commands for checking on things

```
gh run list --limit 5          # recent GitHub Actions runs
gh run watch <run-id>          # watch a specific run live
gh repo view --web             # open the repo in a browser
```

Live site: https://justwes2.github.io/wheelSpin/
