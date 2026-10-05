# GameRank 🎮 — Worldwide Gaming Ranking & Discovery Platform

GameRank is a production-ready gaming discovery platform built with Next.js 14 App Router, TypeScript, and Tailwind CSS. It discovers, ranks, and showcases video games across PC, PlayStation, Xbox, Nintendo Switch, iOS, and Android using real data sourced from the **RAWG Video Games Database API**.

---

## ✨ Features

- **🏆 Worldwide Rankings**: 23 specialized ranking categories:
  - Overall: *Top 100 Games of All Time*, *Most Popular Right Now*, *Best Games of the Year*, *Most Anticipated Upcoming*
  - Platforms: *PC*, *PlayStation*, *Xbox*, *Nintendo*, *Android*, *iOS*, *Cross-Platform*
  - Genres: *Action*, *RPG*, *Shooter*, *Strategy*, *Horror*, *Sports*, *Racing*, *Indie*
  - Features: *Multiplayer*, *Open-World*, *Story-Rich*, *Free-to-Play*
- **🧮 Transparent Ranking Algorithm**: Multi-factor weighted score calculated from genuine data:
  - **40% Critic Score**: Normalized Metacritic rating
  - **30% Community Rating**: Real RAWG user score
  - **20% Popularity**: Log-scaled player community engagement count
  - **10% Recency Bonus**: Rewarding standout releases from recent years
- **🎬 Cinematic Game Detail Pages**: High-resolution banners, screenshots carousel, critic vs community rating comparison, full system requirements (PC), developer & publisher credits, official links, and related franchise titles.
- **🔍 Advanced Search & Filter System**: Live search by game title, filterable by genre, platform, and sorting order (ratings, popularity, release date).
- **🛡️ Secure Server-Side Architecture**: Next.js App Router API proxy routes that keep your `RAWG_API_KEY` protected on the server, never exposing secrets to client bundles.
- **⚡ High Performance & ISR Caching**: Server-side rendering paired with incremental static revalidation (ISR) and image optimization.
- **📱 Fully Responsive Dark UI**: Charcoal background palette (`#0f0f0f`), glowing neon accents (`#00ff88`, `#00d4ff`), glassmorphism cards, and mobile-first layouts.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Source**: [RAWG Video Games Database API](https://rawg.io/apidocs)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17+ or 20+
- npm, pnpm, or yarn

### 1. Clone the repository

```bash
git clone https://github.com/your-username/gamerank.git
cd gamerank
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Fill in your RAWG API key:

```env
# Get your free API key at: https://rawg.io/apidocs
RAWG_API_KEY=your_rawg_api_key_here

# Site URL (for local development)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note**: A RAWG API key is free. Sign up at [rawg.io](https://rawg.io/login) and visit [rawg.io/apidocs](https://rawg.io/apidocs) to generate your key.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore GameRank!

---

## 🏗️ Building for Production

```bash
npm run type-check   # Runs strict TypeScript validation
npm run build        # Creates optimized production build
npm run start        # Starts the production server
```

---

## 📊 Ranking Methodology & Data Integrity

GameRank never fabricates scores, invents fake reviews, or hard-codes static rankings. Every metric is computed dynamically using real metadata from verified database records:

$$\text{GameRank Score} = S_{\text{critic}} (40\%) + S_{\text{community}} (30\%) + S_{\text{popularity}} (20\%) + S_{\text{recency}} (10\%)$$

- **Critic Score ($S_{\text{critic}}$)**: Extracted directly from official Metacritic aggregate scores normalized to a 40-point scale.
- **Community Score ($S_{\text{community}}$)**: RAWG 5-star community user reviews scaled to 30 points.
- **Popularity ($S_{\text{popularity}}$)**: Active player library metrics scaled to 20 points, ensuring niche titles with only 2 reviews cannot game the top slots.
- **Recency ($S_{\text{recency}}$)**: A 10-point curve acknowledging recent modern masterpieces without penalizing timeless classics.

---

## 🚢 Vercel Deployment Guide

Deploying GameRank to Vercel takes less than 2 minutes:

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of GameRank platform"
   git remote add origin https://github.com/<your-username>/gamerank.git
   git branch -M main
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
   - Click **"Add New..."** > **"Project"**.
   - Select your `gamerank` repository and click **Import**.

3. **Configure Environment Variables**:
   In the Vercel project configuration screen, add:
   - `RAWG_API_KEY`: *Your RAWG API key*
   - `NEXT_PUBLIC_SITE_URL`: *`https://gamerank.vercel.app` (or your custom domain)*

4. **Deploy**:
   - Click **Deploy**. Vercel will build and launch your production deployment with global Edge caching!

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE). Game metadata and artwork are courtesy of the [RAWG Video Games Database](https://rawg.io).
