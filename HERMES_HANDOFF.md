# GameRank — Project Context & Handoff Summary for AI Agents

> **For Hermes / Next AI Agent**: This document provides full architectural context, current implementation status, data models, and instructions to seamlessly continue development and deployment of **GameRank**.

---

## 1. Project Overview & Location

- **Project Name**: GameRank
- **Description**: A production-ready worldwide video game ranking and discovery platform built with Next.js 14 App Router, TypeScript, and Tailwind CSS.
- **Repository / Directory Path**:
  `C:\Users\DHRUV SISODIA\.gemini\antigravity\scratch\gamerank`
- **Git Status**: Git initialized on branch `main` with all code committed.
- **Current Development Status**: Complete, fully functional, production build tested (`npm run build` succeeds), running locally on `http://localhost:3000`.

---

## 2. Core Requirements Implemented

1. **100% Poster/Cover Image Rule**: Every game displayed on the site uses vertical **3:4 aspect-ratio cover art / posters**. No plain text-only cards or broken image icons.
2. **Scalable Data Layer (`GameDataProvider`)**: An abstraction layer in `lib/provider.ts` that decouples UI components from data sources. Powered by a local high-fidelity database of 50+ headline franchises in `lib/database.ts` plus dynamic server-side fallback to the RAWG API.
3. **Horizontal Game Carousels**: `GameCarousel` component on the homepage supporting arrow buttons, touch swipe, and wheel scroll.
4. **Transparent GameRank Score (0–100)**:
   $$\text{Score} = \text{Critic (40\%)} + \text{Community (30\%)} + \text{Popularity (20\%)} + \text{Recency (10\%)}$$
5. **Multi-Platform & Genre Coverage**: PC, PlayStation (PS4/PS5), Xbox (One/Series X|S), Nintendo Switch, Android, iOS, and Cross-Platform.
6. **Live Search & URL-Persisted Filters**: Search by title, filter by platform/genre, sort by score, popularity, or release date.
7. **Cinematic Game Detail Pages (`/games/[slug]`)**: Backdrop wallpaper, 3:4 cover poster, score breakdowns, developer credits, screenshots gallery, and related franchise games.
8. **Security**: `RAWG_API_KEY` is only ever accessed server-side in Next.js Server Components and API proxy routes (`app/api/*`). Never leaked to the client bundle.

---

## 3. Technology Stack & Key Files

| Layer | File / Directory | Purpose |
|---|---|---|
| **Framework** | Next.js 14.2.5 (App Router) | React Server Components + selective Client hydration |
| **Styling** | `tailwind.config.ts`, `app/globals.css` | Dark charcoal (`#0f0f0f`), neon accents (`#00ff88`, `#00d4ff`), glassmorphism |
| **Image Engine** | `components/ui/GameImage.tsx` | Lazy loading, aspect ratio enforcement, skeleton loaders, and neon fallback art |
| **Data Provider** | `lib/provider.ts` | Scalable `GameDataProvider` querying seed data and RAWG API |
| **Seed Database** | `lib/database.ts` | 50+ major games with official cover URLs, backgrounds, and metadata |
| **Data Types** | `types/database.ts`, `types/index.ts` | Strict TypeScript interfaces for games, rankings, and filters |
| **Homepage** | `app/page.tsx` | Hero spotlight + 6 horizontal carousels + platform & genre grids |
| **Detail Route** | `app/games/[slug]/page.tsx` | Deep dive into any individual game |
| **Rankings Route** | `app/rankings/[category]/page.tsx` | Dynamic category ranking lists (e.g. `all-time`, `pc`, `rpg`, `ps5`) |
| **Search Route** | `app/search/page.tsx` | Global search and multi-facet filtering engine |
| **CDN Domains** | `next.config.mjs` | Configured remote image domains (`media.rawg.io`, `cdn.akamai.steamstatic.com`, etc.) |

---

## 4. Pending / Next Steps for Hermes

If the user wants to continue or expand the project, here are the immediate next tasks:

### A. GitHub Push & Vercel Hosting
- **GitHub CLI (`gh`)** is already installed on the machine at `C:\Program Files\GitHub CLI\gh.exe`.
- The user needs to authenticate with GitHub (`gh auth login`).
- Once authenticated, create and push to GitHub:
  ```powershell
  cd "C:\Users\DHRUV SISODIA\.gemini\antigravity\scratch\gamerank"
  gh repo create gamerank --public --source=. --remote=origin --push
  ```
- Deploy to Vercel via CLI or the Vercel web dashboard:
  ```powershell
  npx --yes vercel --prod
  ```
  *(Remember to set `RAWG_API_KEY` and `NEXT_PUBLIC_SITE_URL` in Vercel environment variables).*

### B. Scalability Expansion
- If the user wants to expand the database from 50 to 1,000+ games, modify `scripts/generate-database.js` or connect a persistent database like PostgreSQL/Prisma or Supabase via `lib/provider.ts`.
- The `GameDataProvider` abstraction was specifically architected so changing the underlying database requires modifying only `lib/provider.ts` without touching any UI page components.

### C. Useful Commands
- **Run local server**: `node "node_modules/next/dist/bin/next" start` (production) or `node "node_modules/next/dist/bin/next" dev` (development)
- **Type check**: `npm run type-check`
- **Build**: `npm run build`
