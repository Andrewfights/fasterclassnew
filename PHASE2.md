# Phase 2 — Making Fasterclass real

The design brief (the founder's deck) is ~95% delivered. The site **looks** like the product.
This document scopes what turns it into a product real users can rely on.

## The key finding

Phase 2 is **not** "build a CMS / curation pipeline" — that already exists. The CMS at
`/admin` can add a video by YouTube URL (auto-extracts the ID, thumbnail, and embed URL),
and there are managers for courses, channels, episodes, and collections.

**The entire app reads and writes `localStorage`** (`dataService`, `cmsDataService`,
`authService`, `libraryService`, `preferencesService`, newsletter). That means:
- Content a curator adds is visible only to that curator, only in that browser.
- "Auth" is hardcoded demo users.
- Saves, playlists, progress, and newsletter signups never leave the device.

So Phase 2 = **swap the localStorage service layer for a shared backend.** Because the app
already talks to content/auth through service modules, this is mostly re-implementing those
modules behind the same interfaces — mechanical, not a rewrite.

## Recommended stack

- **Supabase** (Postgres + Auth + Row-Level Security + Edge Functions + Storage). Fastest way
  to get auth, a real DB, and server-side secrets without standing up a custom backend. Free
  tier covers an MVP and early users.
- **Vercel or Netlify** for hosting the existing Vite SPA + a custom domain.
- **YouTube Data API** (in an Edge Function) to auto-fill video metadata on curation.
- **Resend / Beehiiv** (optional) for the newsletter; or just a Supabase table to start.

## ⚠️ Security issue to fix before any real launch

The Gemini API key is currently compiled **into the client bundle** (`vite.config.ts` injects
`process.env.API_KEY`). Anyone can read it from the shipped JS. The AI Guide must call Gemini
through a server-side proxy (Supabase Edge Function) so the key stays secret.

## The MVP — smallest version that gets real users

### Step 1 — The unlock: shared content + real auth
- Create Supabase project; tables: `videos`, `experts`, `topics` (or keep tag-based),
  `courses`, `profiles`, plus join tables for course/video membership.
- One-time **seed migration** from `constants.ts` into the DB.
- Replace `authService` with **Supabase Auth** (email + Google OAuth). Keep the existing
  `LoginPage` UI; just swap the calls.
- Replace `dataService`/`cmsDataService` reads with Supabase queries (same return shapes).
- Result: curation by an admin **persists and is shared with every visitor**. This is the
  single biggest unlock.

### Step 2 — Per-user data
- Tables: `saved_videos`, `playlists` (+ items), `watch_progress`, with RLS so each user only
  sees their own rows.
- Re-point `libraryService` / gamification progress at these.

### Step 3 — Curation polish + integrations
- **YouTube Data API Edge Function**: paste a URL → auto-fill title, duration, channel→expert,
  tags suggestions (today title/expert are typed by hand).
- **Newsletter**: wire the existing capture to a `newsletter_subscribers` table or ESP.
- **Gemini proxy**: move the key server-side (fixes the security issue above).

### Step 4 — Ship
- Deploy SPA (Vercel) + Supabase; custom domain; basic analytics.

## Sequencing logic
Step 1 alone = a real, shared, curated site with real accounts — that's the milestone that
makes it "ready for users." Steps 2–3 fast-follow. Step 4 is a day of deploy work.

## What Phase 2 deliberately does NOT include (keep scope tight)
- No custom backend server (Supabase covers it).
- No video hosting/transcoding (YouTube embeds stay).
- No payments (the product is free per the deck).
- No native mobile app (the web app is already responsive).

## Effort shape
The bulk is Step 1 (schema + seed + auth swap + content-read swap). It's tractable because the
services are already abstracted — most components never touch storage directly, they call a
service. Swap the service implementation, keep the interface, and the UI keeps working.

## Open decisions for the founder
1. **Auth method**: email magic-link, email+password, Google OAuth, or a combination?
2. **Who curates**: just the founder/admin, or invited curators with roles?
3. **Content source of truth**: keep `constants.ts` as the seed and curate forward, or import
   a fresh corpus "from everywhere" (deck slide 6) at launch?
4. **Newsletter tool**: simple DB table to start, or an ESP (Beehiiv/Resend) from day one?
