import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, ArrowRight, Bot, Cpu } from 'lucide-react'
import { HeroSection } from '@/components/home/HeroSection'
import { GameCarousel } from '@/components/ui/GameCarousel'
import { PlatformGrid } from '@/components/home/PlatformGrid'
import { GenreGrid } from '@/components/home/GenreGrid'
import { GameDataProvider } from '@/lib/provider'

export const metadata: Metadata = {
  title: 'GameRank - Worldwide Video Game Database & Rankings',
  description: 'Discover and rank the greatest video games across PC, PlayStation, Xbox, Nintendo, and mobile with genuine cover artwork, critic scores, and player reviews.',
}

export default async function HomePage() {
  const allGames = await GameDataProvider.getAllGames()

  // Slices for each horizontal carousel
  const trendingGames = [...allGames].sort((a, b) => b.trendingScore - a.trendingScore).slice(0, 15)
  const topRatedGames = [...allGames].sort((a, b) => b.gameRankScore - a.gameRankScore).slice(0, 15)
  const popularGames = [...allGames].sort((a, b) => b.popularity - a.popularity).slice(0, 15)
  
  const pcGames = allGames.filter((g) => g.platforms.some((p) => p.includes('PC'))).slice(0, 15)
  const consoleGames = allGames.filter((g) => g.platforms.some((p) => p.includes('PlayStation') || p.includes('Xbox') || p.includes('Nintendo'))).slice(0, 15)
  const mobileGames = allGames.filter((g) => g.platforms.some((p) => p.includes('Android') || p.includes('iOS'))).slice(0, 15)
  const classicGames = allGames.filter((g) => new Date(g.releaseDate).getFullYear() <= 2017).slice(0, 15)

  return (
    <div className="min-h-screen pb-24">
      {/* 1. Hero Section with GameRank Identity */}
      <HeroSection featuredGames={topRatedGames} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* 2. 🔥 Trending Now Carousel */}
        <GameCarousel
          title="Trending Now"
          subtitle="Games gaining the most momentum across the gaming community right now"
          icon="🔥"
          games={trendingGames}
          showRank={true}
        />

        {/* 3. 🏆 Top Rated Worldwide Carousel */}
        <GameCarousel
          title="Top Rated Worldwide"
          subtitle="The highest scoring video games of all time according to GameRank"
          icon="🏆"
          games={topRatedGames}
          showRank={true}
        />

        {/* 4. Explore by Platform Navigation Grid */}
        <PlatformGrid />

        {/* 5. 💻 Best PC Games Carousel */}
        <GameCarousel
          title="Best PC Games"
          subtitle="Definitive titles available on PC, Steam, and Epic Games"
          icon="💻"
          games={pcGames}
          showRank={true}
        />

        {/* 💻 PC Builder & Performance Planner Spotlight */}
        <section className="relative overflow-hidden rounded-3xl border border-[#00d4ff]/30 bg-gradient-to-r from-[#0c141f] via-[#111c29] to-[#0c141f] p-8 sm:p-12 shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-[#00d4ff]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-80 h-80 bg-[#00ff88]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-[#00d4ff]/15 border border-[#00d4ff]/30 text-[#00d4ff] text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                <Cpu className="w-4 h-4" />
                <span>TechForge PC Builder Lab</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                🖥️ BUILD YOUR DREAM GAMING PC
              </h2>
              
              <p className="text-gray-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Design custom PC builds with automatic socket & clearance checking, real-time FPS estimation across 50+ games, power load calculator, and side-by-side component benchmarks.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/pc-builder"
                className="btn-primary text-sm sm:text-base font-bold px-8 py-3.5 flex items-center gap-2 shadow-xl shadow-[#00ff88]/20 whitespace-nowrap"
              >
                <Cpu className="w-4 h-4" />
                <span>Launch PC Builder</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 6. 🎮 Popular Console Games Carousel */}
        <GameCarousel
          title="Best Console Games"
          subtitle="Blockbusters on PlayStation 5, Xbox Series X|S, and Nintendo Switch"
          icon="🎮"
          games={consoleGames}
          showRank={true}
        />

        {/* 7. Explore by Genre Navigation Grid */}
        <GenreGrid />

        {/* 8. 📱 Best Mobile Games Carousel */}
        <GameCarousel
          title="Best Mobile Games"
          subtitle="High-caliber titles available on Android, iPhone, and iPad"
          icon="📱"
          games={mobileGames}
          showRank={true}
        />

        {/* 9. ⭐ All-Time Classics Carousel */}
        <GameCarousel
          title="All-Time Classics"
          subtitle="Genre-defining games that helped shape the modern industry"
          icon="⭐"
          games={classicGames}
          showRank={true}
        />

        {/* 10. 🎯 FIND YOUR NEXT GAME - AI Game Finder CTA */}
        <section className="relative overflow-hidden rounded-3xl border border-[#00ff88]/30 bg-gradient-to-r from-[#141416] via-[#1a1a24] to-[#141416] p-8 sm:p-12 shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-[#00ff88]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-80 h-80 bg-[#00d4ff]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#00ff88]/15 border border-[#00ff88]/30 text-[#00ff88] text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full">
              <Bot className="w-4 h-4" />
              <span>AI Recommendation Engine</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              🎯 FIND YOUR NEXT GAME
            </h2>
            
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Not sure what to play? Let the AI Game Finder recommend your next favorite game. Type what you feel like playing in natural language or filter by exact platform, genres, and modes.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/ai-game-finder"
                className="btn-primary text-sm sm:text-base font-bold px-8 py-3.5 flex items-center gap-2 shadow-xl shadow-[#00ff88]/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Try AI Game Finder</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/compare"
                className="btn-secondary text-sm sm:text-base font-bold px-6 py-3.5 flex items-center gap-2"
              >
                <span>Compare Top Games</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 11. Transparent GameRank Methodology Card */}
        <section className="glass-card p-8 md:p-12 border border-white/10 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00ff88]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <span className="text-[#00ff88] text-xs font-black uppercase tracking-widest bg-[#00ff88]/10 px-3 py-1 rounded-full border border-[#00ff88]/20">
              Transparent Scoring
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-white mt-4 mb-3">
              How the GameRank Score Works
            </h2>
            <p className="text-gray-300 text-sm md:text-base mb-8 leading-relaxed">
              Every score on GameRank is dynamically computed using a balanced formula that combines critic assessments, community sentiment, real player counts, and release timing.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { weight: '40%', label: 'Critic Score', desc: 'Normalized Metacritic reviews' },
                { weight: '30%', label: 'Community Rating', desc: 'Verified player feedback' },
                { weight: '20%', label: 'Popularity', desc: 'Global player engagement' },
                { weight: '10%', label: 'Recency Curve', desc: 'Rewarding recent excellence' },
              ].map((factor) => (
                <div key={factor.label} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-2xl font-black text-[#00ff88]">{factor.weight}</div>
                  <div className="text-sm font-bold text-white mt-1">{factor.label}</div>
                  <div className="text-xs text-gray-400 mt-1">{factor.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
