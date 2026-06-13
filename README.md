# Fasterclass

Signal, not noise — a curated learning platform for founders. The best startup advice on the
internet, organized by topic and by the biggest names in the game.

## Run locally

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. Run the app: `npm run dev`

No API keys or environment variables are required.

## Deploy

Push to GitHub (private repo recommended) and import into Vercel. It auto-detects Vite
(`vite build` → `dist`); `vercel.json` handles SPA routing. No env vars needed.

See [PHASE2.md](PHASE2.md) for the plan to make it production-ready (real backend, auth,
shared content).
