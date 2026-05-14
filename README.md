# ds-cargo-planner

A small, cargo planning tool for Death Stranding. Use it to compose orders of cargo, compare against storage/vehicle capacity, and see a compact summary of loadable items.

## What it does

- Create and edit orders composed of cargo items
- Calculate totals (weight, dimensions, quantity) and flag overweight items
- Provide a storage/summary view to inspect items by type and available capacity
- Lightweight UI for quickly prototyping packing and capacity checks

## How it's made

- Frontend: vanilla JavaScript + Vite for fast dev server and bundling
- Styling: plain CSS located in src/style.css
- App code organized in small modules under `src/`:
  - `src/main.js` — application entry and UI wiring
  - `src/models/` — `Cargo.js`, `Order.js`, `Storage.js` (data models and logic)
  - `src/utils/` — helper functions, e.g. `cargoFormOps.js`
  - `src/constants/` — `cargoTypes.js`, `vehicles.js` (data manifests)

Tooling

- Built with Vite (dev server and build pipeline)
- Run with Node.js and npm

## Install & Run

1.  Install dependencies:

```
npm install
```

2.  Start development server:

```
npm run dev
```

## Live Site

The site is available at: https://mat-towers.github.io/ds-cargo-planner/

## Project structure (important files)

- `index.html` — app shell
- `src/main.js` — entry point and UI mount
- `src/style.css` — global styles and theme
- `src/models/` — core data models
- `src/utils/` — UI helpers and form ops
- `package.json`, `vite.config.js` — project scripts and build config

## Contributing

- Feel free to open issues or PRs for bugs and enhancements.

## Note

- This project was made with the help of AI. Mainly used for the UI.
